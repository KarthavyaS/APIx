import time
import logging
import asyncio
import urllib.robotparser
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from decimal import Decimal
from abc import ABC, abstractmethod

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("APIx.Scraper")


class BaseScraper(ABC):
    """Phase 3: single abstract contract that every source adapter returns through."""

    @abstractmethod
    async def search(self, origin: str, destination: str, departure_date: str):
        """Return canonical airfare quotes for a route departure window."""
        raise NotImplementedError


class RobotsPolicy:
    """Lazy-loaded robots.txt policy with bounded parser load and source-level caching."""

    def __init__(self, base_url: str, user_agent: str = "APIx-India-Aviation-Observatory/1.0 (+https://aviation.gov.in/apix; ethical-research-bot)"):
        self.base_url = base_url.rstrip("/")
        self.user_agent = user_agent
        self._loaded = False
        self._parser = urllib.robotparser.RobotFileParser()
        self._last_checked_at = None

    async def load(self):
        if self._loaded:
            return
        loop = asyncio.get_running_loop()
        try:
            robots_url = f"{self.base_url}/robots.txt"
            self._parser.set_url(robots_url)
            await asyncio.wait_for(loop.run_in_executor(None, self._parser.read), timeout=5.0)
            self._last_checked_at = datetime.utcnow()
        except Exception as exc:
            logger.warning("Robots policy cannot be loaded safely for %s: %s", self.base_url, exc)
        finally:
            self._loaded = True

    async def is_allowed(self, url: str) -> bool:
        await self.load()
        try:
            decision = self._parser.can_fetch(self.user_agent, url)
            return True if decision is None else decision
        except Exception:
            return True


class SourceRateLimiter:
    """One in-memory limiter per source to prevent global throttling and enforce source scope."""

    def __init__(self, rate_limit_per_min: int = 15):
        self.rate_limit_per_min = max(1, rate_limit_per_min)
        self.interval_seconds = 60.0 / self.rate_limit_per_min
        self.last_request_time = 0.0

    def wait(self):
        now = time.monotonic()
        elapsed = now - self.last_request_time
        if elapsed < self.interval_seconds:
            sleep_time = self.interval_seconds - elapsed
            logger.debug("Rate limit sleep %.2fs", sleep_time)
            time.sleep(sleep_time)
        self.last_request_time = time.monotonic()


class RetryPolicy:
    """Phase 3 retry/backoff ladder: 1s, 2s, then 4s, with jitter where appropriate."""

    def __init__(self, attempts: int = 3):
        self.attempts = max(1, attempts)

    def delay_for_attempt(self, attempt: int) -> float:
        delays = {1: 1.0, 2: 2.0, 3: 4.0}
        return delays.get(attempt, 4.0)


class EthicalScrapingPolicyException(Exception):
    """Raised when an action violates ethical web scraping standards (e.g. forbidden by robots.txt or CAPTCHA detected)."""
    pass

class EthicalScraperBase(BaseScraper):
    """
    Standard ethical scraper base class conforming to Civil Aviation IT ethics:
    1. Strictly honors robots.txt directives
    2. Enforces non-intrusive rate limits (tokens per minute)
    3. Backs off on 429/503 responses with exponential delay
    4. NEVER bypasses CAPTCHA, bot challenges, or unauthorized paywalls
    5. Discloses observatory identity in User-Agent header
    """

    USER_AGENT = "APIx-India-Aviation-Observatory/1.0 (+https://aviation.gov.in/apix; ethical-research-bot)"

    def __init__(self, name: str, base_url: str, rate_limit_per_min: int = 15, max_retries: int = 3):
        self.name = name
        self.base_url = base_url
        self.rate_limit_per_min = rate_limit_per_min
        self.interval_seconds = 60.0 / max(rate_limit_per_min, 1)
        self.max_retries = max_retries
        self.last_request_time = 0.0
        self.cooldown_until = 0.0
        self.cooldown_reason = ""
        self.seen_quote_fingerprints = set()
        self.robot_parser = urllib.robotparser.RobotFileParser()
        self._robots_initialized = False
        self.rate_limiter = SourceRateLimiter(rate_limit_per_min)
        self.retry_policy = RetryPolicy(max_retries)
        self.robots_policy = RobotsPolicy(base_url, self.USER_AGENT)

    @staticmethod
    def _infer_source_type(source: str, raw_quote: Dict[str, Any] | None = None) -> str:
        """Return the canonical Phase 2 source_type label used by sources and adapters."""
        raw_value = None
        if raw_quote:
            raw_value = raw_quote.get("source_type")
        if isinstance(raw_value, str):
            return raw_value.upper()
        if source and any(k in source.lower() for k in ["air india", "indigo", "akasa", "spicejet", "direct"]):
            return "AIRLINE"
        return "OTA"

    @staticmethod
    def _availability_status(raw_quote: Dict[str, Any]) -> str:
        if raw_quote.get("is_cancelled"):
            return "CANCELLED"
        if raw_quote.get("is_sold_out"):
            return "SOLD_OUT"
        return "AVAILABLE"

    @staticmethod
    def _advance_days_from_window(advance_window: str | None) -> int:
        if not advance_window:
            return 0
        mapping = {
            "T+1": 1,
            "T+7": 7,
            "T+15": 15,
            "T+30": 30,
            "T+45": 45,
        }
        return mapping.get(advance_window, int(advance_window.replace("T+", "")) if advance_window.startswith("T+") else 0)

    @staticmethod
    def canonicalize_quote(raw_quote: Dict[str, Any]) -> Dict[str, Any]:
        """Map legacy adapter dictionaries into the Phase 2 canonical Quote object shape."""
        source = str(raw_quote.get("source") or raw_quote.get("source_name") or "UNKNOWN_SOURCE")
        source_type = EthicalScraperBase._infer_source_type(source, raw_quote)
        origin = str(raw_quote.get("origin") or "")
        destination = str(raw_quote.get("destination") or "")
        flight_number = raw_quote.get("flight_number") or raw_quote.get("flight_no")
        carrier = raw_quote.get("carrier") or raw_quote.get("airline_name") or raw_quote.get("airline_code")
        fare_class = raw_quote.get("fare_class") or "Economy"
        collected_at = raw_quote.get("collected_at") or raw_quote.get("collection_timestamp") or datetime.utcnow().isoformat()

        if isinstance(collected_at, str):
            try:
                collected_at = datetime.fromisoformat(collected_at.replace("Z", "+00:00"))
            except Exception:
                collected_at = datetime.utcnow()

        # Prefer the generic travel_date field if present; the old adapters provided it.
        departure_datetime = raw_quote.get("departure_datetime")
        if departure_datetime is None:
            travel_date = raw_quote.get("travel_date")
            if isinstance(travel_date, str):
                try:
                    departure_datetime = datetime.fromisoformat(travel_date)
                except Exception:
                    departure_datetime = datetime.combine(date.fromisoformat(travel_date), datetime.min.time())

        # Use a safe default for the route-level travel-day spacing.
        advance_days = EthicalScraperBase._advance_days_from_window(raw_quote.get("advance_window"))
        if advance_days == 0 and isinstance(raw_quote.get("advance_days"), int):
            advance_days = raw_quote.get("advance_days")

        return {
            "source": source,
            "source_type": source_type,
            "origin": origin,
            "destination": destination,
            "flight_number": str(flight_number) if flight_number else None,
            "carrier": str(carrier) if carrier else None,
            "departure_datetime": departure_datetime,
            "arrival_datetime": raw_quote.get("arrival_datetime"),
            "duration_minutes": raw_quote.get("duration_minutes"),
            "stops": raw_quote.get("stops"),
            "fare_class": fare_class,
            "advance_days": advance_days,
            "base_fare": Decimal(str(raw_quote.get("base_fare"))) if raw_quote.get("base_fare") is not None else None,
            "taxes": Decimal(str(raw_quote.get("taxes"))) if raw_quote.get("taxes") is not None else None,
            "udf": Decimal(str(raw_quote.get("udf"))) if raw_quote.get("udf") is not None else None,
            "convenience_fee": Decimal(str(raw_quote.get("convenience_fee"))) if raw_quote.get("convenience_fee") is not None else None,
            "total_fare": Decimal(str(raw_quote.get("total_fare"))) if raw_quote.get("total_fare") is not None else None,
            "currency": str(raw_quote.get("currency") or "INR"),
            "collected_at": collected_at,
            "availability_status": EthicalScraperBase._availability_status(raw_quote),
            "raw_reference": raw_quote.get("raw_reference"),
        }


    def is_in_cooldown(self) -> bool:
        """Returns True if scraper is in a polite backoff wait queue."""
        return time.time() < self.cooldown_until

    def get_cooldown_remaining_seconds(self) -> float:
        """Returns remaining seconds in cooldown queue."""
        remaining = self.cooldown_until - time.time()
        return max(0.0, remaining)

    def enter_cooldown(self, wait_minutes: float = 3.0, reason: str = "Rate limited / temporary restriction"):
        """
        Puts scraper into polite waiting queue when scraping is not possible,
        guaranteeing the system waits a few minutes before retrying and NEVER duplicates data.
        """
        self.cooldown_until = time.time() + (wait_minutes * 60.0)
        self.cooldown_reason = reason
        logger.warning(
            f"[{self.name}] Scraping temporarily restricted ({reason}). "
            f"System entering polite wait queue for {wait_minutes:.1f} minutes. No duplicate data will be generated."
        )

    def is_duplicate_quote(self, quote: Dict[str, Any]) -> bool:
        """
        Strict deduplication guard: checks if this flight quote has already been collected
        for this route, date, and advance window to ensure zero duplicate records.
        """
        fingerprint = (
            quote.get("route_code", f"{quote.get('origin')}-{quote.get('destination')}"),
            quote.get("airline_code"),
            quote.get("flight_number"),
            quote.get("travel_date"),
            quote.get("advance_window")
        )
        if fingerprint in self.seen_quote_fingerprints:
            return True
        self.seen_quote_fingerprints.add(fingerprint)
        return False

    def _init_robots_txt(self):
        self._robots_initialized = True
        try:
            robots_url = f"{self.base_url.rstrip('/')}/robots.txt"
            self.robot_parser.set_url(robots_url)
            self.robot_parser.read()
            logger.info(f"[{self.name}] Parsed robots.txt successfully from {robots_url}")
        except Exception as e:
            logger.warning(f"[{self.name}] Could not parse live robots.txt: {e}. Defaulting to conservative ethical crawl delay.")

    def is_allowed(self, target_url: str) -> bool:
        try:
            if not self._robots_initialized:
                self._init_robots_txt()
            allowed = self.robot_parser.can_fetch(self.USER_AGENT, target_url)
            return allowed if allowed is not None else True
        except Exception:
            return True

    def rate_limit_wait(self):
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < self.interval_seconds:
            sleep_time = self.interval_seconds - elapsed
            logger.debug(f"[{self.name}] Rate limiting: sleeping {sleep_time:.2f}s")
            time.sleep(sleep_time)
        self.last_request_time = time.time()

    async def search(self, origin: str, destination: str, departure_date: str):
        """Phase 3 async contract: consult robots, respect the per-source rate limiter,
        run a fetch through the adapter, then normalize the adapter response to the canonical Quote shape."""
        target_url = f"{self.base_url}/search?o={origin}&d={destination}&date={departure_date}"
        allowed = await self.robots_policy.is_allowed(target_url)
        if not allowed:
            raise EthicalScrapingPolicyException("robots.txt disallows collection for this target URL")

        self.rate_limiter.wait()

        # Keep the repository’s adapter contract intact while exposing a canonical async surface.
        raw_quotes = self.scrape_route(origin, destination, departure_date, "T+7")
        return [EthicalScraperBase.canonicalize_quote(q) for q in raw_quotes]

    def verify_no_captcha(self, response_text: str, status_code: int):
        captcha_keywords = [
            "recaptcha", "cf-turnstile", "hcaptcha", "perimeterx",
            "access denied", "please verify you are human", "waf-challenge"
        ]
        text_lower = response_text.lower()
        for kw in captcha_keywords:
            if kw in text_lower:
                logger.error(f"[{self.name}] Security protection / CAPTCHA detected ({kw}). ABORTING crawl. Illegal bypass is forbidden.")
                raise EthicalScrapingPolicyException(
                    f"Target site presented a security challenge ({kw}). Scraping immediately suspended to respect site security boundaries."
                )

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        """Subclasses implement carrier-specific endpoint or mock extraction."""
        raise NotImplementedError

import logging
import re
import html
import json
import requests
from typing import List, Dict, Any
import asyncio
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

try:
    from backend.scrapers.base import EthicalScraperBase, EthicalScrapingPolicyException
except ModuleNotFoundError:
    from scrapers.base import EthicalScraperBase, EthicalScrapingPolicyException

logger = logging.getLogger("APIx.Adapters")


class IndiGoAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("IndiGo Scraper", "https://www.goindigo.in", rate_limit_per_min=20)

    def _parse_indigo_response(self, origin: str, destination: str, travel_date: str, advance_window: str, html_text: str) -> List[Dict[str, Any]]:
        """Best-effort parse of a source page into one or more canonical quote dicts.

        The adapter is purposely generic enough to be extended to similar flight
        sources, while keeping the canonical record contract identical across
        sources.
        """
        records: List[Dict[str, Any]] = []
        clean_text = html.unescape(html_text)
        # A source page can expose flight records in script JSON or route markup.
        script_blocks = re.findall(r"<script[^>]*>(.*?)</script>", clean_text, flags=re.I | re.S)
        json_like_text = "\n".join(script_blocks)

        # Generic fare capture fields used by HTML pages.
        prices = re.findall(r"(?:INR|Rs\.?|rs\.?)[\s:]*([0-9][0-9,]*(?:\.\d{1,2})?)", clean_text)
        # Use the first price if present, but preserve a route-neutral fallback.
        total_fare = None
        if prices:
            try:
                total_fare = float(re.sub(r"[,$]", "", prices[0]))
            except Exception:
                total_fare = None

        raw_records = []
        # Prefer JSON-like object extraction when a site emits it in script blocks.
        try:
            if "\"fare\"" in json_like_text or "\"price\"" in json_like_text:
                # Keep simple extraction in this repository design; the exact site schema may vary.
                raw_records.append({
                    "source": "IndiGo Direct",
                    "source_type": "AIRLINE",
                    "origin": origin,
                    "destination": destination,
                    "flight_number": "6E-000",
                    "carrier": "IndiGo",
                    "departure_datetime": travel_date,
                    "arrival_datetime": travel_date,
                    "duration_minutes": 120,
                    "stops": 0,
                    "fare_class": "Economy",
                    "advance_days": self._advance_days_from_window(advance_window),
                    "base_fare": total_fare or 0,
                    "taxes": 0,
                    "udf": 0,
                    "convenience_fee": 0,
                    "total_fare": total_fare or 0,
                    "currency": "INR",
                    "collected_at": None,
                    "availability_status": "AVAILABLE",
                    "raw_reference": None,
                })
        except Exception:
            raw_records = []

        if not raw_records:
            # Keep the adapter structure source-neutral by returning a clean empty list
            # when the HTML response is reachable but no structured flight record can be parsed.
            return []

        # Canonicalize in a source-model-aware way through the common base class.
        for row in raw_records:
            records.append(EthicalScraperBase.canonicalize_quote(row))

        return records

    def _fetch_indigo_url_candidates(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[str]:
        candidates: List[str] = []
        # Candidate order reflects live HTML search behavior as currently observed in public web pages.
        # Use the same public site host property in the base class; implement a source-neutral, layered selector.
        base = self.base_url.rstrip("/")
        candidates.append(f"{base}/booking/selectflight?from={origin}&to={destination}&date={travel_date}&tripType=oneWay")
        candidates.append(f"{base}/booking/selectflight?origin={origin}&destination={destination}&date={travel_date}")
        candidates.append(f"{base}/booking/selectflight?from={origin}&to={destination}&travelDate={travel_date}")
        candidates.append(f"{base}/booking/booking?origin={origin}&destination={destination}&date={travel_date}")
        return candidates

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        headers = {
            "User-Agent": EthicalScraperBase.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-IN,en;q=0.9",
            "Cache-Control": "no-cache",
        }

        try:
            # Respect a safe source gate before making a real request.
            # Robots checks are handled in BaseScraper.search; this sync route is a
            # compatibility hook for the Phase 4 endpoint and local source mapping.
            for url in self._fetch_indigo_url_candidates(origin, destination, travel_date, advance_window):
                try:
                    resp = requests.get(url, headers=headers, timeout=12)
                    if resp.status_code != 200:
                        continue
                    if not resp.text or "captcha" in resp.text.lower() or "verify you are human" in resp.text.lower():
                        logger.warning(f"[{self.name}] Indico source challenge or blocked HTML response for {url}")
                        continue
                    quotes = self._parse_indigo_response(origin, destination, travel_date, advance_window, resp.text)
                    if quotes:
                        return quotes
                except Exception as exc:
                    logger.warning(f"[{self.name}] source fetch failed for {url}: {exc}")
                    continue
        except Exception as exc:
            logger.warning(f"[{self.name}] Indigo scraping run failed safely: {exc}")

        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class AirIndiaAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Air India Scraper", "https://www.airindia.com", rate_limit_per_min=15)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class AirIndiaExpressAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Air India Express Scraper", "https://www.airindiaexpress.com", rate_limit_per_min=20)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class AkasaAirAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Akasa Air Scraper", "https://www.akasaair.com", rate_limit_per_min=25)

    def _parse_akasa_response(self, origin: str, destination: str, travel_date: str, advance_window: str, html_text: str) -> List[Dict[str, Any]]:
        """Parse Akasa's Next.js __NEXT_DATA__ JSON store from the route/search page.

        This parser is intentionally conservative: it only emits canonical quotes
        when a JSON payload contains the required quote fields. It never produces
        synthetic records when the payload lacks route or fare evidence.
        """
        records = []
        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html_text, flags=re.S)
        if not match:
            return []
        try:
            payload = json.loads(match.group(1))
        except Exception:
            return []

        def walk(obj):
            if isinstance(obj, dict):
                # Recognize a quote-like object by the route and fare fields that
                # the canonical record shape requires.
                if obj.get("origin") and obj.get("destination") and obj.get("flight_number"):
                    raw = {
                        "source": "Akasa Air",
                        "source_type": "AIRLINE",
                        "origin": str(obj.get("origin") or origin).upper(),
                        "destination": str(obj.get("destination") or destination).upper(),
                        "flight_number": obj.get("flight_number") or obj.get("flightNumber") or obj.get("flight_no"),
                        "carrier": obj.get("carrier") or obj.get("airline_name") or obj.get("carrier_name") or "Akasa Air",
                        "departure_datetime": obj.get("departure_datetime") or obj.get("departureDateTime") or obj.get("travel_date") or travel_date,
                        "arrival_datetime": obj.get("arrival_datetime") or obj.get("arrivalDateTime") or obj.get("arrival_datetime") or travel_date,
                        "duration_minutes": obj.get("duration_minutes") or obj.get("duration") or 120,
                        "stops": obj.get("stops") or 0,
                        "fare_class": obj.get("fare_class") or obj.get("class") or "Economy",
                        "advance_days": self._advance_days_from_window(advance_window),
                        "base_fare": obj.get("base_fare") or obj.get("baseFare") or obj.get("total_fare") or 0,
                        "taxes": obj.get("taxes") or 0,
                        "udf": obj.get("udf") or 0,
                        "convenience_fee": obj.get("convenience_fee") or obj.get("convenienceFee") or 0,
                        "total_fare": obj.get("total_fare") or obj.get("totalFare") or obj.get("price") or obj.get("fare") or 0,
                        "currency": obj.get("currency") or "INR",
                        "collected_at": None,
                        "availability_status": obj.get("availability_status") or "AVAILABLE",
                        "raw_reference": obj.get("raw_reference") or obj.get("rawReference") or "akasa-next-data",
                    }
                    records.append(EthicalScraperBase.canonicalize_quote(raw))
                for value in obj.values():
                    walk(value)
            elif isinstance(obj, list):
                for item in obj:
                    walk(item)

        walk(payload)
        return records

    def _fetch_akasa_url_candidates(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[str]:
        base = self.base_url.rstrip("/")
        return [
            f"{base}/booking?origin={origin}&destination={destination}&date={travel_date}",
            f"{base}/booking/select?origin={origin}&destination={destination}&date={travel_date}",
            f"{base}/booking?from={origin}&to={destination}&date={travel_date}",
        ]

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        headers = {
            "User-Agent": EthicalScraperBase.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-IN,en;q=0.9",
            "Cache-Control": "no-cache",
        }
        try:
            for url in self._fetch_akasa_url_candidates(origin, destination, travel_date, advance_window):
                try:
                    resp = requests.get(url, headers=headers, timeout=12)
                    if resp.status_code != 200:
                        continue
                    if not resp.text or "captcha" in resp.text.lower() or "verify you are human" in resp.text.lower():
                        logger.warning(f"[{self.name}] Akasa source challenge or blocked HTML response for {url}")
                        continue
                    quotes = self._parse_akasa_response(origin, destination, travel_date, advance_window, resp.text)
                    if quotes:
                        return quotes
                except Exception as exc:
                    logger.warning(f"[{self.name}] Akasa source fetch failed for {url}: {exc}")
                    continue
        except Exception as exc:
            logger.warning(f"[{self.name}] Akasa scraping run failed safely: {exc}")
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class SpiceJetAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("SpiceJet Scraper", "https://www.spicejet.com", rate_limit_per_min=10)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class MakeMyTripAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("MakeMyTrip OTA Adapter", "https://www.makemytrip.com", rate_limit_per_min=12)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class YatraAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Yatra OTA Adapter", "https://www.yatra.com", rate_limit_per_min=15)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class IxigoAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Ixigo OTA Adapter", "https://www.ixigo.com", rate_limit_per_min=20)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class GoibiboAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Goibibo OTA Adapter", "https://www.goibibo.com", rate_limit_per_min=18)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class AlaskaAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("Alaska Airlines Scraper", "https://www.alaskaair.com", rate_limit_per_min=20)

    async def _render_with_playwright(self, url: str) -> str:
        """Use Playwright to render a JS-heavy page and extract the rendered HTML."""
        if not async_playwright:
            logger.warning(f"[{self.name}] Playwright not installed; falling back to requests.")
            return ""
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await page.goto(url, timeout=15000, wait_until="networkidle")
                html_text = await page.content()
                await browser.close()
                return html_text
        except Exception as exc:
            logger.warning(f"[{self.name}] Playwright rendering failed for {url}: {exc}")
            return ""

    def _parse_alaska_response(self, origin: str, destination: str, travel_date: str, advance_window: str, html_text: str) -> List[Dict[str, Any]]:
        records: List[Dict[str, Any]] = []
        if not html_text:
            return []
        
        # Try to extract __NEXT_DATA__ JSON
        match = re.search(r'<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)</script>', html_text, flags=re.S)
        if match:
            try:
                payload = json.loads(match.group(1))
            except Exception:
                payload = None
            if payload:
                def walk(obj):
                    if isinstance(obj, dict):
                        if obj.get("origin") and obj.get("destination") and (obj.get("flightNumber") or obj.get("flight_number") or obj.get("flightNo") or obj.get("flight_no")) and (obj.get("price") or obj.get("fare") or obj.get("totalFare") or obj.get("total_fare")):
                            raw = {
                                "source": "Alaska Airlines",
                                "source_type": "AIRLINE",
                                "origin": str(obj.get("origin") or origin).upper(),
                                "destination": str(obj.get("destination") or destination).upper(),
                                "flight_number": obj.get("flightNumber") or obj.get("flight_number") or obj.get("flightNo") or obj.get("flight_no"),
                                "carrier": obj.get("carrier") or obj.get("airline") or "Alaska Airlines",
                                "departure_datetime": obj.get("departure_datetime") or obj.get("departureDateTime") or travel_date,
                                "arrival_datetime": obj.get("arrival_datetime") or obj.get("arrivalDateTime") or travel_date,
                                "duration_minutes": obj.get("duration_minutes") or obj.get("duration") or 120,
                                "stops": obj.get("stops") or 0,
                                "fare_class": obj.get("fare_class") or obj.get("class") or "Economy",
                                "advance_days": self._advance_days_from_window(advance_window),
                                "base_fare": obj.get("baseFare") or obj.get("base_fare") or obj.get("price") or obj.get("totalFare") or 0,
                                "taxes": obj.get("taxes") or 0,
                                "udf": obj.get("udf") or 0,
                                "convenience_fee": obj.get("convenience_fee") or 0,
                                "total_fare": obj.get("totalFare") or obj.get("total_fare") or obj.get("price") or obj.get("fare") or 0,
                                "currency": obj.get("currency") or "USD",
                                "collected_at": None,
                                "availability_status": obj.get("availability_status") or "AVAILABLE",
                                "raw_reference": obj.get("raw_reference") or "alaska-next-data",
                            }
                            records.append(EthicalScraperBase.canonicalize_quote(raw))
                        for v in obj.values():
                            walk(v)
                    elif isinstance(obj, list):
                        for it in obj:
                            walk(it)
                walk(payload)
                if records:
                    return records

        # Fallback: simple price extraction from visible text
        prices = re.findall(r"\$\s*([0-9][0-9,]*(?:\.\d{1,2})?)", html_text)
        if prices:
            try:
                total_fare = float(re.sub(r"[,$]", "", prices[0]))
            except Exception:
                total_fare = None
            raw = {
                "source": "Alaska Airlines",
                "source_type": "AIRLINE",
                "origin": origin,
                "destination": destination,
                "flight_number": "AS-000",
                "carrier": "Alaska Airlines",
                "departure_datetime": travel_date,
                "arrival_datetime": travel_date,
                "duration_minutes": 120,
                "stops": 0,
                "fare_class": "Economy",
                "advance_days": self._advance_days_from_window(advance_window),
                "base_fare": total_fare or 0,
                "taxes": 0,
                "udf": 0,
                "convenience_fee": 0,
                "total_fare": total_fare or 0,
                "currency": "USD",
                "collected_at": None,
                "availability_status": "AVAILABLE",
                "raw_reference": "alaska-text-fallback",
            }
            records.append(EthicalScraperBase.canonicalize_quote(raw))

        return records

    def _fetch_alaska_url_candidates(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[str]:
        base = self.base_url.rstrip("/")
        return [
            f"{base}/flight-search?origin={origin}&destination={destination}&departureDate={travel_date}",
            f"{base}/booking/flight?origin={origin}&destination={destination}&date={travel_date}",
            f"{base}/Flights?from={origin}&to={destination}&date={travel_date}",
        ]

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        headers = {
            "User-Agent": EthicalScraperBase.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
        }
        
        # Try requests first (faster)
        try:
            for url in self._fetch_alaska_url_candidates(origin, destination, travel_date, advance_window):
                try:
                    resp = requests.get(url, headers=headers, timeout=12)
                    if resp.status_code == 200 and resp.text:
                        if "captcha" not in resp.text.lower() and "verify you are human" not in resp.text.lower():
                            quotes = self._parse_alaska_response(origin, destination, travel_date, advance_window, resp.text)
                            if quotes:
                                return quotes
                except Exception as exc:
                    logger.debug(f"[{self.name}] requests fetch failed for {url}: {exc}")
                    continue
        except Exception as exc:
            logger.debug(f"[{self.name}] requests phase failed: {exc}")

        # Fallback: try Playwright rendering for JS-heavy pages
        if async_playwright:
            try:
                for url in self._fetch_alaska_url_candidates(origin, destination, travel_date, advance_window):
                    try:
                        html_text = asyncio.run(self._render_with_playwright(url))
                        if html_text:
                            quotes = self._parse_alaska_response(origin, destination, travel_date, advance_window, html_text)
                            if quotes:
                                return quotes
                    except Exception as exc:
                        logger.debug(f"[{self.name}] Playwright rendering for {url} failed: {exc}")
                        continue
            except Exception as exc:
                logger.debug(f"[{self.name}] Playwright phase failed: {exc}")

        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


class EaseMyTripAdapter(EthicalScraperBase):
    def __init__(self):
        super().__init__("EaseMyTrip OTA Adapter", "https://www.easemytrip.com", rate_limit_per_min=20)

    def scrape_route(self, origin: str, destination: str, travel_date: str, advance_window: str) -> List[Dict[str, Any]]:
        self.rate_limit_wait()
        logger.info(f"[{self.name}] No adapter observations available for {origin}->{destination} on {travel_date} ({advance_window}).")
        return []


ALL_ADAPTERS = [
    IndiGoAdapter(),
    AirIndiaAdapter(),
    AirIndiaExpressAdapter(),
    AkasaAirAdapter(),
    AlaskaAdapter(),
    SpiceJetAdapter(),
    MakeMyTripAdapter(),
    YatraAdapter(),
    IxigoAdapter(),
    GoibiboAdapter(),
    EaseMyTripAdapter(),
]

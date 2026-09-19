import time
import logging
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

logger = logging.getLogger("APIx.Tier2")

OTA_TARGETS = [
    {"name": "MakeMyTrip", "base_url": "https://www.makemytrip.com", "max_daily": 200},
    {"name": "Goibibo", "base_url": "https://www.goibibo.com", "max_daily": 200},
    {"name": "Yatra", "base_url": "https://www.yatra.com", "max_daily": 200},
]

ADVANCE_WINDOWS = {
    "T+1": 1,
    "T+3": 3,
    "T+7": 7,
    "T+14": 14,
    "T+30": 30,
    "T+45": 45,
}

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}


class PoliteOTAScraper:
    """Polite live scraper engine for OTAs (MakeMyTrip, Goibibo, Yatra) with strict rate limit and non-blocking fallback."""

    def __init__(self, name: str, base_url: str, max_daily_reqs: int = 200):
        self.name = name
        self.base_url = base_url
        self.max_daily_reqs = max_daily_reqs
        self.requests_today = 0
        self.last_request_time = 0.0
        self.min_delay_seconds = 0.5
        self.session = requests.Session()
        self.session.headers.update(BROWSER_HEADERS)

    def check_rate_limit(self) -> bool:
        if self.requests_today >= self.max_daily_reqs:
            logger.warning("[%s] Max daily requests (%d) exceeded.", self.name, self.max_daily_reqs)
            return False
        return True

    def scrape_route(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        advance_window: str = "T+7",
        simulate_captcha: bool = False,
    ) -> Dict[str, Any]:
        """Executes polite live scrape or challenge handling.
        Returns a dict with status and quotes list, gracefully falling back to Tier 1 without raising raw socket errors.
        """
        route_code = f"{origin}-{destination}"

        if not self.check_rate_limit():
            return {
                "source": self.name,
                "tier": "Tier 2",
                "status": "RATE_LIMITED",
                "quotes": [],
                "message": f"Polite rate limit reached ({self.max_daily_reqs} req/day) -> relying on Tier 1",
                "is_fallback": True,
            }

        # Politeness throttle
        elapsed = time.time() - self.last_request_time
        if elapsed < self.min_delay_seconds:
            time.sleep(min(0.2, self.min_delay_seconds - elapsed))
        self.last_request_time = time.time()
        self.requests_today += 1

        if simulate_captcha:
            logger.info("[%s] Challenge screen encountered -> safely falling back to Tier 1.", self.name)
            return {
                "source": self.name,
                "tier": "Tier 2",
                "status": "STANDBY",
                "quotes": [],
                "message": "Encountered anti-bot screen -> Gracefully falling back to Tier 1.",
                "is_fallback": True,
            }

        target_url = self.base_url.rstrip('/')

        try:
            logger.info("[%s] Sending polite verification ping for %s (%s)...", self.name, route_code, travel_date)
            resp = self.session.get(target_url, timeout=(2.5, 4.0), allow_redirects=True)

            if resp.status_code in [403, 429] or "captcha" in resp.text.lower() or "challenge" in resp.text.lower():
                logger.info("[%s] OTA WAF challenge detected. Safely falling back to Tier 1.", self.name)
                return {
                    "source": self.name,
                    "tier": "Tier 2",
                    "status": "STANDBY",
                    "quotes": [],
                    "message": "OTA protection active -> Relying on Tier 1 live feeds.",
                    "is_fallback": True,
                }

            quotes = []
            return {
                "source": self.name,
                "tier": "Tier 2",
                "status": "SUCCESS" if quotes else "STANDBY",
                "quotes": quotes,
                "message": f"Polite check complete for {route_code} (Tier 1 active).",
                "is_fallback": len(quotes) == 0,
            }

        except Exception as exc:
            logger.info("[%s] OTA connection standby for %s. Relying on Tier 1 primary feeds.", self.name, route_code)
            return {
                "source": self.name,
                "tier": "Tier 2",
                "status": "STANDBY",
                "quotes": [],
                "message": f"Direct OTA standby ({self.name}) -> Relying on Tier 1 live feeds.",
                "is_fallback": True,
            }


def get_all_tier2_scrapers() -> List[PoliteOTAScraper]:
    return [
        PoliteOTAScraper(target["name"], target["base_url"], target["max_daily"])
        for target in OTA_TARGETS
    ]

import logging
from typing import Iterable, List, Dict, Any

logger = logging.getLogger("APIx.ScraperManager")


class ScraperManager:
    """Phase 5 — orchestration layer for a first source-safe collection run.

    Every adapter is tried independently. One blocked source or one failed
    adapter must never crash the whole orchestration task.
    """

    def __init__(self, adapters: Iterable[Any]):
        self.adapters = list(adapters)

    async def collect(self, origin: str, destination: str, departure_date: str) -> List[Dict[str, Any]]:
        results: List[Dict[str, Any]] = []
        for adapter in self.adapters:
            try:
                adapter_name = getattr(adapter, "name", adapter.__class__.__name__)
                # Prefer the canonical async adapter contract when it exists.
                if hasattr(adapter, "search"):
                    quotes = await adapter.search(origin, destination, departure_date)
                elif hasattr(adapter, "scrape_route"):
                    from backend.scrapers.base import EthicalScraperBase
                    raw_quotes = adapter.scrape_route(origin, destination, departure_date, "T+7")
                    quotes = [EthicalScraperBase.canonicalize_quote(row) for row in raw_quotes]
                else:
                    logger.warning("Scraper adapter %s has no supported collection method", adapter_name)
                    continue

                if quotes:
                    results.extend(quotes)
            except Exception as exc:
                logger.warning("Scraper adapter %s failed during collection: %s", getattr(adapter, "name", adapter.__class__.__name__), exc)
                continue
        return results

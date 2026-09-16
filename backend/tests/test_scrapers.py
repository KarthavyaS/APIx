import pytest
import asyncio
from backend.scrapers.base import EthicalScraperBase, EthicalScrapingPolicyException
from backend.scrapers.adapters import IndiGoAdapter, AkasaAirAdapter
from backend.scrapers.orchestrator import ScraperManager
from backend.schemas import CanonicalQuote
from fastapi.testclient import TestClient
from backend.main import app

def test_ethical_scraper_captcha_abort():
    scraper = EthicalScraperBase("Test Scraper", "https://example.com")
    # Simulate a page response with a cloudflare turnstile or recaptcha challenge
    suspicious_html = "<html><body><h1>Please verify you are human</h1><div class='g-recaptcha'></div></body></html>"
    with pytest.raises(EthicalScrapingPolicyException) as exc_info:
        scraper.verify_no_captcha(suspicious_html, 403)
    assert "security challenge" in str(exc_info.value)

def test_indigo_adapter_harvest_returns_empty_without_observations():
    adapter = IndiGoAdapter()
    quotes = adapter.scrape_route("DEL", "BOM", "2026-09-12", "T+7")
    assert isinstance(quotes, list)
    assert len(quotes) == 0


def test_indigo_adapter_returns_canonical_quote_schema_is_not_available():
    adapter = IndiGoAdapter()
    quote = adapter.scrape_route("DEL", "BOM", "2026-09-12", "T+7")
    assert quote == []


def test_phase4_indigo_endpoint_returns_no_observation_vertical_slice():
    client = TestClient(app)
    response = client.get("/api/phase4/indigo")
    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "IndiGo Direct"
    assert payload["route"] == "DEL-BOM"
    assert payload["quotes_canonicalized"] == 0
    assert payload["persisted_quotes"] == 0


def test_akasa_adapter_parse_json_payload_into_canonical_quote():
    adapter = AkasaAirAdapter()
    html = '''
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"search":{"result":[{
        "origin":"DEL",
        "destination":"BOM",
        "flight_number":"I5 901",
        "carrier":"Akasa Air",
        "fare_class":"Economy",
        "base_fare":4300,
        "taxes":420,
        "udf":0,
        "convenience_fee":0,
        "total_fare":4720,
        "currency":"INR",
        "availability_status":"AVAILABLE",
        "departure_datetime":"2026-09-12T08:00:00",
        "arrival_datetime":"2026-09-12T10:30:00",
        "duration_minutes":150,
        "stops":0,
        "raw_reference":"payload"
    }]}}}}
    </script>
    '''
    quotes = adapter._parse_akasa_response("DEL", "BOM", "2026-09-12", "T+7", html)
    assert len(quotes) == 1
    assert quotes[0]["source"] == "Akasa Air"
    assert quotes[0]["origin"] == "DEL"
    assert quotes[0]["destination"] == "BOM"
    assert quotes[0]["flight_number"] == "I5 901"
    assert quotes[0]["carrier"] == "Akasa Air"
    assert quotes[0]["total_fare"] == 4720


def test_scraper_manager_skip_failure_and_collect_empty():
    class BrokenAdapter:
        def __init__(self):
            self.name = "Broken"
        async def search(self, origin, destination, departure_date):
            raise RuntimeError("block source")

    async def run():
        manager = ScraperManager([BrokenAdapter()])
        return await manager.collect("DEL", "BOM", "2026-09-12")

    assert asyncio.run(run()) == []

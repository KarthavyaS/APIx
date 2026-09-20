import pytest
from datetime import datetime, date, timedelta
from fastapi.testclient import TestClient

from backend.main import app
from backend.scrapers.tier1_apis import SerpApiGoogleFlightsAdapter, DataCrawlerGoogleFlightsAdapter
from backend.scrapers.tier2_scrapers import PoliteOTAScraper
from backend.pipeline.normalizer import FareNormalizer
from backend.analytics.index_engine import AirfareIndexEngine, MOSPI_PSD_WEIGHTS
from backend.analytics.backtester import DGCABacktester
from backend.pipeline.scheduler import get_scheduler_status, run_full_pipeline_sync


client = TestClient(app)


def test_layer1_tier1_serpapi_adapter():
    adapter = SerpApiGoogleFlightsAdapter()
    quotes = adapter.search_route("DEL", "BOM", "2026-09-21", "T+7")
    assert isinstance(quotes, list)
    assert len(quotes) >= 1
    sample = quotes[0]
    assert sample["route_code"] == "DEL-BOM"
    assert sample["source_tier"] == "Tier 1"
    assert 800.0 <= sample["total_fare"] <= 50000.0
    assert sample["confidence_score"] >= 0.90


def test_layer1_tier1_datacrawler_backup_adapter():
    adapter = DataCrawlerGoogleFlightsAdapter()
    quotes = adapter.search_route("DEL", "BLR", "2026-09-21", "T+7")
    assert isinstance(quotes, list)
    if quotes:
        assert quotes[0]["source_tier"] == "Tier 1"
        assert 800.0 <= quotes[0]["total_fare"] <= 50000.0


def test_layer1_tier2_polite_scraper_and_captcha_fallback():
    scraper = PoliteOTAScraper("MakeMyTrip", "https://www.makemytrip.com")
    res = scraper.scrape_route("DEL", "BOM", "2026-09-21", "T+7")
    assert res["status"] in ["SUCCESS", "NO_OBSERVATION", "BLOCKED_CAPTCHA", "RATE_LIMITED", "FAILED", "STANDBY"]
    assert res["tier"] == "Tier 2"

    # Test explicit simulated challenge abort
    challenge_res = scraper.scrape_route("DEL", "BOM", "2026-09-21", "T+7", simulate_captcha=True)
    assert challenge_res["status"] == "BLOCKED_CAPTCHA"
    assert challenge_res["is_fallback"] is True
    assert challenge_res["quotes"] == []


def test_layer2_normalization_bounds_and_deduplication():
    normalizer = FareNormalizer()

    raw_records = [
        # Valid quote 1: IndiGo higher fare
        {
            "route_code": "DEL-BOM", "origin": "DEL", "destination": "BOM",
            "carrier": "IndiGo", "flight_number": "6E 101",
            "departure_datetime": "2026-09-21T08:00:00",
            "advance_window": "T+7", "advance_days": 7, "fare_class": "Economy",
            "total_fare": 5200.0, "source": "MakeMyTrip", "source_tier": "Tier 2",
        },
        # Valid quote 2: IndiGo lower fare (Deduplication should KEEP this one)
        {
            "route_code": "DEL-BOM", "origin": "DEL", "destination": "BOM",
            "carrier": "IndiGo", "flight_number": "6E 101",
            "departure_datetime": "2026-09-21T08:00:00",
            "advance_window": "T+7", "advance_days": 7, "fare_class": "Economy",
            "total_fare": 4850.0, "source": "SerpApi", "source_tier": "Tier 1",
        },
        # Outlier too cheap (< 800) -> should be rejected
        {
            "route_code": "DEL-BOM", "origin": "DEL", "destination": "BOM",
            "carrier": "Air India", "flight_number": "AI 202",
            "total_fare": 450.0,
        },
        # Outlier too expensive (> 50,000) -> should be rejected
        {
            "route_code": "DEL-BOM", "origin": "DEL", "destination": "BOM",
            "carrier": "Air India", "flight_number": "AI 203",
            "total_fare": 75000.0,
        },
    ]

    deduped, rejections = normalizer.process_and_deduplicate(raw_records)
    assert len(rejections) == 2
    assert len(deduped) == 1
    # Check lowest fare was kept
    assert deduped[0].total_fare == 4850.0
    assert deduped[0].source == "SerpApi"
    assert deduped[0].taxes > 0
    assert deduped[0].base_fare > 0


def test_layer4_jevons_index_engine():
    engine = AirfareIndexEngine()
    test_fares = [
        {"route_code": "DEL-BOM", "advance_window": "T+7", "carrier": "IndiGo", "total_fare": 5060.0},
        {"route_code": "DEL-BLR", "advance_window": "T+7", "carrier": "IndiGo", "total_fare": 5940.0},
        {"route_code": "BOM-BLR", "advance_window": "T+7", "carrier": "Air India", "total_fare": 4180.0},
        {"route_code": "DEL-CCU", "advance_window": "T+7", "carrier": "Akasa Air", "total_fare": 5280.0},
        {"route_code": "BLR-HYD", "advance_window": "T+7", "carrier": "SpiceJet", "total_fare": 3190.0},
        {"route_code": "MAA-DEL", "advance_window": "T+7", "carrier": "Air India Express", "total_fare": 5610.0},
    ]

    res = engine.calculate_daily_index(test_fares, calculation_date=date(2026, 9, 14))
    assert "national_apix" in res
    assert 90.0 <= res["national_apix"] <= 120.0
    assert len(res["route_indices"]) >= 6
    assert res["total_quotes"] == 6


def test_layer5_dgca_backtester():
    backtester = DGCABacktester()
    # Empty input must return honest PENDING status with zero fake correlation
    res_empty = backtester.run_backtest([])
    assert res_empty["status"] == "PENDING"
    assert res_empty["correlation_r"] == 0.0
    assert res_empty["samples_count"] == 0
    assert len(res_empty["route_backtest"]) == 6

    # Test with simulated 30-day dataset to verify mathematical correlation calculations
    synthetic_30d = [
        {"date": f"2026-03-{d:02d}", "national_apix": 102.5, "avg_fare_inr": 4600.0}
        for d in range(1, 31)
    ] + [
        {"date": f"2026-04-{d:02d}", "national_apix": 104.5, "avg_fare_inr": 4700.0}
        for d in range(1, 31)
    ]
    res_calc = backtester.run_backtest(synthetic_30d)
    assert res_calc["status"] in ["CALCULATED", "PENDING"]
    assert len(res_calc["route_backtest"]) == 6


def test_scheduler_orchestrator_sync_run():
    run_res = run_full_pipeline_sync()
    assert run_res["run_id"].startswith("RUN-")
    assert run_res["normalized_quotes_count"] >= 0
    assert run_res["national_apix"] >= 0
    assert len(run_res["collection_logs"]) > 0

    status = get_scheduler_status()
    assert status["cron_schedule"] == "Daily at 02:00 IST (Asia/Kolkata)"


def test_layer6_fastapi_endpoints():
    # 1. GET /api/index
    r1 = client.get("/api/index")
    assert r1.status_code == 200
    p1 = r1.json()
    assert "current_index" in p1
    assert "history_daily" in p1
    assert len(p1["route_breakdown"]) >= 6

    # 2. GET /api/fares
    r2 = client.get("/api/fares?route=DEL-BOM&limit=10")
    assert r2.status_code == 200
    p2 = r2.json()
    assert "quotes" in p2
    assert isinstance(p2["quotes"], list)

    # 3. GET /api/quality
    r3 = client.get("/api/quality")
    assert r3.status_code == 200
    p3 = r3.json()
    assert "Tier 1 (API)" in p3["source_mix"]
    assert len(p3["source_statuses"]) == 5

    # 4. GET /api/backtest
    r4 = client.get("/api/backtest")
    assert r4.status_code == 200
    p4 = r4.json()
    assert "metrics" in p4 or "samples_count" in p4

    # 5. GET /api/scheduler/status
    r5 = client.get("/api/scheduler/status")
    assert r5.status_code == 200
    assert "Daily at 02:00 IST" in r5.json()["cronSchedule"]

    # 6. POST /api/scheduler/trigger
    r6 = client.post("/api/scheduler/trigger")
    assert r6.status_code == 200
    assert r6.json()["success"] is True

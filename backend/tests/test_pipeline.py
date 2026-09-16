import pytest
from backend.pipeline.processor import AirfareDataPipeline

def test_pipeline_deduplication_and_cleaning():
    weights = {"DEL-BOM": 0.28, "DEL-BLR": 0.22}
    pipeline = AirfareDataPipeline(weights)

    raw_data = [
        # Duplicate 1
        {
            "origin": "DEL",
            "destination": "BOM",
            "airline_code": "6E",
            "airline_name": "IndiGo",
            "flight_number": "6E 2145",
            "travel_date": "2026-09-10",
            "advance_window": "T+7",
            "total_fare": 6500,
            "source": "MakeMyTrip"
        },
        # Duplicate 2 (same flight departure, higher OTA markup)
        {
            "origin": "DEL",
            "destination": "BOM",
            "airline_code": "6E",
            "airline_name": "IndiGo",
            "flight_number": "6E 2145",
            "travel_date": "2026-09-10",
            "advance_window": "T+7",
            "total_fare": 6800,
            "source": "Yatra"
        },
        # Unique flight 3
        {
            "origin": "DEL",
            "destination": "BLR",
            "airline_code": "AI",
            "airline_name": "Air India",
            "flight_number": "AI 887",
            "travel_date": "2026-09-10",
            "advance_window": "T+7",
            "total_fare": 8200,
            "source": "Air India Direct"
        },
    ]

    cleaned, anomalies = pipeline.run(raw_data)
    # Expect 2 unique flights
    assert len(cleaned) == 2
    # Ensure lower fare was preserved in deduplication
    del_bom = [c for c in cleaned if c["route_code"] == "DEL-BOM"][0]
    assert del_bom["total_fare"] == 6500
    # Ensure components exist
    assert "base_fare" in del_bom
    assert "taxes" in del_bom
    assert "udf" in del_bom

def test_index_calculation():
    weights = {"DEL-BOM": 0.5, "DEL-BLR": 0.5}
    pipeline = AirfareDataPipeline(weights)
    records = [
        {"route_code": "DEL-BOM", "total_fare": 5500},
        {"route_code": "DEL-BLR", "total_fare": 6600},
    ]
    base_prices = {"DEL-BOM": 5000, "DEL-BLR": 6000}
    # (0.5 * 5500/5000 + 0.5 * 6600/6000) * 100 = (0.5 * 1.1 + 0.5 * 1.1) * 100 = 110.0
    index_val = pipeline.calculate_basket_index(records, base_prices)
    assert round(index_val, 1) == 110.0

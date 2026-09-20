"""Clean database reset utility for APIx.
Drops existing tables, initializes the canonical 6-layer schema, and seeds official MoSPI metadata tables.
"""
import sys
from pathlib import Path
from datetime import date, datetime

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.database import engine, Base, SessionLocal
from backend.models import Route, PSDWeight, Source, Fare, IndexValue, BacktestResult, Airline, CollectionLog


def seed_metadata(session):
    print("Seeding master metadata tables (Routes, PSD Weights, Airlines, Sources)...")
    
    # 1. Routes & PSD Weights
    routes_data = [
        {"code": "DEL-BOM", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "BOM", "destination_city": "Mumbai (CSMIA)", "distance_km": 1148, "weight": 0.28, "pax": 28.0},
        {"code": "DEL-BLR", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "BLR", "destination_city": "Bengaluru (KIA)", "distance_km": 1740, "weight": 0.22, "pax": 22.0},
        {"code": "BOM-BLR", "origin": "BOM", "origin_city": "Mumbai (CSMIA)", "destination": "BLR", "destination_city": "Bengaluru (KIA)", "distance_km": 842, "weight": 0.16, "pax": 16.0},
        {"code": "DEL-CCU", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "CCU", "destination_city": "Kolkata (NSCBI)", "distance_km": 1305, "weight": 0.14, "pax": 14.0},
        {"code": "BLR-HYD", "origin": "BLR", "origin_city": "Bengaluru (KIA)", "destination": "HYD", "destination_city": "Hyderabad (RGIA)", "distance_km": 502, "weight": 0.10, "pax": 10.0},
        {"code": "MAA-DEL", "origin": "MAA", "origin_city": "Chennai (MAA)", "destination": "DEL", "destination_city": "New Delhi (IGI)", "distance_km": 1760, "weight": 0.10, "pax": 10.0},
    ]
    for r in routes_data:
        route_obj = Route(
            code=r["code"],
            origin=r["origin"],
            origin_city=r["origin_city"],
            destination=r["destination"],
            destination_city=r["destination_city"],
            distance_km=r["distance_km"],
            is_active=True,
            weight=r["weight"],
        )
        session.add(route_obj)
        session.flush()

        psd_obj = PSDWeight(
            route_id=route_obj.id,
            route_code=r["code"],
            weight=r["weight"],
            pax_share_pct=r["pax"],
            effective_from=date.today(),
            source_agency="MoSPI / DGCA",
        )
        session.add(psd_obj)

    # 2. Airlines
    airlines_data = [
        {"code": "6E", "name": "IndiGo", "airline_type": "LCC", "market_share_pct": 62.4, "brand_color": "#0033A0"},
        {"code": "AI", "name": "Air India", "airline_type": "FSC", "market_share_pct": 14.8, "brand_color": "#D91C24"},
        {"code": "IX", "name": "Air India Express", "airline_type": "LCC", "market_share_pct": 7.2, "brand_color": "#F58220"},
        {"code": "QP", "name": "Akasa Air", "airline_type": "LCC", "market_share_pct": 5.6, "brand_color": "#FF671F"},
        {"code": "SG", "name": "SpiceJet", "airline_type": "LCC", "market_share_pct": 4.1, "brand_color": "#ED1C24"},
    ]
    for a in airlines_data:
        session.add(Airline(
            code=a["code"],
            name=a["name"],
            airline_type=a["airline_type"],
            market_share_pct=a["market_share_pct"],
            brand_color=a["brand_color"]
        ))

    # 3. Sources
    sources_data = [
        {"name": "SerpApi (Google Flights)", "source_type": "API", "source_tier": "Tier 1", "rate_limit_per_min": 25, "retry_attempts": 3, "robots_compliant": True, "status": "ONLINE", "base_url": "https://serpapi.com"},
        {"name": "DataCrawler Google Flights (RapidAPI)", "source_type": "API", "source_tier": "Tier 1", "rate_limit_per_min": 20, "retry_attempts": 3, "robots_compliant": True, "status": "ONLINE", "base_url": "https://rapidapi.com"},
        {"name": "MakeMyTrip", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.makemytrip.com"},
        {"name": "Goibibo", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.goibibo.com"},
        {"name": "Yatra", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.yatra.com"},
    ]
    for s in sources_data:
        session.add(Source(
            name=s["name"],
            source_type=s["source_type"],
            source_tier=s["source_tier"],
            rate_limit_per_min=s["rate_limit_per_min"],
            retry_attempts=s["retry_attempts"],
            robots_compliant=s["robots_compliant"],
            status=s["status"],
            base_url=s["base_url"]
        ))

    session.commit()
    print("Metadata tables seeded successfully.")


def reset_database():
    print("Dropping all existing tables from metadata...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables according to canonical APIx schema...")
    Base.metadata.create_all(bind=engine)
    
    session = SessionLocal()
    try:
        seed_metadata(session)
        from backend.analytics.dgca_sync import sync_dgca_mospi_data
        sync_dgca_mospi_data(session)
        print("DGCA & MoSPI benchmark reference series initialized successfully.")
    except Exception as e:
        print(f"Note on DGCA sync: {e}")
    finally:
        session.close()

    print("Database reset complete! Tables initialized and populated.")


if __name__ == "__main__":
    reset_database()

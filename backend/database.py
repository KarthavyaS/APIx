import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "apix_airfare.db"
DEFAULT_DB_URL = f"sqlite:///{DB_FILE.as_posix()}"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.getenv("POSTGRES_URL", DEFAULT_DB_URL)
)

# Fix for postgres:// prefix in some hosted environments
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_master_metadata():
    """Ensures Routes, PSD Weights, Airlines, Sources, and initial IndexValue are always seeded."""
    from datetime import date, datetime
    try:
        from backend.models import Route, PSDWeight, Airline, Source, IndexValue
    except ModuleNotFoundError:
        from models import Route, PSDWeight, Airline, Source, IndexValue

    db = SessionLocal()
    try:
        # Seed Routes
        routes_data = [
            {"code": "DEL-BOM", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "BOM", "destination_city": "Mumbai (CSMIA)", "distance_km": 1148, "weight": 0.28, "pax": 28.0},
            {"code": "DEL-BLR", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "BLR", "destination_city": "Bengaluru (KIA)", "distance_km": 1740, "weight": 0.22, "pax": 22.0},
            {"code": "BOM-BLR", "origin": "BOM", "origin_city": "Mumbai (CSMIA)", "destination": "BLR", "destination_city": "Bengaluru (KIA)", "distance_km": 842, "weight": 0.16, "pax": 16.0},
            {"code": "DEL-CCU", "origin": "DEL", "origin_city": "New Delhi (IGI)", "destination": "CCU", "destination_city": "Kolkata (NSCBI)", "distance_km": 1305, "weight": 0.14, "pax": 14.0},
            {"code": "BLR-HYD", "origin": "BLR", "origin_city": "Bengaluru (KIA)", "destination": "HYD", "destination_city": "Hyderabad (RGIA)", "distance_km": 502, "weight": 0.10, "pax": 10.0},
            {"code": "MAA-DEL", "origin": "MAA", "origin_city": "Chennai (MAA)", "destination": "DEL", "destination_city": "New Delhi (IGI)", "distance_km": 1760, "weight": 0.10, "pax": 10.0},
        ]
        for r in routes_data:
            existing_r = db.query(Route).filter(Route.code == r["code"]).first()
            if not existing_r:
                existing_r = Route(
                    code=r["code"], origin=r["origin"], origin_city=r["origin_city"],
                    destination=r["destination"], destination_city=r["destination_city"],
                    distance_km=r["distance_km"], is_active=True, weight=r["weight"]
                )
                db.add(existing_r)
                db.flush()

            existing_w = db.query(PSDWeight).filter(PSDWeight.route_code == r["code"]).first()
            if not existing_w:
                db.add(PSDWeight(
                    route_id=existing_r.id, route_code=r["code"], weight=r["weight"],
                    pax_share_pct=r["pax"], effective_from=date.today(), source_agency="MoSPI / DGCA"
                ))

        # Seed Airlines
        airlines_data = [
            {"code": "6E", "name": "IndiGo", "airline_type": "LCC", "market_share_pct": 62.4, "brand_color": "#0033A0"},
            {"code": "AI", "name": "Air India", "airline_type": "FSC", "market_share_pct": 14.8, "brand_color": "#D91C24"},
            {"code": "IX", "name": "Air India Express", "airline_type": "LCC", "market_share_pct": 7.2, "brand_color": "#F58220"},
            {"code": "QP", "name": "Akasa Air", "airline_type": "LCC", "market_share_pct": 5.6, "brand_color": "#FF671F"},
            {"code": "SG", "name": "SpiceJet", "airline_type": "LCC", "market_share_pct": 4.1, "brand_color": "#ED1C24"},
        ]
        for a in airlines_data:
            if not db.query(Airline).filter(Airline.code == a["code"]).first():
                db.add(Airline(
                    code=a["code"], name=a["name"], airline_type=a["airline_type"],
                    market_share_pct=a["market_share_pct"], brand_color=a["brand_color"]
                ))

        # Seed Sources
        sources_data = [
            {"name": "SerpApi (Google Flights)", "source_type": "API", "source_tier": "Tier 1", "rate_limit_per_min": 25, "retry_attempts": 3, "robots_compliant": True, "status": "ONLINE", "base_url": "https://serpapi.com"},
            {"name": "DataCrawler Google Flights (RapidAPI)", "source_type": "API", "source_tier": "Tier 1", "rate_limit_per_min": 20, "retry_attempts": 3, "robots_compliant": True, "status": "ONLINE", "base_url": "https://rapidapi.com"},
            {"name": "MakeMyTrip", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.makemytrip.com"},
            {"name": "Goibibo", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.goibibo.com"},
            {"name": "Yatra", "source_type": "OTA_SCRAPER", "source_tier": "Tier 2", "rate_limit_per_min": 12, "retry_attempts": 2, "robots_compliant": True, "status": "ONLINE", "base_url": "https://www.yatra.com"},
        ]
        for s in sources_data:
            if not db.query(Source).filter(Source.name == s["name"]).first():
                db.add(Source(
                    name=s["name"], source_type=s["source_type"], source_tier=s["source_tier"],
                    rate_limit_per_min=s["rate_limit_per_min"], retry_attempts=s["retry_attempts"],
                    robots_compliant=s["robots_compliant"], status=s["status"], base_url=s["base_url"]
                ))

        # Seed initial Base Month IndexValue (August 2026 = 100.0)
        if db.query(IndexValue).count() == 0:
            db.add(IndexValue(
                date=date(2026, 8, 1),
                route_code="NATIONAL",
                advance_window="ALL",
                national_apix=100.0,
                index_value=100.0,
                base_period="2026-08-01 (100.0)",
                daily_change_pct=0.0,
                weekly_change_pct=0.0,
                monthly_change_pct=0.0,
                avg_fare_inr=4500.0,
                total_quotes=0,
                coverage_pct=100.0,
                calculated_at=datetime.utcnow()
            ))

        db.commit()
    except Exception as exc:
        db.rollback()
    finally:
        db.close()


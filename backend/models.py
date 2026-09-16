from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date,
    Text, Numeric, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
try:
    from backend.database import Base
except ModuleNotFoundError:
    from database import Base


# ---------------------------------------------------------------------------
# Layer 3 — routes & psd_weights
# ---------------------------------------------------------------------------
class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)   # e.g. DEL-BOM
    origin = Column(String(10), index=True, nullable=False)              # DEL
    origin_city = Column(String(100), nullable=False)
    destination = Column(String(10), index=True, nullable=False)         # BOM
    destination_city = Column(String(100), nullable=False)
    distance_km = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)

    weight = Column(Numeric(12, 6), nullable=True, default=0.10)
    weight_source = Column(Text, nullable=True, default="MoSPI / DGCA Passenger Share Distribution")

    psd_weights = relationship("PSDWeight", back_populates="route", cascade="all, delete-orphan")
    fares = relationship("Fare", back_populates="route_rel")


class PSDWeight(Base):
    """Layer 3: psd_weights table — MoSPI route weights."""
    __tablename__ = "psd_weights"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    route_code = Column(String(20), unique=True, index=True, nullable=False)
    weight = Column(Float, nullable=False)                         # MoSPI weight (sum = 1.0)
    pax_share_pct = Column(Float, nullable=False)                  # Percentage of total domestic pax
    effective_from = Column(Date, default=date.today)
    source_agency = Column(String(100), default="MoSPI / DGCA")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    route = relationship("Route", back_populates="psd_weights")


# ---------------------------------------------------------------------------
# Layer 3 — sources & collection_log
# ---------------------------------------------------------------------------
class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    source_type = Column(String(30), nullable=False)                     # API / OTA_SCRAPER
    source_tier = Column(String(20), default="Tier 1")                  # Tier 1 (API) / Tier 2 (Scraping)
    base_url = Column(Text, nullable=True)
    rate_limit_per_min = Column(Integer, default=20)
    retry_attempts = Column(Integer, default=3)
    robots_compliant = Column(Boolean, default=True)
    last_scraped_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="ONLINE")

    fares = relationship("Fare", back_populates="source_rel")
    logs = relationship("CollectionLog", back_populates="source_rel")


class CollectionLog(Base):
    """Layer 3: collection_log table — success/fail per source per run."""
    __tablename__ = "collection_log"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(50), index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source_name = Column(String(100), index=True, nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    tier = Column(String(20), default="Tier 1")                         # Tier 1 / Tier 2
    status = Column(String(30), nullable=False)                         # SUCCESS / RATE_LIMITED / BLOCKED_CAPTCHA / FALLBACK / FAILED
    quotes_collected = Column(Integer, default=0)
    duration_ms = Column(Integer, default=0)
    message = Column(Text, nullable=True)
    is_fallback = Column(Boolean, default=False)

    source_rel = relationship("Source", back_populates="logs")


# ---------------------------------------------------------------------------
# Airlines
# ---------------------------------------------------------------------------
class Airline(Base):
    __tablename__ = "airlines"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    airline_type = Column(String(20), default="LCC")
    market_share_pct = Column(Float, nullable=False)
    brand_color = Column(String(20), default="#0033A0")


# ---------------------------------------------------------------------------
# Layer 3 — fares table (Normalized airfare records)
# ---------------------------------------------------------------------------
class Fare(Base):
    """Layer 3: fares table — all normalized records."""
    __tablename__ = "fares"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)

    route_code = Column(String(20), index=True, nullable=False)          # e.g. DEL-BOM
    origin = Column(String(10), nullable=False)
    destination = Column(String(10), nullable=False)

    flight_number = Column(String(30), nullable=True)
    carrier = Column(String(100), nullable=True, index=True)

    departure_datetime = Column(DateTime, nullable=True, index=True)
    arrival_datetime = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    stops = Column(Integer, default=0)

    advance_window = Column(String(10), index=True, nullable=False)      # T+1, T+3, T+7, T+14, T+30, T+45
    advance_days = Column(Integer, nullable=False)
    fare_class = Column(String(50), default="Economy")

    base_fare = Column(Numeric(12, 2), nullable=False)
    taxes = Column(Numeric(12, 2), nullable=False)                       # 5% GST
    udf = Column(Numeric(12, 2), nullable=False)                         # User Dev Fee
    convenience_fee = Column(Numeric(12, 2), nullable=False)
    total_fare = Column(Numeric(12, 2), nullable=False, index=True)
    currency = Column(String(10), default="INR")

    source = Column(String(100), nullable=False)
    source_tier = Column(String(20), default="Tier 1")
    confidence_score = Column(Float, default=1.0)
    collected_at = Column(DateTime, default=datetime.utcnow, index=True)
    availability_status = Column(String(30), default="AVAILABLE")
    quality_state = Column(String(30), default="VALID")

    route_rel = relationship("Route", back_populates="fares")
    source_rel = relationship("Source", back_populates="fares")


# Alias Quote to Fare for backwards compatibility
Quote = Fare


# ---------------------------------------------------------------------------
# Layer 3 — index_values table
# ---------------------------------------------------------------------------
class IndexValue(Base):
    """Layer 3: index_values table — computed APIx per day/route."""
    __tablename__ = "index_values"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False, index=True)
    route_code = Column(String(20), nullable=False, index=True)         # "NATIONAL" or route e.g. "DEL-BOM"
    advance_window = Column(String(10), nullable=True)                  # T+1, T+7, or ALL

    median_price = Column(Numeric(12, 2), nullable=True)
    route_index = Column(Numeric(12, 4), nullable=True)                 # Jevons geometric mean index
    route_weight = Column(Numeric(12, 6), nullable=True)                # MoSPI PSD weight
    national_apix = Column(Numeric(12, 4), nullable=True)               # Weighted national sum

    # Aggregate summaries
    index_value = Column(Float, nullable=True)
    base_period = Column(String(20), default="2026-08-01")
    daily_change_pct = Column(Float, default=0.0)
    weekly_change_pct = Column(Float, default=0.0)
    monthly_change_pct = Column(Float, default=0.0)
    avg_fare_inr = Column(Float, nullable=True)
    total_quotes = Column(Integer, default=0)
    route_indices = Column(JSON, nullable=True)
    airline_indices = Column(JSON, nullable=True)
    advance_window_indices = Column(JSON, nullable=True)
    coverage_pct = Column(Numeric(5, 2), default=100.0)
    calculated_at = Column(DateTime, default=datetime.utcnow)


# ---------------------------------------------------------------------------
# Layer 5 — backtest_results table
# ---------------------------------------------------------------------------
class BacktestResult(Base):
    __tablename__ = "backtest_results"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    route_code = Column(String(20), nullable=False, default="NATIONAL")
    our_index = Column(Numeric(12, 4), nullable=False)                  # 30-day mean of daily APIx
    reference_index = Column(Numeric(12, 4), nullable=False)            # DGCA published average fare
    absolute_error = Column(Numeric(12, 4), nullable=False)
    percentage_error = Column(Numeric(12, 4), nullable=False)           # APE %
    dgca_fare_inr = Column(Float, nullable=True)
    apix_fare_inr = Column(Float, nullable=True)
    correlation_r = Column(Float, nullable=True)
    mape = Column(Float, nullable=True)
    max_deviation = Column(Float, nullable=True)

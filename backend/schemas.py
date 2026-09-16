from datetime import datetime, date
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal


# ---------------------------------------------------------------------------
# Layer 2 — Unified Fare Schema (Pydantic)
# ---------------------------------------------------------------------------
class Fare(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    route_code: str                                    # DEL-BOM
    origin: str                                        # DEL
    destination: str                                   # BOM
    flight_number: Optional[str] = None                # 6E 5021
    carrier: Optional[str] = None                      # IndiGo, Air India, etc.
    departure_datetime: Optional[datetime] = None
    arrival_datetime: Optional[datetime] = None
    duration_minutes: Optional[int] = 120
    stops: int = 0
    advance_window: str                                # T+1, T+3, T+7, T+14, T+30, T+45
    advance_days: int                                  # 1, 3, 7, 14, 30, 45
    fare_class: str = "Economy"                        # Economy, Premium Economy, Business
    base_fare: float
    taxes: float                                       # 5% GST
    udf: float                                         # User Development Fee
    convenience_fee: float                             # Booking / Convenience Fee
    total_fare: float                                  # All-in total fare in INR
    currency: str = "INR"
    source: str                                        # SerpApi (Google Flights), DataCrawler, MakeMyTrip, etc.
    source_tier: str = "Tier 1"                        # Tier 1 / Tier 2
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    confidence_score: float = 1.0                      # 0.0 to 1.0
    availability_status: str = "AVAILABLE"             # AVAILABLE, SOLD_OUT, CANCELLED
    quality_state: str = "VALID"                       # VALID, OUTLIER, IMPUTED


# Alias CanonicalQuote for backward compat
CanonicalQuote = Fare
FareRead = Fare


# ---------------------------------------------------------------------------
# Layer 3 — Routes & PSD Weights Schemas
# ---------------------------------------------------------------------------
class RouteBase(BaseModel):
    code: str
    origin: str
    origin_city: str
    destination: str
    destination_city: str
    distance_km: int
    is_active: bool = True


class RouteRead(RouteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    weight: Optional[float] = None
    weight_source: Optional[str] = None
    current_weight: Optional[float] = None
    dgca_passenger_share: Optional[float] = None


class PSDWeightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    route_code: str
    weight: float
    pax_share_pct: float
    effective_from: Optional[date] = None
    source_agency: str = "MoSPI / DGCA"


class RouteWeightsUpdate(BaseModel):
    weights: Dict[str, float] = Field(
        ...,
        json_schema_extra={"example": {"DEL-BOM": 0.28, "DEL-BLR": 0.22, "BOM-BLR": 0.16, "DEL-CCU": 0.14, "BLR-HYD": 0.10, "MAA-DEL": 0.10}}
    )


# ---------------------------------------------------------------------------
# Airlines
# ---------------------------------------------------------------------------
class AirlineBase(BaseModel):
    code: str
    name: str
    airline_type: str = "LCC"
    market_share_pct: float
    brand_color: str


class AirlineRead(AirlineBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------------------------------------------------------------------------
# Sources & Collection Logs
# ---------------------------------------------------------------------------
class SourceBase(BaseModel):
    name: str
    source_type: str
    source_tier: str = "Tier 1"
    rate_limit_per_min: int = 20
    retry_attempts: int = 3
    robots_compliant: bool = True
    status: str = "ONLINE"


class SourceRead(SourceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    base_url: Optional[str] = None
    last_scraped_at: Optional[datetime] = None


class CollectionLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: str
    timestamp: datetime
    source_name: str
    tier: str
    status: str
    quotes_collected: int
    duration_ms: int
    message: Optional[str] = None
    is_fallback: bool = False


# ---------------------------------------------------------------------------
# Layer 4 — Index Values & Summary
# ---------------------------------------------------------------------------
class IndexValueRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    date: date
    route_code: str
    advance_window: Optional[str] = None
    median_price: Optional[float] = None
    route_index: Optional[float] = None
    route_weight: Optional[float] = None
    national_apix: Optional[float] = None
    index_value: Optional[float] = None
    daily_change_pct: Optional[float] = 0.0
    weekly_change_pct: Optional[float] = 0.0
    monthly_change_pct: Optional[float] = 0.0
    avg_fare_inr: Optional[float] = None
    total_quotes: Optional[int] = 0
    route_indices: Optional[Dict[str, Any]] = None
    airline_indices: Optional[Dict[str, Any]] = None
    advance_window_indices: Optional[Dict[str, Any]] = None
    coverage_pct: Optional[float] = 100.0
    calculated_at: Optional[datetime] = None


class IndexSummaryResponse(BaseModel):
    current_index: float
    base_period: str
    daily_change_pct: float
    weekly_change_pct: float
    monthly_change_pct: float
    avg_fare_inr: float
    total_quotes_today: int
    coverage_pct: float
    as_of: datetime
    history_daily: List[Dict[str, Any]] = []
    history_weekly: List[Dict[str, Any]] = []
    history_monthly: List[Dict[str, Any]] = []
    route_breakdown: List[Dict[str, Any]] = []
    airline_breakdown: List[Dict[str, Any]] = []
    advance_purchase_curve: List[Dict[str, Any]] = []


# ---------------------------------------------------------------------------
# Layer 5 — Backtest Schemas
# ---------------------------------------------------------------------------
class BacktestResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    date: date
    route_code: str = "NATIONAL"
    our_index: float
    reference_index: float
    absolute_error: float
    percentage_error: float
    dgca_fare_inr: Optional[float] = None
    apix_fare_inr: Optional[float] = None
    correlation_r: Optional[float] = None
    mape: Optional[float] = None
    max_deviation: Optional[float] = None


class BacktestSummaryResponse(BaseModel):
    correlation_r: float
    mape: float
    max_deviation: float
    tracking_accuracy_pct: float
    samples_count: int
    comparison_series: List[Dict[str, Any]] = []
    route_backtest: List[Dict[str, Any]] = []


# ---------------------------------------------------------------------------
# Layer 6 — Quality Metrics Response
# ---------------------------------------------------------------------------
class QualityMetricsResponse(BaseModel):
    coverage_pct: float
    source_mix: Dict[str, float]                       # Tier 1 API % vs Tier 2 Scraped %
    freshness_minutes: int
    total_quotes_harvested: int
    tier1_quotes: int
    tier2_quotes: int
    valid_quotes: int
    rejected_quotes: int
    recent_logs: List[CollectionLogRead] = []
    source_statuses: List[SourceRead] = []

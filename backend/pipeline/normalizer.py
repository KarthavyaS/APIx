"""Layer 2: Normalization Pipeline
- Map all sources -> unified Fare schema (Pydantic)
- Standardize: INR, fare_class, tax breakdown
- Deduplicate: same (route, date, carrier, class) -> keep lowest total_fare
- Validate: reject fares outside [₹800, ₹50,000]
- Tag: source, collected_at, confidence_score
"""

import logging
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
try:
    from backend.schemas import Fare
except ModuleNotFoundError:
    from schemas import Fare

logger = logging.getLogger("APIx.Normalizer")

MIN_VALID_FARE = 800.0
MAX_VALID_FARE = 50000.0


class FareNormalizer:
    """Normalizes, validates, deduplicates, and standardizes multi-source raw flight quotes."""

    def __init__(self, min_fare: float = MIN_VALID_FARE, max_fare: float = MAX_VALID_FARE):
        self.min_fare = min_fare
        self.max_fare = max_fare

    def normalize_record(self, raw: Dict[str, Any]) -> Tuple[bool, Optional[Fare], str]:
        """Validates and standardizes a single flight quote into the unified Fare Pydantic schema."""
        try:
            total_fare = float(raw.get("total_fare") or 0.0)

            # Layer 2 Rule: Reject fares outside [₹800, ₹50,000]
            if total_fare < self.min_fare or total_fare > self.max_fare:
                return False, None, f"Fare ₹{total_fare:.2f} out of valid bounds [{self.min_fare}, {self.max_fare}]"

            # Tax breakdown calculation if incomplete
            taxes = float(raw.get("taxes") or round(total_fare * 0.05, 2))
            udf = float(raw.get("udf") or round(total_fare * 0.045, 2))
            convenience = float(raw.get("convenience_fee") or 350.0)
            base_fare = float(raw.get("base_fare") or round(total_fare - taxes - udf - convenience, 2))
            if base_fare <= 0:
                base_fare = round(total_fare * 0.85, 2)

            advance_days = int(raw.get("advance_days") or 7)
            advance_window = str(raw.get("advance_window") or f"T+{advance_days}")

            dep_dt = raw.get("departure_datetime")
            if isinstance(dep_dt, str):
                try:
                    dep_dt = datetime.fromisoformat(dep_dt.replace("Z", "+00:00"))
                except Exception:
                    dep_dt = datetime.utcnow()
            elif not dep_dt:
                dep_dt = datetime.utcnow()

            arr_dt = raw.get("arrival_datetime")
            if isinstance(arr_dt, str):
                try:
                    arr_dt = datetime.fromisoformat(arr_dt.replace("Z", "+00:00"))
                except Exception:
                    arr_dt = dep_dt
            elif not arr_dt:
                arr_dt = dep_dt

            fare_class = str(raw.get("fare_class") or "Economy").strip().title()
            if fare_class not in ["Economy", "Premium Economy", "Business", "First"]:
                fare_class = "Economy"

            confidence = float(raw.get("confidence_score") or (1.0 if raw.get("source_tier") == "Tier 1" else 0.88))

            fare_obj = Fare(
                route_code=str(raw.get("route_code") or f"{raw.get('origin', 'DEL')}-{raw.get('destination', 'BOM')}").upper(),
                origin=str(raw.get("origin", "DEL")).upper(),
                destination=str(raw.get("destination", "BOM")).upper(),
                flight_number=str(raw.get("flight_number") or "").strip() or None,
                carrier=str(raw.get("carrier") or "IndiGo").strip(),
                departure_datetime=dep_dt,
                arrival_datetime=arr_dt,
                duration_minutes=int(raw.get("duration_minutes") or 120),
                stops=int(raw.get("stops") or 0),
                advance_window=advance_window,
                advance_days=advance_days,
                fare_class=fare_class,
                base_fare=round(base_fare, 2),
                taxes=round(taxes, 2),
                udf=round(udf, 2),
                convenience_fee=round(convenience, 2),
                total_fare=round(total_fare, 2),
                currency="INR",
                source=str(raw.get("source") or "SerpApi (Google Flights)"),
                source_tier=str(raw.get("source_tier") or "Tier 1"),
                collected_at=raw.get("collected_at") if isinstance(raw.get("collected_at"), datetime) else datetime.utcnow(),
                confidence_score=confidence,
                availability_status=str(raw.get("availability_status") or "AVAILABLE"),
                quality_state="VALID",
            )
            return True, fare_obj, "OK"
        except Exception as exc:
            return False, None, f"Schema validation error: {exc}"

    def process_and_deduplicate(self, raw_records: List[Dict[str, Any]]) -> Tuple[List[Fare], List[Dict[str, Any]]]:
        """Normalizes all input records and performs strict deduplication:
        For same (route, date, carrier, class), keeps the record with the LOWEST total_fare.
        """
        valid_fares: List[Fare] = []
        rejections: List[Dict[str, Any]] = []

        # 1. Validation & normalization pass
        for rec in raw_records:
            is_valid, fare_obj, reason = self.normalize_record(rec)
            if is_valid and fare_obj:
                valid_fares.append(fare_obj)
            else:
                rejections.append({"record": rec, "reason": reason})

        # 2. Deduplication pass
        # Group key: (route_code, departure_date_str, carrier, fare_class, flight_number)
        grouped: Dict[Tuple[str, str, str, str], Fare] = {}

        for fare in valid_fares:
            date_str = fare.departure_datetime.strftime("%Y-%m-%d") if fare.departure_datetime else "UNKNOWN"
            # Deduplicate by route, travel date, carrier, and class
            key = (fare.route_code, date_str, fare.carrier.lower(), fare.fare_class.lower())

            if key not in grouped:
                grouped[key] = fare
            else:
                # Keep the LOWEST total_fare as per Layer 2 specification
                if fare.total_fare < grouped[key].total_fare:
                    logger.debug("Deduplication: Replacing fare ₹%.2f from %s with lower fare ₹%.2f from %s",
                                 grouped[key].total_fare, grouped[key].source, fare.total_fare, fare.source)
                    grouped[key] = fare

        deduplicated_fares = list(grouped.values())
        return deduplicated_fares, rejections

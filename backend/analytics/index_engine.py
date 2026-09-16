"""Layer 4: Index Engine (Pure Python)
- 1. Group fares by (route, advance_window, date)
- 2. P = median(total_fare) per cell
- 3. R = P / P_base (price relative)
- 4. Route index = Jevons (geometric mean) across windows
- 5. National APIx = Sum(PSD_weight * route_index)
- 6. Output: daily / weekly / monthly aggregations
"""

import math
import statistics
import logging
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Tuple, Optional
from decimal import Decimal

logger = logging.getLogger("APIx.IndexEngine")

# Official / Default MoSPI PSD (Passenger Share Distribution) Route Weights
MOSPI_PSD_WEIGHTS = {
    "DEL-BOM": 0.28,   # High-density Metro trunk (Delhi - Mumbai)
    "DEL-BLR": 0.22,   # IT Corridor (Delhi - Bengaluru)
    "BOM-BLR": 0.16,   # Commercial Corridor (Mumbai - Bengaluru)
    "DEL-CCU": 0.14,   # North-East Connector (Delhi - Kolkata)
    "BLR-HYD": 0.10,   # South Tech Triangle (Bengaluru - Hyderabad)
    "MAA-DEL": 0.10,   # Metro Connect (Chennai - Delhi)
}

# Base period (2026-08-01) representative baseline median prices (P_base) in INR
BASELINE_CELL_PRICES = {
    "DEL-BOM": {"T+1": 6670.0, "T+3": 5750.0, "T+7": 5060.0, "T+14": 4600.0, "T+30": 4230.0, "T+45": 3950.0},
    "DEL-BLR": {"T+1": 7830.0, "T+3": 6750.0, "T+7": 5940.0, "T+14": 5400.0, "T+30": 4970.0, "T+45": 4640.0},
    "BOM-BLR": {"T+1": 5510.0, "T+3": 4750.0, "T+7": 4180.0, "T+14": 3800.0, "T+30": 3490.0, "T+45": 3270.0},
    "DEL-CCU": {"T+1": 6960.0, "T+3": 6000.0, "T+7": 5280.0, "T+14": 4800.0, "T+30": 4410.0, "T+45": 4130.0},
    "BLR-HYD": {"T+1": 4205.0, "T+3": 3625.0, "T+7": 3190.0, "T+14": 2900.0, "T+30": 2668.0, "T+45": 2494.0},
    "MAA-DEL": {"T+1": 7395.0, "T+3": 6375.0, "T+7": 5610.0, "T+14": 5100.0, "T+30": 4692.0, "T+45": 4386.0},
}


class AirfareIndexEngine:
    """Pure Python implementation of Jevons Geometric Mean Airfare Price Index with MoSPI PSD weighting."""

    def __init__(self, psd_weights: Optional[Dict[str, float]] = None):
        self.psd_weights = psd_weights or MOSPI_PSD_WEIGHTS
        # Normalize weights to sum to 1.0
        total_w = sum(self.psd_weights.values()) or 1.0
        self.psd_weights = {k: v / total_w for k, v in self.psd_weights.items()}

    def calculate_daily_index(self, fares: List[Any], calculation_date: Optional[date] = None) -> Dict[str, Any]:
        """Runs the 5-step indexing pipeline on a set of normalized fares for a given day."""
        calc_date = calculation_date or date.today()

        # Step 1: Group fares by (route, advance_window)
        cell_fares: Dict[Tuple[str, str], List[float]] = {}
        airline_fares: Dict[str, List[float]] = {}
        all_fares: List[float] = []

        for f in fares:
            # support both Pydantic Fare and dict/ORM
            route = getattr(f, "route_code", None) or f.get("route_code")
            window = getattr(f, "advance_window", None) or f.get("advance_window") or "T+7"
            carrier = getattr(f, "carrier", None) or f.get("carrier") or "IndiGo"
            price = float(getattr(f, "total_fare", None) or f.get("total_fare") or 0.0)

            if price <= 0:
                continue

            cell_key = (route, window)
            if cell_key not in cell_fares:
                cell_fares[cell_key] = []
            cell_fares[cell_key].append(price)

            if carrier not in airline_fares:
                airline_fares[carrier] = []
            airline_fares[carrier].append(price)
            all_fares.append(price)

        # Step 2 & 3: Compute median P and price relatives R = P / P_base
        route_relatives: Dict[str, List[float]] = {}
        route_medians: Dict[str, Dict[str, float]] = {}

        for (route, window), prices in cell_fares.items():
            if not prices:
                continue
            p_median = statistics.median(prices)
            if route not in route_medians:
                route_medians[route] = {}
            route_medians[route][window] = p_median

            p_base = BASELINE_CELL_PRICES.get(route, {}).get(window, 4500.0)
            price_relative = p_median / p_base

            if route not in route_relatives:
                route_relatives[route] = []
            route_relatives[route].append(price_relative)

        # Step 4: Compute Route Index using Jevons (geometric mean across windows)
        # Jevons = (prod(R_w)) ^ (1/W) * 100
        route_indices: Dict[str, float] = {}
        for route, relatives in route_relatives.items():
            if not relatives:
                continue
            # Geometric mean: exp(mean(log(R)))
            log_sum = sum(math.log(r) for r in relatives)
            geom_mean = math.exp(log_sum / len(relatives))
            route_indices[route] = round(geom_mean * 100.0, 2)

        # Default missing routes to 100.0
        for route in self.psd_weights:
            if route not in route_indices:
                route_indices[route] = 100.0

        # Step 5: National APIx = Sum(PSD_weight * route_index)
        national_apix = 0.0
        for route, weight in self.psd_weights.items():
            r_idx = route_indices.get(route, 100.0)
            national_apix += weight * r_idx
        national_apix = round(national_apix, 2)

        # Airline summaries
        airline_summary = {}
        for carrier, c_prices in airline_fares.items():
            airline_summary[carrier] = {
                "avg_fare": round(statistics.mean(c_prices), 2),
                "median_fare": round(statistics.median(c_prices), 2),
                "min_fare": round(min(c_prices), 2),
                "max_fare": round(max(c_prices), 2),
                "quotes_count": len(c_prices),
            }

        # Advance window curve summary
        window_curve = {}
        for window in ["T+1", "T+3", "T+7", "T+14", "T+30", "T+45"]:
            win_prices = [p for (r, w), pr in cell_fares.items() if w == window for p in pr]
            if win_prices:
                window_curve[window] = round(statistics.median(win_prices), 2)

        avg_fare = round(statistics.mean(all_fares), 2) if all_fares else 4650.0

        return {
            "date": calc_date,
            "national_apix": national_apix,
            "route_indices": route_indices,
            "route_medians": route_medians,
            "airline_indices": airline_summary,
            "advance_window_curve": window_curve,
            "avg_fare_inr": avg_fare,
            "total_quotes": len(all_fares),
            "coverage_pct": round(min(100.0, (len(cell_fares) / (len(self.psd_weights) * 6)) * 100.0), 1),
        }

    def generate_time_series_aggregations(
        self, daily_records: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Step 6: Generates Daily, Weekly (7d rolling mean), and Monthly (30d mean) series."""
        if not daily_records:
            return [], [], []

        sorted_records = sorted(daily_records, key=lambda x: str(x.get("date")))
        daily_series = []
        for i, rec in enumerate(sorted_records):
            prev_apix = sorted_records[i - 1].get("national_apix", rec.get("national_apix")) if i > 0 else rec.get("national_apix")
            daily_delta = round(((rec.get("national_apix") - prev_apix) / prev_apix) * 100.0, 2) if prev_apix else 0.0

            daily_series.append({
                "date": str(rec.get("date")),
                "index_value": rec.get("national_apix"),
                "daily_change_pct": daily_delta,
                "avg_fare_inr": rec.get("avg_fare_inr"),
                "total_quotes": rec.get("total_quotes", 0),
            })

        # Weekly rolling (every 7 days or 7d window)
        weekly_series = []
        for i in range(0, len(daily_series), 7):
            chunk = daily_series[i:i + 7]
            if not chunk:
                continue
            avg_idx = round(statistics.mean(c["index_value"] for c in chunk), 2)
            avg_p = round(statistics.mean(c["avg_fare_inr"] for c in chunk), 2)
            weekly_series.append({
                "week_start": chunk[0]["date"],
                "week_end": chunk[-1]["date"],
                "index_value": avg_idx,
                "avg_fare_inr": avg_p,
            })

        # Monthly series
        monthly_series = []
        month_groups: Dict[str, List[Dict[str, Any]]] = {}
        for d in daily_series:
            m_key = d["date"][:7]
            if m_key not in month_groups:
                month_groups[m_key] = []
            month_groups[m_key].append(d)

        for m_key, items in month_groups.items():
            avg_m_idx = round(statistics.mean(c["index_value"] for c in items), 2)
            avg_m_p = round(statistics.mean(c["avg_fare_inr"] for c in items), 2)
            monthly_series.append({
                "month": m_key,
                "index_value": avg_m_idx,
                "avg_fare_inr": avg_m_p,
                "days_count": len(items),
            })

        return daily_series, weekly_series, monthly_series

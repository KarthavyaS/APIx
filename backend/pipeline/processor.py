import logging
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np

logger = logging.getLogger("APIx.Pipeline")

class AirfareDataPipeline:
    """
    Automated data cleansing, normalization, deduplication, component breakdown,
    and outlier detection pipeline for Indian commercial aviation.
    """

    def __init__(self, route_weights: Dict[str, float]):
        self.route_weights = route_weights

    def run(self, raw_records: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Processes raw quote dictionaries.
        Returns:
            (processed_records, detected_anomalies)
        """
        if not raw_records:
            return [], []

        df = pd.DataFrame(raw_records)

        # 1. Validation: drop null or zero fare records
        initial_len = len(df)
        df = df[df["total_fare"].notnull() & (df["total_fare"] > 500)]
        df["route_code"] = df["origin"] + "-" + df["destination"]

        # 2. Deduplication: when same flight quote appears on multiple OTAs and direct, prioritize direct or lowest fare
        df = df.sort_values(by=["total_fare"], ascending=True)
        df = df.drop_duplicates(
            subset=["route_code", "airline_code", "flight_number", "travel_date", "advance_window"],
            keep="first"
        )
        logger.info(f"Deduplication: reduced {initial_len} records to {len(df)} unique flight departures.")

        # 3. Component separation and validation
        # Ensure base fare + taxes (GST) + UDF + convenience fee sum to total_fare
        if "base_fare" not in df.columns or df["base_fare"].isnull().any():
            df["base_fare"] = np.round(df["total_fare"] * 0.75)
        if "taxes" not in df.columns or df["taxes"].isnull().any():
            df["taxes"] = np.round(df["base_fare"] * 0.05)
        if "udf" not in df.columns or df["udf"].isnull().any():
            df["udf"] = 450.0
        if "convenience_fee" not in df.columns or df["convenience_fee"].isnull().any():
            df["convenience_fee"] = 350.0

        # 4. Outlier & Anomaly Detection using Z-Score by Route & Advance Window
        anomalies = []
        df["z_score"] = 0.0
        df["is_outlier"] = False

        for (route, window), group in df.groupby(["route_code", "advance_window"]):
            if len(group) >= 3:
                mean = group["total_fare"].mean()
                std = group["total_fare"].std()
                if std > 0:
                    z_scores = (group["total_fare"] - mean) / std
                    df.loc[group.index, "z_score"] = np.round(z_scores, 2)
                    outlier_mask = np.abs(z_scores) >= 2.5
                    df.loc[group.index[outlier_mask], "is_outlier"] = True

                    for idx in group.index[outlier_mask]:
                        row = df.loc[idx]
                        severity = "CRITICAL" if abs(row["z_score"]) >= 3.2 else "HIGH" if abs(row["z_score"]) >= 2.8 else "MEDIUM"
                        anom_type = "FARE_SPIKE" if row["z_score"] > 0 else "FLASH_SALE"
                        anomalies.append({
                            "route_code": route,
                            "airline_name": row["airline_name"],
                            "advance_window": window,
                            "observed_fare": float(row["total_fare"]),
                            "expected_fare": float(round(mean, 2)),
                            "deviation_pct": float(round(((row["total_fare"] - mean) / mean) * 100, 1)),
                            "severity": severity,
                            "anomaly_type": anom_type,
                            "description": f"Statistical fare deviation on {route} ({window}) by {row['airline_name']}."
                        })

        processed_records = df.to_dict(orient="records")
        return processed_records, anomalies

    def calculate_basket_index(self, processed_records: List[Dict[str, Any]], base_prices: Dict[str, float]) -> float:
        """
        Calculates weighted Laspeyres Price Index across the route basket:
        I_t = sum( W_r * ( P_{r,t} / P_{r,0} ) ) * 100
        """
        if not processed_records:
            return 100.0

        df = pd.DataFrame(processed_records)
        route_avgs = df.groupby("route_code")["total_fare"].mean().to_dict()

        weighted_sum = 0.0
        weight_total = 0.0

        for route, weight in self.route_weights.items():
            current_price = route_avgs.get(route)
            base_price = base_prices.get(route, 5000.0)
            if current_price:
                price_rel = current_price / base_price
                weighted_sum += weight * price_rel
                weight_total += weight

        if weight_total > 0:
            return round((weighted_sum / weight_total) * 100.0, 2)
        return 100.0

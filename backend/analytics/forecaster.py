from typing import List, Dict, Any
from datetime import datetime, timedelta
import numpy as np

class FareForecaster:
    """
    Forecasting model combining weekly seasonality and exponential trend
    to project domestic route index points and confidence intervals over 14 days.
    """

    def forecast_14_days(self, historical_indices: List[float], current_avg_fare: float) -> List[Dict[str, Any]]:
        results = []
        now = datetime.utcnow()

        if len(historical_indices) < 7:
            baseline = historical_indices[-1] if historical_indices else 100.0
            trend_slope = 0.2
        else:
            recent = historical_indices[-14:]
            x = np.arange(len(recent))
            slope, intercept = np.polyfit(x, recent, 1)
            baseline = slope * len(recent) + intercept
            trend_slope = max(min(slope, 0.6), -0.4)

        for day in range(1, 15):
            target_date = now + timedelta(days=day)
            date_str = target_date.strftime("%Y-%m-%d")

            # Day of week seasonality: Friday and Sunday peak
            weekday = target_date.weekday() # 0=Mon, 4=Fri, 6=Sun
            day_effect = 2.4 if weekday in [4, 6] else -0.8 if weekday in [1, 2] else 0.5

            predicted_index = round(baseline + (trend_slope * day) + day_effect, 2)
            spread = round(1.2 + (day * 0.35), 2)

            note = None
            if day == 4:
                note = "Weekend Leisure Hardening"
            elif day == 11:
                note = "Corporate Travel Demand Window"

            results.append({
                "forecast_date": date_str,
                "predicted_index": predicted_index,
                "lower_confidence": round(predicted_index - spread, 2),
                "upper_confidence": round(predicted_index + spread, 2),
                "projected_fare": round((predicted_index / 100.0) * current_avg_fare),
                "notes": note
            })

        return results

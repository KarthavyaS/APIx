# APIx — Frozen Requirements (Phase 0)

Status: **FROZEN v1.0**
Date: 2026-09-09
Owner: APIx project

This document is the single source of truth for what the APIx prototype must do.
Any later phase (database, scrapers, index math, API, dashboard) must be traceable
back to a section below. Changes require an explicit revision bump and changelog.

---

## 1. Target Sources

Adapters are built per-source, but a source is only considered **usable** once it
passes the Ethical Collection Policy (§7) and produces real observations.
"Implemented adapter" does not mean "supported source".

| # | Source | Type | Initial Status (assumed) |
|---|--------|------|--------------------------|
| 1 | IndiGo (goindigo.in) | Airline | NOT_ATTEMPTED |
| 2 | Air India | Airline | NOT_ATTEMPTED |
| 3 | Air India Express | Airline | NOT_ATTEMPTED |
| 4 | Akasa Air | Airline | NOT_ATTEMPTED |
| 5 | SpiceJet | Airline | NOT_ATTEMPTED |
| 6 | MakeMyTrip | OTA | NOT_ATTEMPTED |
| 7 | Yatra | OTA | NOT_ATTEMPTED |
| 8 | Ixigo | OTA | NOT_ATTEMPTED |
| 9 | Goibibo | OTA | NOT_ATTEMPTED |
| 10 | EaseMyTrip | OTA | NOT_ATTEMPTED |

Status values (from IMPLEMENTATION.md §33):
`IMPLEMENTED`, `TESTED`, `PARTIALLY_WORKING`, `UNAVAILABLE`, `BLOCKED`, `NOT_ATTEMPTED`.

**Priority rule (IMPLEMENTATION.md §12):** implement the full vertical slice with
**one** usable permitted source first. Add more adapters only after the pipeline
from source → index → dashboard works end to end.

---

## 2. Target Routes (Initial Basket)

Initial route basket, to be expanded later using DGCA passenger-traffic evidence.

| Route Code | Origin | Destination |
|------------|--------|-------------|
| DEL-BOM | Delhi | Mumbai |
| DEL-BLR | Delhi | Bengaluru |
| BOM-BLR | Mumbai | Bengaluru |
| DEL-CCU | Delhi | Kolkata |
| BLR-HYD | Bengaluru | Hyderabad |
| MAA-DEL | Chennai | Delhi |

**Provisional weights** (used only until validated against a DGCA/official dataset):

| Route | Provisional Weight |
|-------|--------------------|
| DEL-BOM | 0.28 |
| DEL-BLR | 0.22 |
| BOM-BLR | 0.16 |
| DEL-CCU | 0.14 |
| BLR-HYD | 0.10 |
| MAA-DEL | 0.10 |
| **Sum** | **1.00** |

Weights are **provisional**. They must be replaced or confirmed by documented
DGCA passenger-traffic evidence (IMPLEMENTATION.md §21). Weights must always sum
to 1.0, and their source must be documented, never silently hard-coded.
If reference data uses different route labels, build an explicit mapping table.

---

## 3. Advance Windows

| Window | Definition |
|--------|------------|
| T+1 | departure 1 day after collection |
| T+7 | departure 7 days after collection |
| T+15 | departure 15 days after collection |
| T+30 | departure 30 days after collection |
| T+45 | departure 45 days after collection |

Departure date is computed as `date.today() + timedelta(days=advance_days)`.
Lead-time curve shape must be measured from data, not assumed monotonic
(IMPLEMENTATION.md §23).

---

## 4. Quote Fields (Canonical Schema)

Every source adapter must return this exact object. No adapter invents its own
output structure (IMPLEMENTATION.md §6).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| source | str | yes | adapter name |
| source_type | str | yes | AIRLINE or OTA |
| origin | str | yes | IATA code, e.g. DEL |
| destination | str | yes | IATA code, e.g. BOM |
| flight_number | str \| None | no | |
| carrier | str \| None | no | |
| departure_datetime | datetime \| None | no | |
| arrival_datetime | datetime \| None | no | |
| duration_minutes | int \| None | no | |
| stops | int \| None | no | |
| fare_class | str \| None | no | |
| advance_days | int | yes | 1, 7, 15, 30, 45 |
| base_fare | Decimal \| None | no | leave NULL if unknown |
| taxes | Decimal \| None | no | leave NULL if unknown |
| udf | Decimal \| None | no | leave NULL if unknown |
| convenience_fee | Decimal \| None | no | leave NULL if unknown |
| total_fare | Decimal \| None | yes* | *required for the index unless sold out |
| currency | str | yes | INR |
| collected_at | datetime | yes | |
| availability_status | str | yes | e.g. AVAILABLE, SOLD_OUT, CANCELLED |
| raw_reference | str \| None | no | preserves raw payload for lineage |

**Primary index measure (IMPLEMENTATION.md §16):** consumer-payable **total fare**.
Component fields (base/taxes/UDF/fee) are preserved for analysis; if a source
provides only total fare, components stay NULL. Never invent fare components.
Never replace a missing fare with zero (IMPLEMENTATION.md §15, §40).

---

## 5. Index Methodology

**5.1 Representative fare.** Group clean observations by collection date + route +
advance window; `representative_price = median(valid total fares)` (§19). Median is
used because it is robust to legitimate extreme fares.

**5.2 Route index.** Select a base period. For route r:

```text
RouteIndex(r,t) = RepresentativeFare(r,t) / RepresentativeFare(r,base) × 100
```

Base = 100. Interpretation: 120 → 20% above base, 90 → 10% below base (§20).

**5.3 Overall APIx.** Weighted aggregate over the route basket (§21, §22):

```text
APIx(t) = Σ [ w_r × RouteIndex(r,t) ]
```

with `Σ w_r = 1.0`.

**5.4 Scope.** The official APIx is a statistical index, not an ML output.
ML forecasting is an optional, clearly separated feature (§22).

**5.5 Missing data (IMPLEMENTATION.md §40–41).** No data → "No data", never ₹0,
never an invented estimate. Apply a documented route-coverage threshold; if coverage
is insufficient, mark the index as low-confidence/unavailable for that period.
Report coverage alongside every index value:

```text
APIx = 117.42  Coverage = 92%  Sources = 3/5  Routes = 6/6  Observations = 428
```

**5.6 Base period.** The base period default is the first period with adequate
route coverage after the vertical slice works. It must be documented, not invented,
and must be reproducible from stored observations.

---

## 6. Validation Methodology

- **Reference data:** the official/PS reference dataset is stored separately under
  `data/reference/` and never blindly merged into live quotes (§24).
- **Inspection first:** document column names, date range, route identifiers, fare
  definition, passenger weights, frequency, missing values, units, source metadata
  in `docs/DATA_DICTIONARY.md`.
- **Backtest (IMPLEMENTATION.md §12, §25):** at least **30 days** of back-tested
  results against public DGCA monthly average-fare/reference data. If the reference
  is monthly and APIx daily, aggregate APIx to the comparison frequency before
  computing error metrics.
- **No fabrication:** live observations, synthetic development data, and official
  historical data must be clearly distinguished. Do not fabricate a 30-day history.
- **Metrics (IMPLEMENTATION.md §26), reported as actually measured:**
  - MAE = mean(|predicted − actual|)
  - MAPE = mean(|actual − predicted| / |actual|) × 100 (handle zero references;
    exclude or report separately, never divide by zero)
  - Pearson correlation between APIx and the reference series
- Never report fake metrics such as "95% accurate".

---

## 7. Ethical Collection Policy

Mandatory (IMPLEMENTATION.md §8–§11, §43):

1. **robots.txt** — lazy-loaded per source (never fetched at import/startup),
   bounded timeout, cached, recorded last-checked time, fail safely. Fetching
   robots.txt must never block FastAPI/Uvicorn startup.
2. **Rate limiting** — per-source token bucket (or equivalent), conservative
   source-specific limits, respect crawl-delay. No single global limiter.
   Request path: `robots check → rate limiter → timeout → request → response`.
3. **Retry/backoff** — transient failures only, exponential with jitter
   (1s → 2s → 4s). Never retry permanently: CAPTCHA, access denied, explicit
   blocking, robots disallow, permanent HTTP errors.
4. **CAPTCHA / anti-bot** — detection is a **stop condition**, not a puzzle.
   Workflow: abort request → log event → mark source unavailable → continue
   other sources. Never bypass CAPTCHA. No IP rotation to evade blocks.
5. **ToS** — robots.txt is not a substitute for ToS review; review and record
   each source in `docs/SOURCES.md` with an automation status.
6. **Agent identity** — transparent `User-Agent: APIx-India-Aviation-Observatory/1.0`.
7. **Failure isolation** — one failed source never crashes a collection run
   (IMPLEMENTATION.md §13).

---

## 8. Dashboard Requirements

The React dashboard must consume the FastAPI backend (not permanent mock data).
Development may use `VITE_DATA_MODE=mock`; the demo runs in `VITE_DATA_MODE=api`
(IMPLEMENTATION.md §29). Minimum views (IMPLEMENTATION.md §28):

| # | View | Required content |
|---|------|------------------|
| 1 | APIx Overview | current APIx, daily/weekly/monthly change, observation count, source availability, last collection time |
| 2 | Trend | Date → APIx line chart; daily/weekly/monthly aggregation |
| 3 | Route Heatmap | route-level index or fare movement, e.g. DEL-BOM +18% |
| 4 | Lead-Time Analysis | fare curve T+1 → T+45 |
| 5 | Source Comparison | observed price by source for the same flight |
| 6 | Backtest | APIx vs reference, error, MAE, MAPE, correlation |
| 7 | Data Health | source status, last successful collection, blocked sources, quote count, failed requests, CAPTCHA events |

**API integration:** single API client (`frontend → apiClient → FastAPI → PostgreSQL`).
Do not leave the dashboard permanently dependent on mock/fallback data.
Every displayed number must be traceable to observations, timestamps, and sources
(IMPLEMENTATION.md §17 lineage, §44).

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| v1.0 | 2026-09-09 | Initial freeze per IMPLEMENTATION.md Phase 0 |
# Airfare Price Index (APIx) - India Aviation Observatory

An automated national aviation intelligence platform that ethically collects airfare data from major Indian airlines and OTAs, cleans and standardizes the quotes, computes a weighted Airfare Price Index (APIx), detects price anomalies, forecasts fares, benchmarks against official DGCA data, and exposes insights via an interactive dashboard and REST API.

---

## 🏛️ System Architecture

```
                       [ TARGET DATA SOURCES ]
     Airlines: IndiGo, Air India, Air India Express, Akasa, SpiceJet
      OTAs: MakeMyTrip, Yatra, Ixigo, Goibibo, EaseMyTrip
                                 │
                                 ▼
                     [ ETHICAL SCRAPING ENGINE ]
             - Robots.txt validation & Crawl-Delay policy
             - Non-intrusive Token Bucket Rate Limiting (10-25 req/min)
             - Exponential backoff retry handler
             - Strict CAPTCHA / anti-bot challenge abort policy
                                 │
                                 ▼
                   [ DATA PROCESSING PIPELINE ]
               - Deduplication of multi-OTA quotes
               - Missing-value imputation & field validation
               - Component breakdown (Base Fare, GST 5%, UDF, Convenience)
               - Outlier detection (Z-score & IQR thresholds)
               - Sold-out / cancellation status handling
                                 │
                                 ▼
                 [ DATA STORAGE (PostgreSQL / SQLite) ]
          routes, route_weights, airlines, sources, fare_quotes,
          processed_fares, index_values, forecasts, anomalies, runs
                                 │
                                 ▼
                 [ INTELLIGENCE & INDEX ENGINE ]
           - Weighted Laspeyres Price Index (Base Period = 100.0)
           - Lead-time elasticity curves (T+45 to T+1)
           - ML Forecaster (XGBoost + Seasonal Holt-Winters)
           - DGCA domestic passenger yield backtesting
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [ REST API (FastAPI / Express) ]          [ OBSERVATORY DASHBOARD ]
   - Swagger / OpenAPI 3.0 docs               - Real-Time Index & Trends
   - Route basket weight config               - Route Matrix & Heatmaps
   - Automated & manual scraping              - Anomaly Investigation
```

---

## ⚖️ Ethical Scraping Policy
1. **Robots.txt Adherence:** All crawlers parse `robots.txt` before issuing requests.
2. **Strict Non-Bypass:** Never attempt to circumvent CAPTCHAs, Cloudflare Turnstile, or anti-bot defenses.
3. **Gentle Rate Limiting:** All requests are throttled to 10–25 requests per minute with randomized human jitter.
4. **Transparent User-Agent:** Observational identity is broadcast via `APIx-India-Aviation-Observatory/1.0`.

---

## 📐 Mathematical Index Formula

The headline Airfare Price Index ($I_t$) uses a weighted Laspeyres aggregation across the representative Indian route basket:

$$I_t = \sum_{r \in R} W_r \times \left( \frac{P_{r,t}}{P_{r,0}} \right) \times 100$$

Where:
- $W_r$: Configurable route weight (stored in database, initially derived from DGCA passenger volume shares).
- $P_{r,t}$: Mean normalized price for route $r$ on day $t$.
- $P_{r,0}$: Baseline price for route $r$ at the base period (Base Index = 100.00).

---

## 🛫 Monitored Route Basket

| Route Code | Origin | Destination | Distance | Default Weight | DGCA Traffic Share |
|------------|--------|-------------|----------|----------------|-------------------|
| `DEL-BOM`  | Delhi  | Mumbai      | 1,148 km | 0.28 (28%)     | 28.0%             |
| `DEL-BLR`  | Delhi  | Bengaluru   | 1,740 km | 0.22 (22%)     | 22.0%             |
| `BOM-BLR`  | Mumbai | Bengaluru   | 842 km   | 0.16 (16%)     | 16.0%             |
| `DEL-CCU`  | Delhi  | Kolkata     | 1,305 km | 0.14 (14%)     | 14.0%             |
| `BLR-HYD`  | Bengaluru | Hyderabad| 502 km   | 0.10 (10%)     | 10.0%             |
| `MAA-DEL`  | Chennai| Delhi       | 1,760 km | 0.10 (10%)     | 10.0%             |

---

---

## 🔑 Required API Keys & Environment Configuration

To fetch **live market airfares** on your local machine, configure your API keys in a `.env` file. The engine uses a tiered adapter design: if an API key is missing or exceeds monthly limits, it automatically falls back to secondary adapters and OTA scrapers.

### Summary of Keys

| Environment Variable | Required / Optional | Purpose | Free Tier Limit | Where to Get |
|----------------------|---------------------|---------|-----------------|--------------|
| `SERPAPI_KEY` | **Recommended** (Primary) | Primary Tier 1 live flight search engine (Google Flights API) | **250 free searches / month** | [serpapi.com](https://serpapi.com/) |
| `RAPIDAPI_KEY` | **Optional** (Backup) | Backup Tier 1 live flight adapter (DataCrawler Google Flights) | Free tier available | [rapidapi.com](https://rapidapi.com/) |
| `DATABASE_URL` | **Optional** (Default: SQLite) | PostgreSQL connection string (e.g. Neon, Supabase, RDS) | Defaults to local SQLite | [neon.tech](https://neon.tech/) |
| `GEMINI_API_KEY` | **Optional** | Google Gemini AI for smart analytics and insights | Free tier in AI Studio | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

---

### Step-by-Step API Key Setup

#### 1. Obtain SerpApi Key (Primary Data Source)
1. Visit [https://serpapi.com](https://serpapi.com/) and create a free account.
2. Navigate to your **Dashboard / API Key** section.
3. Copy your private API key (e.g., `e4624a2e...`).
4. Paste it as `SERPAPI_KEY` in your `.env` file.

#### 2. (Optional) Obtain RapidAPI Key (Backup Data Source)
1. Visit [https://rapidapi.com](https://rapidapi.com/) and register.
2. Search for the **Google Flights Search / DataCrawler** API.
3. Subscribe to the free plan.
4. Copy your `X-RapidAPI-Key` from the endpoint testing panel.
5. Paste it as `RAPIDAPI_KEY` in your `.env` file.

#### 3. Create Your `.env` File
Create a `.env` file in the project root directory (or in `backend/.env`):

```bash
# Copy from the template
cp .env.example .env
```

Edit `.env` with your values:
```dotenv
# Primary Live Flight Scraper Key (Google Flights via SerpApi)
SERPAPI_KEY="your_serpapi_key_here"

# Backup Live Flight Scraper Key (RapidAPI)
RAPIDAPI_KEY="your_rapidapi_key_here"

# Database Connection (Leave commented or empty to use local SQLite)
DATABASE_URL="sqlite:///backend/apix_airfare.db"

# Optional Gemini AI Key
GEMINI_API_KEY="your_gemini_api_key_here"
```

> [!TIP]
> Both the root `.env` and `backend/.env` are automatically loaded by the Python engine. You only need to set it in either location.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+
- Python 3.10+ (for native Python backend / tests)

### 1. Run with Express + Vite (Production Platform)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Python Backend with FastAPI
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Run Unit & Scraper Tests
```bash
pytest backend/tests/
```


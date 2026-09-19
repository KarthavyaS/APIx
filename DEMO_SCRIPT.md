# APIx Demo Video Voiceover Script

---

### [0:00 – 0:40] Scene 1: Introduction & National Overview
**Screen Action:**
- Start on **National Price Overview** in full screen (`F11`).
- Hover over the **State Emblem of India** and the **MoSPI / NSO** banner.
- Hover smoothly over the **4 Headline Metric Cards** (Airfare Index, Base 100.0, Average Fare, Active Anomalies).

**Voiceover:**
"Welcome to the demonstration of **APIx — The National Airfare Price Index Platform**, built for the **National Statistical Office (NSO)** and the **Ministry of Statistics, Government of India**.

Over 90% of domestic flight tickets are booked online under dynamic pricing, where fares change every minute. For policymakers, the **Reserve Bank of India (RBI)**, and everyday citizens, tracking real transport inflation has always been difficult. 

APIx provides an authoritative, live price monitoring observatory.

Right here on the **National Price Overview**, our headline index stands at 108.45. This means flight prices today are 8.5% above baseline. Beside it, we track the national average fare, daily rate movements, and active price surge warnings across India's major flight corridors."

---

### [0:40 – 1:25] Scene 2: Index Trends & Route Heatmap Matrix
**Screen Action:**
- Scroll down to the **Index Trend Chart** and click **Daily**, **Weekly**, and **Monthly**.
- Scroll to the **Route Basket Heatmap Matrix**.
- Click the **DEL-BOM (T+1)** cell, then click **DEL-BOM (T+45)** to show the fee drawer on the right.

**Voiceover:**
"Scrolling down, the **Index Trend Chart** shows how overall ticket prices have moved over recent days, weeks, and months, weighted by actual passenger traffic on top routes.

Below is our **Route Basket Heatmap Matrix**, tracking prices from 45 days before flight departure down to the final day.

When we click on any route—like Delhi to Mumbai one day before travel—the system opens a clear fee breakdown: separating the airline's Base Fare from GST, Airport Development Fees (UDF), and booking portal fees. This allows policymakers and the RBI to see whether price hikes come from airline fares or statutory airport taxes."

---

### [1:25 – 2:10] Scene 3: Live Data Harvest & Pipeline
**Screen Action:**
- Click **Live Data Harvest** in the sidebar.
- Click the blue **"Harvest Live"** button at the top right.
- Scroll through the live audit log showing harvested quotes across routes.

**Voiceover:**
"Now let's see how our data engine collects live quotes under **Live Data Harvest**.

*[Click 'Harvest Live']*

APIx uses a resilient two-tier collection engine with **zero fake or synthetic data**. 

It pulls real-time flight quotes from live aggregators and travel portals like MakeMyTrip and Yatra, following strict ethical rate limits. If a travel portal slows down, the pipeline smoothly relies on our primary feeds without missing a beat. 

The system instantly removes duplicate flights, filters out bad data, and stores verified records in the database."

---

### [2:10 – 2:55] Scene 4: Citizen Calculator & Booking Savings
**Screen Action:**
- Click **Citizen Price Calculator** in the sidebar.
- Select **Delhi to Bengaluru (DEL-BLR)** from the route dropdown.
- Click **Advance Booking Savings** in the sidebar and hover along the curve points (T+45, T+15, T+7, T+1).

**Voiceover:**
"For citizens and travelers, APIx offers the **Citizen Price Calculator**. 

A passenger can select their route—such as Delhi to Bengaluru—to see typical price ranges and the cheapest booking window.

Next, on the **Advance Booking Savings** tab, we map out booking lead-time curves. The data clearly shows that ticket prices remain affordable up to two weeks before travel, but surge steeply in the final 7 days, costing up to two times more. This gives consumers and travel planners clear evidence to book early and save money."

---

### [2:55 – 3:45] Scene 5: Price Surge Alerts & 14-Day ML Forecast
**Screen Action:**
- Click **Price Surge Alerts** in the sidebar.
- Show the table of flagged routes and click **"Mark Investigated"** on a row.
- Click **14-Day Price Outlook** in the sidebar and hover over the forecast line and shaded band.

**Voiceover:**
"For regulatory bodies like **DGCA** and the **Ministry of Civil Aviation**, APIx provides real-time **Price Surge Alerts**.

Our anomaly detector monitors price spikes: if fares on any route surge more than 25% above normal, the system automatically flags it with an alert so regulators can investigate potential price gouging.

Under the **14-Day Price Outlook**, an AI forecasting model projects where flight prices are headed over the next two weeks. It accounts for weekend demand and upcoming holidays, complete with 95% statistical confidence bands."

---

### [3:45 – 4:30] Scene 6: DGCA Benchmark Calibration & Official NSO Bulletin
**Screen Action:**
- Click **DGCA Benchmark Validation** in the sidebar; point out the live calibration progress banner and route targets.
- Click **NSO Official Bulletin & Data** in the sidebar.
- Scroll down the official press release sheet and click **"Download Daily Series CSV"**.

**Voiceover:**
"Under **DGCA Benchmark Validation**, the system runs an active calibration cycle. As daily market observations are collected, the engine benchmarks our live price index against official quarterly DGCA airline passenger yields. This validation is currently in progress, continuously accumulating daily data points to ensure strict statistical alignment.

Next, under **NSO Official Bulletin & Data**, the platform automatically compiles verified data into formal monthly press releases formatted to government publication standards.

Economists, RBI analysts, researchers, and journalists can download full open datasets in CSV format with one click or export the bulletin as a PDF."

---

### [4:30 – 5:10] Scene 7: OpenAPI Service, Accessibility & Conclusion
**Screen Action:**
- Click **OpenAPI REST Service** in the sidebar and expand one endpoint (`/api/analytics/forecast`).
- At the bottom of the sidebar, click **"हिन्दी (Hindi)"** to switch language, test font buttons (**A-**, **A**, **A+**), then toggle back to English.
- Return to **National Price Overview** for the final screen.

**Voiceover:**
"APIx also provides standard **OpenAPI REST endpoints** for direct digital integration with national economic databases and statistical systems.

Built in full compliance with the **Guidelines for Indian Government Websites**, the entire portal supports complete bilingual switching to Hindi *[toggle to Hindi]*, dynamic font sizing, and high contrast modes.

In summary, APIx brings transparent, high-frequency, and trustworthy price intelligence to Indian aviation—empowering policymakers, the RBI, and every flying citizen.

Thank you!"

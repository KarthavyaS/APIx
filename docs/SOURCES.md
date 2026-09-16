# Source screening and ethical collection record

This repository now maintains a Phase 3-style ethical collection baseline in the backend scraper layer:

- `BaseScraper` is the shared abstract contract that exposes `search(origin, destination, departure_date)`.
- `RobotsPolicy` is lazy-loaded and cacheable instead of being imported eagerly.
- `SourceRateLimiter` is source-scoped rather than global.
- `RetryPolicy` uses the documented transient fail ladder of 1s, 2s, then 4s with bounded safe retry behavior.
- `EthicalScraperBase.verify_no_captcha()` aborts on CAPTCHA-style content and never bypasses a challenge.

## Current adapter source list

1. IndiGoAdapter — source type AIRLINE — base URL https://www.goindigo.in — compliant mock adapter in the test scaffold.
2. AirIndiaAdapter — source type AIRLINE — base URL https://www.airindia.com — compliant mock adapter in the test scaffold.
3. AirIndiaExpressAdapter — source type AIRLINE — base URL https://www.airindiaexpress.com — compliant mock adapter in the test scaffold.
4. AkasaAirAdapter — source type AIRLINE — base URL https://www.akasaair.com — compliant mock adapter in the test scaffold.
5. SpiceJetAdapter — source type AIRLINE — base URL https://www.spicejet.com — compliant mock adapter in the test scaffold.
6. MakeMyTripAdapter — source type OTA — base URL https://www.makemytrip.com — compliant mock adapter in the test scaffold.
7. YatraAdapter — source type OTA — base URL https://www.yatra.com — compliant mock adapter in the test scaffold.
8. IxigoAdapter — source type OTA — base URL https://www.ixigo.com — compliant mock adapter in the test scaffold.
9. GoibiboAdapter — source type OTA — base URL https://www.goibibo.com — compliant mock adapter in the test scaffold.
10. EaseMyTripAdapter — source type OTA — base URL https://www.easemytrip.com — compliant mock adapter in the test scaffold.

All adapters use the ethical acquisition assumptions from Phase 3 and make no attempt to bypass CAPTCHAs, anti-bot signals, or robots restrictions.

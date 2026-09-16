"""APIx live collection CLI.
Run manual live harvest via Tier 1 APIs and Tier 2 Polite scrapers, storing into database and recalculating index.
"""
import argparse
import logging
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("APIx.CLI")


def main():
    parser = argparse.ArgumentParser(prog="apix-collect")
    parser.add_argument("--full", action="store_true", help="run full live pipeline harvest & indexing")
    args = parser.parse_args()

    from backend.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)

    from backend.pipeline.scheduler import run_full_pipeline_sync

    db = SessionLocal()
    try:
        logger.info("Executing live data pipeline harvest run...")
        result = run_full_pipeline_sync(db=db)
        print("\n--- Pipeline Run Result ---")
        print(f"Run ID: {result.get('run_id')}")
        print(f"Total Quotes Harvested: {result.get('total_harvested')}")
        print(f"Normalized Quotes Stored: {result.get('normalized_quotes_count')}")
        print(f"National APIx Index: {result.get('national_apix')}")
        print(f"Average Fare INR: INR {result.get('avg_fare_inr')}")
    finally:
        db.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
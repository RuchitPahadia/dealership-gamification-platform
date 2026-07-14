from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
EVENTS_FILE = DATA_DIR / "z_event_log_may_june_2026.csv"
EMPLOYEES_FILE = DATA_DIR / "z_employees.csv"
LOCATIONS_FILE = DATA_DIR / "z_locations.csv"


def load_events() -> pd.DataFrame:
    df = pd.read_csv(EVENTS_FILE)
    if "created_date" in df.columns:
        df["created_date"] = pd.to_datetime(df["created_date"])
    return df


def load_employees() -> pd.DataFrame:
    return pd.read_csv(EMPLOYEES_FILE)


def load_locations() -> pd.DataFrame:
    return pd.read_csv(LOCATIONS_FILE)

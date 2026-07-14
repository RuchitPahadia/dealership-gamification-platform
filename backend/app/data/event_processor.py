from __future__ import annotations

import pandas as pd


EMPLOYEE_COLUMNS = ["id", "name", "department", "designation"]
LOCATION_COLUMNS = ["location_code", "location_name"]
PROCESSED_COLUMNS = [
    "event_id",
    "booking_id",
    "user_id",
    "employee_name",
    "department",
    "designation",
    "branch",
    "location_code",
    "action",
    "timestamp",
]


def process_events(
    events: pd.DataFrame,
    employees: pd.DataFrame,
    locations: pd.DataFrame,
) -> pd.DataFrame:
    events = events.rename(columns={"id": "event_id"})
    employees = employees.loc[:, EMPLOYEE_COLUMNS].rename(
        columns={
            "id": "employee_id",
            "department": "employee_department",
        }
    )
    events = events.merge(
        employees,
        left_on="user_id",
        right_on="employee_id",
        how="left",
    )
    locations = locations.loc[:, LOCATION_COLUMNS]
    events = events.merge(
        locations,
        on="location_code",
        how="left",
    )
    events["booking_id"] = (
        events["location_code"].astype(str)
        + "_"
        + events["enquiry_no"].astype(str)
    )
    events["department"] = events["employee_department"].fillna(events["department"])
    events = events.rename(
        columns={
            "name": "employee_name",
            "location_name": "branch",
            "action_code": "action",
            "created_date": "timestamp",
        }
    )
    return (
        events.loc[:, PROCESSED_COLUMNS]
        .dropna(subset=["booking_id", "user_id", "action", "timestamp"])
        .sort_values("timestamp")
        .reset_index(drop=True)
    )

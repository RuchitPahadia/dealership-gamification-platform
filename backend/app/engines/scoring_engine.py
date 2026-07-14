from __future__ import annotations

from pathlib import Path

from app.data.booking_builder import build_booking_timelines
from app.data.csv_loader import (
    load_employees,
    load_events,
    load_locations,
)
from app.data.event_processor import process_events
from app.services.action_catalog_service import ActionCatalogService


BASE_DIR = Path(__file__).resolve().parents[2]
CATALOG_PATH = BASE_DIR.parent / "shared" / "action_catalog.json"

SCORING_FIELDS = (
    "event_id",
    "booking_id",
    "user_id",
    "employee_name",
    "department",
    "branch",
    "location_code",
    "action",
    "timestamp",
)


def read_scoring_events() -> list[dict]:
    events = load_events()
    employees = load_employees()
    locations = load_locations()

    processed_events = process_events(events, employees, locations)
    booking_timelines = build_booking_timelines(processed_events)

    catalog_service = ActionCatalogService(CATALOG_PATH)

    scoring_events: list[dict] = []

    for timeline in booking_timelines.values():
        for event in timeline:
            action = str(event["action"])
            points = catalog_service.get_weight(action)

            if points == 0:
                continue

            scoring_event = {field: event[field] for field in SCORING_FIELDS}

            scoring_event["points"] = points
            scoring_event["is_real_delivery"] = (
                action == "DELIVERED"
            )

            scoring_events.append(scoring_event)

    return scoring_events
from __future__ import annotations

from typing import Any

import pandas as pd


def build_booking_timelines(
    processed_events: pd.DataFrame,
) -> dict[str, list[dict[str, Any]]]:

    events = processed_events.copy()

    events = events[
        events["booking_id"].notna()
        & (events["booking_id"] != "-_-")
        & events["location_code"].notna()
        & (events["location_code"] != "-")
    ]

    if not events["timestamp"].is_monotonic_increasing:
        events = events.sort_values("timestamp")

    return {
        str(booking_id): group.to_dict(orient="records")
        for booking_id, group in events.groupby("booking_id", sort=False)
    }
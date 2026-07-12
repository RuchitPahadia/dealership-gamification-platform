from pathlib import Path

from backend.app.engines.gamification_engine import GamificationEngine
from backend.app.services.action_catalog_service import ActionCatalogService


def test_mass_update_rate_cap_applies(tmp_path: Path) -> None:
    catalog = tmp_path / "action_catalog.json"
    catalog.write_text(
        """{
  "actions": [
    {"action": "FINANCE_INFO_UPDATED", "weight": 5}
  ]
}""",
        encoding="utf-8",
    )
    engine = GamificationEngine(ActionCatalogService(catalog), mass_update_cap_per_minute=3)

    recent_events: list[dict] = []
    awarded_points: list[int] = []
    for minute_idx in range(5):
        event = {
            "action": "FINANCE_INFO_UPDATED",
            "user_id": "USR009",
            "booking_id": f"B-{minute_idx}",
            "occurred_at": f"2026-07-12T10:00:0{minute_idx}Z",
        }
        result = engine.process_event(event=event, recent_events=recent_events)
        recent_events.append(event)
        awarded_points.append(result.points)

    assert awarded_points[:3] == [5, 5, 5]
    assert awarded_points[3:] == [0, 0]

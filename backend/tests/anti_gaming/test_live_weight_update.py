from pathlib import Path

from backend.app.engines.gamification_engine import GamificationEngine
from backend.app.services.action_catalog_service import ActionCatalogService


def test_next_scoring_call_uses_updated_weight(tmp_path: Path) -> None:
    catalog = tmp_path / "action_catalog.json"
    catalog.write_text(
        """{
  "actions": [
    {"action": "BOOKING_CREATED", "weight": 30}
  ]
}""",
        encoding="utf-8",
    )
    catalog_service = ActionCatalogService(catalog)
    engine = GamificationEngine(catalog_service)

    first = engine.process_event(
        {
            "action": "BOOKING_CREATED",
            "user_id": "USR001",
            "booking_id": "BLR-100",
            "occurred_at": "2026-07-12T08:00:00Z",
        }
    )
    assert first.points == 30

    catalog_service.update_weights({"BOOKING_CREATED": 75})
    second = engine.process_event(
        {
            "action": "BOOKING_CREATED",
            "user_id": "USR001",
            "booking_id": "BLR-101",
            "occurred_at": "2026-07-12T08:10:00Z",
        }
    )
    assert second.points == 75

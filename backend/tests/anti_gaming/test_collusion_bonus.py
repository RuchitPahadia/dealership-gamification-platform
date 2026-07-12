from pathlib import Path

from backend.app.engines.gamification_engine import COLLUSION_BONUS_ACTION, GamificationEngine
from backend.app.services.action_catalog_service import ActionCatalogService


def _build_engine(tmp_path: Path) -> GamificationEngine:
    catalog = tmp_path / "action_catalog.json"
    catalog.write_text(
        """{
  "actions": [
    {"action": "ZERO_REWORK_BOOKING_BONUS", "weight": 120}
  ]
}""",
        encoding="utf-8",
    )
    return GamificationEngine(ActionCatalogService(catalog))


def test_collusion_bonus_blocked_without_delivered(tmp_path: Path) -> None:
    engine = _build_engine(tmp_path)
    result = engine.process_event(
        {
            "action": COLLUSION_BONUS_ACTION,
            "user_id": "USR001",
            "booking_id": "BOOK-1",
            "occurred_at": "2026-07-12T11:00:00Z",
        },
        booking_events=[
            {
                "action": "FINANCE_APPROVED",
                "user_id": "USR002",
                "booking_id": "BOOK-1",
                "occurred_at": "2026-07-12T10:00:00Z",
            }
        ],
    )
    assert result.points == 0
    assert result.capped is True
    assert result.reason == "Collusion-bonus gated until real DELIVERED event"


def test_collusion_bonus_awarded_after_real_delivered(tmp_path: Path) -> None:
    engine = _build_engine(tmp_path)
    result = engine.process_event(
        {
            "action": COLLUSION_BONUS_ACTION,
            "user_id": "USR001",
            "booking_id": "BOOK-1",
            "occurred_at": "2026-07-12T12:00:00Z",
        },
        booking_events=[
            {
                "action": "DELIVERED",
                "user_id": "USR003",
                "booking_id": "BOOK-1",
                "occurred_at": "2026-07-12T11:59:00Z",
                "is_real_delivery": True,
            }
        ],
    )
    assert result.points == 120
    assert result.capped is False

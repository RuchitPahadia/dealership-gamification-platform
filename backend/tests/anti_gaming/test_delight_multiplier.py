from pathlib import Path
from app.engines.gamification_engine import GamificationEngine
from app.services.action_catalog_service import ActionCatalogService

def test_customer_delight_multiplier(tmp_path: Path) -> None:
    catalog = tmp_path / "action_catalog.json"
    catalog.write_text(
        """{
  "actions": [
    {"action": "DELIVERED", "weight": 300},
    {"action": "CUSTOMER_REVIEW_SUBMITTED", "weight": 0}
  ]
}""",
        encoding="utf-8",
    )
    engine = GamificationEngine(ActionCatalogService(catalog))

    # 1. Review submitted with 5 stars
    review_event = {
        "action": "CUSTOMER_REVIEW_SUBMITTED",
        "user_id": "u1",
        "booking_id": "b100",
        "rating": 5,
        "timestamp": "2026-07-15T12:00:00Z"
    }
    review_res = engine.process_event(event=review_event)
    assert "1.05x" in review_res.reason

    # 2. Next sale (DELIVERED) gets the multiplier
    sale1_event = {
        "action": "DELIVERED",
        "user_id": "u1",
        "booking_id": "b100",
        "timestamp": "2026-07-15T12:05:00Z"
    }
    sale1_res = engine.process_event(event=sale1_event)
    # 300 * 1.05 = 315
    assert sale1_res.points == 315
    assert "applied" in sale1_res.reason.lower()

    # 3. Following sale has no multiplier (reset)
    sale2_event = {
        "action": "DELIVERED",
        "user_id": "u1",
        "booking_id": "b101",
        "timestamp": "2026-07-15T12:10:00Z"
    }
    sale2_res = engine.process_event(event=sale2_event)
    assert sale2_res.points == 300

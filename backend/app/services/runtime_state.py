from __future__ import annotations

from pathlib import Path
from typing import Any

from backend.app.engines.gamification_engine import GamificationEngine
from backend.app.engines.leaderboard_engine import LeaderboardEngine
from backend.app.services.action_catalog_service import ActionCatalogService
from backend.app.services.analytics_service import AnalyticsService
from backend.app.services.notification_service import NotificationService


REPO_ROOT = Path(__file__).resolve().parents[3]
CATALOG_PATH = REPO_ROOT / "shared" / "action_catalog.json"
DATASET_PATH = REPO_ROOT / "backend" / "tests" / "fixtures" / "demo_dataset.csv"

catalog_service = ActionCatalogService(CATALOG_PATH)
gamification_engine = GamificationEngine(catalog_service)
leaderboard_engine = LeaderboardEngine()
analytics_service = AnalyticsService(DATASET_PATH, catalog_service)
notification_service = NotificationService()


mock_scoring_events: list[dict[str, Any]] = [
    {
        "action": "BOOKING_CONFIRMED",
        "user_id": "USR001",
        "booking_id": "BLR-001",
        "department": "DSE",
        "branch": "Bangalore",
        "name": "Rahul Sharma",
        "badge": "Gold",
        "level": 9,
        "points": 540,
        "occurred_at": "2026-07-12T10:00:00Z",
    },
    {
        "action": "FINANCE_APPROVED",
        "user_id": "USR002",
        "booking_id": "BLR-001",
        "department": "Finance",
        "branch": "Bangalore",
        "name": "Asha Menon",
        "badge": "Silver",
        "level": 8,
        "points": 620,
        "occurred_at": "2026-07-12T10:40:00Z",
    },
    {
        "action": "DELIVERED",
        "user_id": "USR001",
        "booking_id": "BLR-001",
        "department": "DSE",
        "branch": "Bangalore",
        "name": "Rahul Sharma",
        "badge": "Gold",
        "level": 9,
        "points": 660,
        "occurred_at": "2026-07-12T12:00:00Z",
    },
    {
        "action": "ZERO_REWORK_BOOKING_BONUS",
        "user_id": "USR002",
        "booking_id": "BLR-001",
        "department": "Finance",
        "branch": "Bangalore",
        "name": "Asha Menon",
        "badge": "Silver",
        "level": 8,
        "points": 800,
        "occurred_at": "2026-07-12T12:01:00Z",
    },
]


def get_scoring_events() -> list[dict[str, Any]]:
    try:
        from backend.app.engines.scoring_engine import read_scoring_events  # type: ignore

        loaded = read_scoring_events()
        if isinstance(loaded, list) and loaded:
            return loaded
    except Exception:
        pass
    return list(mock_scoring_events)

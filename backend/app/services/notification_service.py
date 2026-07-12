from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class NotificationService:
    def __init__(self) -> None:
        self._notifications: list[dict[str, Any]] = []

    def push_from_scoring(self, scoring_result: dict[str, Any]) -> None:
        user_id = str(scoring_result.get("user_id", ""))
        action = str(scoring_result.get("action", ""))
        points = int(scoring_result.get("points", 0))
        timestamp = datetime.now(tz=timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        if points != 0:
            self._notifications.append(
                {
                    "userId": user_id,
                    "type": "POINTS_AWARDED",
                    "message": f"+{points} XP for {action}",
                    "timestamp": timestamp,
                }
            )
        for badge in scoring_result.get("new_badges", []):
            self._notifications.append(
                {
                    "userId": user_id,
                    "type": "BADGE_UNLOCKED",
                    "message": f"Badge unlocked: {badge}",
                    "timestamp": timestamp,
                }
            )

    def list_user_notifications(self, user_id: str) -> list[dict[str, Any]]:
        return [item for item in self._notifications if item.get("userId") == user_id]

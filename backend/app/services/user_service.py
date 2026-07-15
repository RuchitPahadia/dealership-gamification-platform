from __future__ import annotations

from collections import defaultdict
from datetime import timedelta
from typing import Any

from app.engines.gamification_engine import GamificationEngine
from app.services.runtime_state import get_scoring_events


class UserService:
    def __init__(self) -> None:
        self.events = get_scoring_events()

    def get_user(self, user_id: str) -> dict[str, Any]:
        events = [e for e in self.events if str(e["user_id"]) == user_id]

        if not events:
            return {}

        latest = events[-1]

        total_points = sum(int(e.get("points", 0)) for e in events)

        dates = sorted(
            {
                e["timestamp"].date()
                if hasattr(e["timestamp"], "date")
                else e["timestamp"]
                for e in events
            }
        )

        # Working-calendar-aware streaks: skip branch off-days
        branch_name = latest.get("branch", "YELAHANKA").upper()
        off_days = ["Saturday", "Sunday"] if "YELAHANKA" in branch_name else ["Sunday"]
        
        def is_streak_consecutive(d1, d2, off_days_list):
            diff = d2 - d1
            if diff.days == 1:
                return True
            # If gap is larger, check if every day in between is a configured off-day
            curr = d1 + timedelta(days=1)
            while curr < d2:
                day_name = curr.strftime("%A")
                if day_name not in off_days_list:
                    return False
                curr += timedelta(days=1)
            return True

        streak = 1
        if len(dates) > 1:
            streak = 1
            for i in range(len(dates) - 1, 0, -1):
                if is_streak_consecutive(dates[i - 1], dates[i], off_days):
                    streak += 1
                else:
                    break

        badge = "Bronze"
        if total_points >= 50000:
            badge = "Diamond"
        elif total_points >= 25000:
            badge = "Platinum"
        elif total_points >= 10000:
            badge = "Gold"
        elif total_points >= 5000:
            badge = "Silver"

        return {
            "userId": user_id,
            "name": latest["employee_name"],
            "department": latest["department"],
            "branch": latest["branch"],
            "points": total_points,
            "level": GamificationEngine.level_for_xp(total_points),
            "badge": badge,
            "streakDays": streak,
        }

    def get_badges(self, user_id: str) -> dict[str, Any]:
        events = [e for e in self.events if str(e["user_id"]) == user_id]

        earned = []

        actions = {e["action"] for e in events}

        badge_map = {
            "DOCUMENT_SET_COMPLETED": "Documentation Pro",
            "FINANCE_APPROVED_FIRST_PASS": "First-Pass Finisher",
            "DELIVERED": "Delivery Champion",
        }

        for action, badge in badge_map.items():
            if action in actions:
                earned.append(
                    {
                        "name": badge,
                    }
                )

        return {
            "earned": earned,
            "inProgress": [],
        }
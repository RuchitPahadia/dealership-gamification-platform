from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Any

from app.services.action_catalog_service import ActionCatalogService


MASS_UPDATE_ACTIONS = {
    "FINANCE_INFO_UPDATED",
    "BOOKING_NOTE_ADDED",
    "DSE_COMMITMENTS_UPDATED",
}
COLLUSION_BONUS_ACTION = "ZERO_REWORK_BOOKING_BONUS"


@dataclass
class ScoringResult:
    action: str
    user_id: str
    booking_id: str
    points: int
    capped: bool
    reason: str | None
    level: int
    streak_days: int
    new_badges: list[str]


class GamificationEngine:
    def __init__(self, catalog_service: ActionCatalogService, mass_update_cap_per_minute: int = 6) -> None:
        self.catalog_service = catalog_service
        self.mass_update_cap_per_minute = mass_update_cap_per_minute
        self._user_xp: dict[str, int] = defaultdict(int)
        self._user_badges: dict[str, set[str]] = defaultdict(set)
        self._last_scoring_day: dict[str, date] = {}
        self._streak_days: dict[str, int] = defaultdict(int)
        self._delight_multipliers: dict[str, float] = defaultdict(lambda: 1.0)

    def process_event(
        self,
        event: dict[str, Any],
        recent_events: list[dict[str, Any]] | None = None,
        booking_events: list[dict[str, Any]] | None = None,
    ) -> ScoringResult:
        recent_events = recent_events or []
        booking_events = booking_events or []
        timestamp = self._to_datetime(event.get("timestamp"))
        action = str(event.get("action", ""))
        user_id = str(event.get("user_id", ""))
        booking_id = str(event.get("booking_id", ""))

        capped = False
        reason: str | None = None
        points = int(self.catalog_service.get_weight(action))

        # 1. Process Customer Review Event
        if action == "CUSTOMER_REVIEW_SUBMITTED":
            rating = event.get("rating")
            if rating is None:
                rating = event.get("score")
            
            if rating is not None:
                try:
                    rating_val = float(rating)
                    if rating_val >= 5.0 or rating_val >= 90:
                        self._delight_multipliers[user_id] = 1.05
                    elif rating_val >= 4.0 or rating_val >= 80:
                        self._delight_multipliers[user_id] = 1.03
                    elif rating_val >= 3.0 or rating_val >= 70:
                        self._delight_multipliers[user_id] = 1.01
                    else:
                        self._delight_multipliers[user_id] = 1.0
                except ValueError:
                    self._delight_multipliers[user_id] = 1.05
            else:
                self._delight_multipliers[user_id] = 1.05
            reason = f"Delight multiplier registered: {self._delight_multipliers[user_id]}x"

        # 2. Process Mass Update Rate Caps
        if self._is_mass_update_capped(event, recent_events):
            capped = True
            points = 0
            reason = "Mass-update rate cap triggered"

        # 3. Process Collusion Gate
        if action == COLLUSION_BONUS_ACTION and not self._has_real_delivery(booking_events):
            capped = True
            points = 0
            reason = "Collusion-bonus gated until real DELIVERED event"

        # 4. Apply Customer Delight Multiplier on next DELIVERED sale
        if action == "DELIVERED" and not capped:
            mult = self._delight_multipliers[user_id]
            if mult > 1.0:
                old_points = points
                points = int(points * mult)
                reason = f"Customer Delight Multiplier applied: {mult}x (+{points - old_points} RP)"
                self._delight_multipliers[user_id] = 1.0

        if points != 0:
            self._user_xp[user_id] += points
            self._update_streak(user_id, timestamp.date())

        new_badges = self._assign_badges(user_id, action)
        return ScoringResult(
            action=action,
            user_id=user_id,
            booking_id=booking_id,
            points=points,
            capped=capped,
            reason=reason,
            level=self.level_for_xp(self._user_xp[user_id]),
            streak_days=self._streak_days[user_id],
            new_badges=new_badges,
        )

    def generate_relay_bonus_events(self, booking_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        if not self._has_real_delivery(booking_events):
            return []

        has_rework_loop = any(str(item.get("action")) == "REWORK_LOOP_TRIGGERED" for item in booking_events)
        if has_rework_loop:
            return []

        participants = {
            str(item.get("user_id")): str(item.get("department", "")).upper()
            for item in booking_events
            if item.get("user_id")
        }
        dse_users = [u for u, dept in participants.items() if dept == "DSE"]
        finance_users = [u for u, dept in participants.items() if dept == "FINANCE"]
        if not dse_users or not finance_users:
            return []

        booking_id = str(booking_events[-1].get("booking_id", ""))
        timestamp = self._to_datetime(booking_events[-1].get("timestamp")).isoformat()
        return [
            {
                "action": COLLUSION_BONUS_ACTION,
                "user_id": dse_users[-1],
                "department": "DSE",
                "booking_id": booking_id,
                "timestamp": timestamp,
            },
            {
                "action": COLLUSION_BONUS_ACTION,
                "user_id": finance_users[-1],
                "department": "Finance",
                "booking_id": booking_id,
                "timestamp": timestamp,
            },
        ]

    def _is_mass_update_capped(self, event: dict[str, Any], recent_events: list[dict[str, Any]]) -> bool:
        action = str(event.get("action", ""))
        if action not in MASS_UPDATE_ACTIONS:
            return False

        user_id = str(event.get("user_id", ""))
        now = self._to_datetime(event.get("timestamp"))
        window_start = now - timedelta(minutes=1)
        in_window = [
            item
            for item in recent_events
            if str(item.get("user_id")) == user_id
            and str(item.get("action")) == action
            and self._to_datetime(item.get("timestamp")) >= window_start
        ]
        return len(in_window) >= self.mass_update_cap_per_minute

    @staticmethod
    def _has_real_delivery(booking_events: list[dict[str, Any]]) -> bool:
        for item in booking_events:
            if str(item.get("action")) == "DELIVERED" and bool(item.get("is_real_delivery", True)):
                return True
        return False

    def _assign_badges(self, user_id: str, action: str) -> list[str]:
        newly_awarded: list[str] = []
        badge_map = {
            "DOCUMENT_SET_COMPLETED": "Documentation Pro",
            "FINANCE_APPROVED_FIRST_PASS": "First-Pass Finisher",
            "DELIVERED": "Delivery Champion",
        }
        badge = badge_map.get(action)
        if badge and badge not in self._user_badges[user_id]:
            self._user_badges[user_id].add(badge)
            newly_awarded.append(badge)
        return newly_awarded

    def _update_streak(self, user_id: str, event_day: date) -> None:
        previous_day = self._last_scoring_day.get(user_id)
        if previous_day is None:
            self._streak_days[user_id] = 1
        elif previous_day == event_day - timedelta(days=1):
            self._streak_days[user_id] += 1
        elif previous_day != event_day:
            self._streak_days[user_id] = 1
        self._last_scoring_day[user_id] = event_day

    @staticmethod
    def _to_datetime(value: Any) -> datetime:
        if isinstance(value, datetime):
            if value.tzinfo:
                return value.astimezone(timezone.utc)
            return value.replace(tzinfo=timezone.utc)
        if isinstance(value, str) and value:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            return parsed.astimezone(timezone.utc)
        return datetime.now(tz=timezone.utc)

    @staticmethod
    def level_for_xp(xp: int) -> int:
        return max(1, (xp // 250) + 1)

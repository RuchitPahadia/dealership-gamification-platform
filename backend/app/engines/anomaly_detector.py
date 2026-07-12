from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any


class AnomalyDetector:
    def __init__(self, burst_threshold: int = 12, same_booking_repeat_threshold: int = 8) -> None:
        self.burst_threshold = burst_threshold
        self.same_booking_repeat_threshold = same_booking_repeat_threshold

    def detect(self, scoring_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        flags: list[dict[str, Any]] = []
        flags.extend(self._detect_mass_update_bursts(scoring_events))
        flags.extend(self._detect_same_booking_repeats(scoring_events))
        flags.extend(self._detect_bonus_without_delivery(scoring_events))
        return flags

    def _detect_mass_update_bursts(self, scoring_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        events_by_user: dict[str, list[datetime]] = defaultdict(list)
        for event in scoring_events:
            action = str(event.get("action", ""))
            if action not in {"FINANCE_INFO_UPDATED", "BOOKING_NOTE_ADDED", "DSE_COMMITMENTS_UPDATED"}:
                continue
            user_id = str(event.get("user_id", ""))
            events_by_user[user_id].append(self._to_datetime(event.get("occurred_at")))

        flags: list[dict[str, Any]] = []
        for user_id, timestamps in events_by_user.items():
            sorted_ts = sorted(timestamps)
            for idx, ts in enumerate(sorted_ts):
                window_end = ts + timedelta(minutes=1)
                burst_size = sum(1 for item in sorted_ts[idx:] if item <= window_end)
                if burst_size >= self.burst_threshold:
                    flags.append(
                        {
                            "type": "MASS_UPDATE_BURST",
                            "severity": "medium",
                            "userId": user_id,
                            "message": f"{burst_size} admin actions in 1 minute",
                        }
                    )
                    break
        return flags

    def _detect_same_booking_repeats(self, scoring_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        counter: Counter[tuple[str, str, str]] = Counter()
        for item in scoring_events:
            key = (str(item.get("user_id")), str(item.get("booking_id")), str(item.get("action")))
            counter[key] += 1
        flags: list[dict[str, Any]] = []
        for (user_id, booking_id, action), count in counter.items():
            if count >= self.same_booking_repeat_threshold:
                flags.append(
                    {
                        "type": "SAME_BOOKING_SPAM",
                        "severity": "low",
                        "userId": user_id,
                        "bookingId": booking_id,
                        "message": f"{action} repeated {count} times on one booking",
                    }
                )
        return flags

    def _detect_bonus_without_delivery(self, scoring_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        by_booking: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for event in scoring_events:
            by_booking[str(event.get("booking_id", ""))].append(event)
        flags: list[dict[str, Any]] = []
        for booking_id, events in by_booking.items():
            has_bonus = any(str(item.get("action")) == "ZERO_REWORK_BOOKING_BONUS" for item in events)
            has_delivery = any(str(item.get("action")) == "DELIVERED" for item in events)
            if has_bonus and not has_delivery:
                flags.append(
                    {
                        "type": "COLLUSION_RISK",
                        "severity": "high",
                        "bookingId": booking_id,
                        "message": "Relay bonus detected before DELIVERED milestone",
                    }
                )
        return flags

    @staticmethod
    def _to_datetime(value: Any) -> datetime:
        if isinstance(value, datetime):
            if value.tzinfo:
                return value.astimezone(timezone.utc)
            return value.replace(tzinfo=timezone.utc)
        if isinstance(value, str) and value:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        return datetime.now(tz=timezone.utc)

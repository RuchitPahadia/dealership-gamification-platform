from __future__ import annotations

import csv
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.app.services.action_catalog_service import ActionCatalogService


class AnalyticsService:
    def __init__(self, dataset_path: Path, catalog_service: ActionCatalogService) -> None:
        self.dataset_path = dataset_path
        self.catalog_service = catalog_service

    def get_dashboard_summary(self) -> dict[str, Any]:
        events = self._load_events()
        cycle_time_stats = self._compute_cycle_time(events)
        action_mix = self._compute_action_mix(events)
        branch_totals = self._compute_branch_totals(events)
        return {
            "success": True,
            "summary": {
                "cycleTime": cycle_time_stats,
                "actionMix": action_mix,
                "branchTotals": branch_totals,
                "lastUpdated": datetime.now(tz=timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            },
        }

    def _load_events(self) -> list[dict[str, Any]]:
        if not self.dataset_path.exists():
            return []
        events: list[dict[str, Any]] = []
        with self.dataset_path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                events.append(
                    {
                        "booking_id": row.get("booking_id", ""),
                        "action": row.get("action", ""),
                        "user_id": row.get("user_id", ""),
                        "department": row.get("department", ""),
                        "branch": row.get("branch", ""),
                        "occurred_at": row.get("timestamp", ""),
                    }
                )
        return events

    @staticmethod
    def _compute_cycle_time(events: list[dict[str, Any]]) -> dict[str, float]:
        by_booking: dict[str, dict[str, datetime]] = defaultdict(dict)
        for item in events:
            booking_id = str(item.get("booking_id", ""))
            action = str(item.get("action", ""))
            ts = AnalyticsService._to_datetime(item.get("occurred_at"))
            if action == "BOOKING_CREATED":
                by_booking[booking_id].setdefault("start", ts)
            if action == "DELIVERED":
                by_booking[booking_id].setdefault("end", ts)

        durations = [
            (v["end"] - v["start"]).total_seconds() / 3600.0
            for v in by_booking.values()
            if "start" in v and "end" in v and v["end"] >= v["start"]
        ]
        if not durations:
            return {"averageHours": 0.0, "minHours": 0.0, "maxHours": 0.0}
        return {
            "averageHours": round(sum(durations) / len(durations), 2),
            "minHours": round(min(durations), 2),
            "maxHours": round(max(durations), 2),
        }

    @staticmethod
    def _compute_action_mix(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        counts = Counter(str(item.get("action", "")) for item in events if item.get("action"))
        ranked = sorted(counts.items(), key=lambda row: row[1], reverse=True)
        return [{"action": action, "count": count} for action, count in ranked]

    def _compute_branch_totals(self, events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        branch_points = defaultdict(int)
        for item in events:
            branch = str(item.get("branch", ""))
            action = str(item.get("action", ""))
            branch_points[branch] += int(self.catalog_service.get_weight(action))
        ranked = sorted(branch_points.items(), key=lambda row: row[1], reverse=True)
        return [{"branch": branch, "points": points} for branch, points in ranked if branch]

    @staticmethod
    def _to_datetime(value: Any) -> datetime:
        if isinstance(value, datetime):
            if value.tzinfo:
                return value.astimezone(timezone.utc)
            return value.replace(tzinfo=timezone.utc)
        if isinstance(value, str) and value:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        return datetime.now(tz=timezone.utc)

from __future__ import annotations
from app.engines.gamification_engine import GamificationEngine
from app.services.department_service import DepartmentService

import json
import os
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any


class LeaderboardEngine:
    def __init__(self, cache_ttl_seconds: int = 30) -> None:
        self.cache_ttl_seconds = cache_ttl_seconds
        self._cache: dict[str, tuple[datetime, dict[str, Any]]] = {}
        self._redis = self._build_redis_client()

    # NEW
        self.department_service = DepartmentService()

    def get_leaderboard(self, scope: str, scoring_events: list[dict[str, Any]]) -> dict[str, Any]:
        cache_key = f"leaderboard:{scope}"
        cached = self._get_cache(cache_key)
        if cached is not None:
            return cached

        scope_normalized = scope.lower()
        if scope_normalized == "individual":
            payload = self._build_individual_response(scoring_events)
        elif scope_normalized in {"branch", "department"}:
            payload = self._build_grouped_response(scope_normalized, scoring_events)
        else:
            payload = {
                "success": False,
                "scope": scope,
                "lastUpdated": self._utc_now(),
                "leaderboard": [],
            }

        self._set_cache(cache_key, payload)
        return payload

    def get_current_duel(self, scoring_events: list[dict[str, Any]]) -> dict[str, Any]:
        utc_now = datetime.now(tz=timezone.utc)

        remaining_hours = max(
        0,
        24 - utc_now.hour - 1
    )

        match = self.department_service.featured_match(
        scoring_events
    )

        return {
        "success": True,
        "duel": {
            "id": "MATCH001",
            **match,
            "remainingHours": remaining_hours,
        },
    }   
    def get_daily_quests(self, user_id: str, scoring_events: list[dict[str, Any]]) -> dict[str, Any]:
        today = datetime.now(tz=timezone.utc).date()
        user_events = [
            item
            for item in scoring_events
            if str(item.get("user_id")) == user_id
            and self._to_datetime(item.get("timestamp")).date() == today
        ]

        booking_progress = sum(1 for item in user_events if str(item.get("action")) == "BOOKING_CONFIRMED")
        relay_progress = sum(1 for item in user_events if str(item.get("action")) == "ZERO_REWORK_BOOKING_BONUS")
        follow_up_progress = sum(1 for item in user_events if str(item.get("action")) == "FOLLOW_UP_COMPLETED")
        print (
            f"[QUEST DEBUG] user={user_id}, "
            f"events_today={len(user_events)}, "
            f"booking={booking_progress}, "
            f"followup={follow_up_progress}, "
            f"relay={relay_progress}"
)
        
        return {
            "success": True,
            "quests": [
                {
                    "id": "Q01",
                    "title": "Complete 3 Bookings",
                    "progress": min(booking_progress, 3),
                    "target": 3,
                    "rewardXP": 120,
                },
                {
                    "id": "Q02",
                    "title": "Close 4 Follow-Ups",
                    "progress": min(follow_up_progress, 4),
                    "target": 4,
                    "rewardXP": 90,
                },
                {
                    "id": "Q03",
                    "title": "Achieve 1 Clean Relay Bonus",
                    "progress": min(relay_progress, 1),
                    "target": 1,
                    "rewardXP": 160,
                },
            ],
        }

    def _build_individual_response(self, scoring_events: list[dict[str, Any]]) -> dict[str, Any]:
        by_user: dict[str, dict[str, Any]] = {}
        for item in scoring_events:
            user_id = str(item.get("user_id", ""))
            if not user_id:
                continue
            if user_id not in by_user:
                by_user[user_id] = {
                    "userId": user_id,
                    "name": str(item.get("employee_name", user_id)),
                    "department": str(item.get("department", "")),
                    "branch": str(item.get("branch", "")),
                    "points": 0,
                    "level": 1,
                    "badge": str(item.get("badge", "Bronze")),
                }
            by_user[user_id]["points"] += int(item.get("points", 0))

        for row in by_user.values():
            row["level"] = GamificationEngine.level_for_xp(row["points"])   
        ranked = sorted(by_user.values(), key=lambda row: row["points"], reverse=True)

        leaderboard = [{"rank": index + 1, **row} for index, row in enumerate(ranked)]
        return {
            "success": True,
            "scope": "individual",
            "lastUpdated": self._utc_now(),
            "leaderboard": leaderboard,
        }

    def _build_grouped_response(
    self,
    scope: str,
    scoring_events: list[dict[str, Any]],) -> dict[str, Any]:
        if scope == "department":
            ranked = self.department_service.ranked_departments(
                scoring_events
        )

            leaderboard = [
                {
                    "rank": item["rank"],
                    "scopeId": item["department"],
                "name": item["department"],
                "points": item["points"],
                }
                for item in ranked
        ]

        else:
            grouped = defaultdict(int)
            
            try:
                from app.data.csv_loader import load_employees
                employee_names = set(str(name).strip().upper() for name in load_employees()["name"].dropna())
            except Exception:
                employee_names = set()
            
            for item in scoring_events:
                key = str(item.get(scope, "")).strip()

                if key:
                    if scope == "branch" and key.upper() in employee_names:
                        continue
                    grouped[key] += int(item.get("points", 0))

            ranked = sorted(
                grouped.items(),
                key=lambda row: row[1],
                reverse=True,
        )

            leaderboard = [
                {
                "rank": index + 1,
                "scopeId": key,
                "name": key,
                "points": points,
            }
            for index, (key, points) in enumerate(ranked)
        ]

        return {
        "success": True,
        "scope": scope,
        "lastUpdated": self._utc_now(),
        "leaderboard": leaderboard,
    }
    def _get_cache(self, key: str) -> dict[str, Any] | None:
        if self._redis is not None:
            cached = self._redis.get(key)
            if cached:
                return json.loads(cached)
            return None
        cached = self._cache.get(key)
        if not cached:
            return None
        expires_at, value = cached
        if expires_at < datetime.now(tz=timezone.utc):
            self._cache.pop(key, None)
            return None
        return json.loads(json.dumps(value))

    def _set_cache(self, key: str, value: dict[str, Any]) -> None:
        if self._redis is not None:
            self._redis.setex(key, self.cache_ttl_seconds, json.dumps(value))
            return
        expires_at = datetime.now(tz=timezone.utc).replace(microsecond=0)
        expires_at = expires_at.fromtimestamp(expires_at.timestamp() + self.cache_ttl_seconds, tz=timezone.utc)
        self._cache[key] = (expires_at, json.loads(json.dumps(value)))

    @staticmethod
    def _build_redis_client() -> Any | None:
        redis_url = os.getenv("REDIS_URL", "").strip()
        if not redis_url:
            return None
        try:
            import redis  # type: ignore

            client = redis.Redis.from_url(redis_url, decode_responses=True)
            client.ping()
            return client
        except Exception:
            return None

    @staticmethod
    def _utc_now() -> str:
        return datetime.now(tz=timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    @staticmethod
    def _to_datetime(value: Any) -> datetime:
        if isinstance(value, datetime):
            if value.tzinfo:
                return value.astimezone(timezone.utc)
            return value.replace(tzinfo=timezone.utc)
        if isinstance(value, str) and value:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        return datetime.now(tz=timezone.utc)

from __future__ import annotations

from fastapi import APIRouter, Query

from backend.app.services.runtime_state import get_scoring_events, leaderboard_engine


router = APIRouter(tags=["leaderboard"])


@router.get("/leaderboard")
def get_leaderboard(scope: str = Query(default="individual")) -> dict:
    return leaderboard_engine.get_leaderboard(scope, get_scoring_events())


@router.get("/duels/current")
def get_current_duel() -> dict:
    return leaderboard_engine.get_current_duel(get_scoring_events())


@router.get("/quests/daily")
def get_daily_quests(user_id: str = Query(default="USR001", alias="userId")) -> dict:
    return leaderboard_engine.get_daily_quests(user_id, get_scoring_events())

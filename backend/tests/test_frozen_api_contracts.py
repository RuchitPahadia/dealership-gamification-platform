from backend.app.services.runtime_state import get_scoring_events, leaderboard_engine


def test_individual_leaderboard_contract_shape() -> None:
    payload = leaderboard_engine.get_leaderboard("individual", get_scoring_events())
    assert payload["success"] is True
    assert payload["scope"] == "individual"
    assert isinstance(payload["lastUpdated"], str)
    assert isinstance(payload["leaderboard"], list)
    assert payload["leaderboard"]
    row = payload["leaderboard"][0]
    assert set(row.keys()) == {"rank", "userId", "name", "department", "branch", "points", "level", "badge"}


def test_duel_contract_shape() -> None:
    payload = leaderboard_engine.get_current_duel(get_scoring_events())
    duel = payload["duel"]
    assert payload["success"] is True
    assert set(duel.keys()) == {"id", "teamA", "teamB", "teamAScore", "teamBScore", "winner", "remainingHours"}


def test_daily_quest_contract_shape() -> None:
    payload = leaderboard_engine.get_daily_quests("USR001", get_scoring_events())
    assert payload["success"] is True
    assert isinstance(payload["quests"], list)
    if payload["quests"]:
        assert set(payload["quests"][0].keys()) == {"id", "title", "progress", "target", "rewardXP"}

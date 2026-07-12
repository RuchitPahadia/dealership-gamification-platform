from __future__ import annotations

from fastapi import FastAPI

from backend.app.api.v1 import admin_router, dashboard_router, leaderboard_router


app = FastAPI(title="DealerXP Gamification Backend")
app.include_router(leaderboard_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")

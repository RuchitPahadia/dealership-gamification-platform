from __future__ import annotations

from fastapi import APIRouter

from backend.app.services.runtime_state import analytics_service


router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/summary")
def get_dashboard_summary() -> dict:
    return analytics_service.get_dashboard_summary()

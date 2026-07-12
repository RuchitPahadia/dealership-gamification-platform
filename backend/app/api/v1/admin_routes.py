from __future__ import annotations

from pydantic import BaseModel, Field
from fastapi import APIRouter

from backend.app.services.runtime_state import catalog_service


router = APIRouter(prefix="/admin", tags=["admin"])


class WeightUpdate(BaseModel):
    action: str = Field(min_length=1)
    weight: int


class WeightsUpdateRequest(BaseModel):
    updates: list[WeightUpdate]


@router.get("/actions/weights")
def get_action_weights() -> dict:
    weights = catalog_service.get_weights()
    return {
        "success": True,
        "actions": [{"action": action, "weight": weight} for action, weight in sorted(weights.items())],
    }


@router.put("/actions/weights")
def put_action_weights(payload: WeightsUpdateRequest) -> dict:
    updated = catalog_service.update_weights({item.action: item.weight for item in payload.updates})
    return {
        "success": True,
        "actions": [{"action": action, "weight": weight} for action, weight in sorted(updated.items())],
        "appliesFrom": "next-scoring-call",
    }

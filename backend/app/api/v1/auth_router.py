from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.engines.scoring_engine import read_scoring_events

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    employee_id: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    department: str
    password: str


@router.post("/auth/login")
def login(req: LoginRequest):

    employees = read_scoring_events()

    for emp in employees:

        if emp["user_id"] != req.employee_id:
            continue

        # Demo password
        if req.password != "dealer123":
            raise HTTPException(
                status_code=401,
                detail="Invalid password"
            )

        role = emp.get("department", "")

        if role.lower() == "finance":
            role = "Finance Specialist"
        elif role.lower() == "dse":
            role = "Dealer Sales Executive"
        elif role.lower() == "admin":
            role = "Administrator"

        return {
            "success": True,
            "user_id": emp["user_id"],
            "name": emp["employee_name"],
            "role": role,
            "department": emp["department"],
            "branch": emp["branch"]
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid Employee ID"
    )


@router.post("/auth/register")
def register(req: RegisterRequest):

    new_id = "USR" + str(abs(hash(req.email)) % 100000)

    return {
        "success": True,
        "employee_id": new_id,
        "name": req.name,
        "department": req.department
    }
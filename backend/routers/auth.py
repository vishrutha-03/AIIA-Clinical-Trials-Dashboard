from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

DEMO_ROLES = {
    "pi@aiia-demo.com": {"id": "usr-001", "name": "Dr. Anand Kumar Varma", "role": "pi", "role_label": "Principal Investigator"},
    "coordinator@aiia-demo.com": {"id": "usr-002", "name": "Dr. Priya Sharma", "role": "coordinator", "role_label": "Study Coordinator"},
    "monitor@aiia-demo.com": {"id": "usr-003", "name": "Vikramaditya Rao", "role": "monitor", "role_label": "Clinical Monitor (CRA)"},
    "ethics@aiia-demo.com": {"id": "usr-004", "name": "Prof. Meenakshi Sundaram", "role": "ethics", "role_label": "Ethics Committee Secretary"},
    "pv@aiia-demo.com": {"id": "usr-005", "name": "Dr. Rajeshwari Nair", "role": "pv", "role_label": "Pharmacovigilance Officer"},
    "admin@aiia-demo.com": {"id": "usr-006", "name": "Sunil Senapati", "role": "admin", "role_label": "System Administrator"},
    "regulator@aiia-demo.com": {"id": "usr-007", "name": "Dr. K. S. Chandrasekhar", "role": "regulator", "role_label": "Regulatory Auditor"}
}

@router.post("/login")
def login(request: LoginRequest):
    email = request.email.strip().lower()
    if email in DEMO_ROLES and request.password == "AIIA@123":
        user_info = DEMO_ROLES[email]
        return {
            "access_token": f"mock-jwt-token-{user_info['role']}-aiia-ctms-session",
            "token_type": "bearer",
            "user": user_info
        }
    raise HTTPException(status_code=401, detail="Invalid credentials. Use demo password AIIA@123.")

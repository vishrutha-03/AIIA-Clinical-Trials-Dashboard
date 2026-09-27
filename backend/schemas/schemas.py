from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    role_label: str
    department: Optional[str] = None
    institution: Optional[str] = None

class HealthScoreBreakdown(BaseModel):
    recruitment: int
    regulatory: int
    site_performance: int
    data_quality: int
    protocol_deviations: int
    safety: int

class RiskFactor(BaseModel):
    rule: str
    factor: str
    severity: str
    message: str

class RecommendedAction(BaseModel):
    id: str
    title: str
    type: str
    priority: str
    action_code: str

class TrialHealthResponse(BaseModel):
    trial_id: str
    score: int
    risk_tier: str
    tier_badge_color: str
    breakdown: HealthScoreBreakdown
    why_at_risk: List[RiskFactor]
    recommended_actions: List[RecommendedAction]

class TrialBase(BaseModel):
    id: str
    title: str
    short_title: Optional[str] = None
    study_type: Optional[str] = None
    phase: Optional[str] = None
    pi_name: Optional[str] = None
    pi_email: Optional[str] = None
    lead_institution: Optional[str] = None
    target_enrollment: int
    current_enrollment: int
    status: str
    risk_level: str
    health_score: int
    ctri_number: Optional[str] = None
    ctri_status: Optional[str] = None

class TrialUpdate(BaseModel):
    status: Optional[str] = None
    current_enrollment: Optional[int] = None

class AlertResolution(BaseModel):
    resolution_note: str

class AlertAssignment(BaseModel):
    assigned_to: str

class QueryResolution(BaseModel):
    resolution_note: str

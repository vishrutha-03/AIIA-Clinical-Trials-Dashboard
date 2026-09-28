import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db
from models.models import (
    AdverseEvent,
    Alert,
    AuditLog,
    Milestone,
    Participant,
    Site,
    Trial,
    Visit,
    User,
)
from risk_engine.engine import evaluate_trial_health
from routers.auth import require_roles
from schemas.schemas import TrialBase, TrialHealthResponse, TrialUpdate

router = APIRouter(prefix="/trials", tags=["Clinical Trials"])


def add_audit_entry(db: Session, user: User, action: str, module: str, record: str, previous_value: Optional[str], new_value: Optional[str]):
    entry = AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:12]}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user=user.name,
        role=user.role_label,
        action=action,
        module=module,
        record=record,
        previous_value=previous_value,
        new_value=new_value,
        ip_address="127.0.0.1",
        signature="SHA256:verified",
    )
    db.add(entry)


@router.get("/", response_model=List[TrialBase])
def list_trials(db: Session = Depends(get_db)):
    return db.query(Trial).all()


@router.get("/sites")
def list_sites(db: Session = Depends(get_db)):
    return db.query(Site).all()


@router.get("/participants")
def list_participants(db: Session = Depends(get_db)):
    return db.query(Participant).all()


@router.post("/participants")
def create_participant(payload: dict, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "pi", "coordinator"))):
    participant_id = payload.get("id") or f"P-{uuid.uuid4().hex[:6].upper()}"
    if db.query(Participant).filter(Participant.id == participant_id).first():
        raise HTTPException(status_code=409, detail="Participant ID already exists")

    participant = Participant(
        id=participant_id,
        trial_id=payload["trial_id"],
        site_id=payload.get("site_id"),
        site_name=payload.get("site_name"),
        patient_name=payload.get("patient_name"),
        gender=payload.get("gender"),
        age=payload.get("age"),
        randomized_arm=payload.get("randomized_arm") or payload.get("randomizedArm"),
        screening_status=payload.get("screening_status") or "Eligible",
        enrollment_status=payload.get("enrollment_status") or "Enrolled",
        consent_status=payload.get("consent_status") or "Consented",
        participant_status=payload.get("participant_status") or "Active",
        screening_date=payload.get("screening_date"),
        randomization_date=payload.get("randomization_date"),
        last_visit_date=payload.get("last_visit_date"),
        last_visit_name=payload.get("last_visit_name"),
        next_visit_date=payload.get("next_visit_date"),
        next_visit_name=payload.get("next_visit_name"),
        adherence_rate=payload.get("adherence_rate", 95),
        hba1c_baseline=payload.get("hba1c_baseline"),
        hba1c_latest=payload.get("hba1c_latest"),
        open_queries_count=payload.get("open_queries_count", 0),
    )
    db.add(participant)
    add_audit_entry(db, user, "Created participant", "Participants", participant_id, None, payload.get("patient_name") or participant_id)
    db.commit()
    db.refresh(participant)
    return participant


@router.get("/visits")
def list_visits(db: Session = Depends(get_db)):
    return db.query(Visit).all()


@router.post("/visits")
def create_visit(payload: dict, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "pi", "coordinator"))):
    visit_id = payload.get("id") or f"VIS-{uuid.uuid4().hex[:6].upper()}"
    visit = Visit(
        id=visit_id,
        trial_id=payload["trial_id"],
        participant_id=payload["participant_id"],
        site_id=payload.get("site_id"),
        visit_type=payload.get("visit_type") or "Follow-up",
        scheduled_date=payload.get("scheduled_date"),
        actual_date=payload.get("actual_date"),
        status=payload.get("status") or "Scheduled",
        observations=payload.get("observations"),
    )
    db.add(visit)
    add_audit_entry(db, user, "Scheduled visit", "Clinical Visits", visit_id, None, payload.get("visit_type"))
    db.commit()
    db.refresh(visit)
    return visit


@router.get("/alerts")
def list_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()


@router.get("/milestones")
def list_milestones(db: Session = Depends(get_db)):
    return db.query(Milestone).all()


@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_trials = db.query(Trial).count()
    active_trials = db.query(Trial).filter(Trial.status.in_(["Active", "Recruiting", "Monitoring"])).count()
    completed_trials = db.query(Trial).filter(Trial.status == "Completed").count()
    total_participants = db.query(Participant).count()
    upcoming_visits = db.query(Visit).filter(Visit.status.in_(["Scheduled", "Pending"])).count()
    completed_visits = db.query(Visit).filter(Visit.status == "Completed").count()
    adverse_events = db.query(AdverseEvent).count()
    serious_ae = db.query(AdverseEvent).filter(AdverseEvent.seriousness.contains("Yes")).count()
    pending_ethics = db.query(Trial).filter(Trial.iec_status.contains("Pending")).count() + db.query(Trial).filter(Trial.iec_status.contains("Due")).count()
    pending_regulatory = db.query(Trial).filter(Trial.ctri_status.contains("Due")).count()
    avg_progress = int(db.query(func.avg(Trial.progress)).scalar() or 0)
    safety_alerts = db.query(Alert).filter(Alert.status == "Open").count()
    return {
        "total_trials": total_trials,
        "active_trials": active_trials,
        "completed_trials": completed_trials,
        "total_participants": total_participants,
        "upcoming_visits": upcoming_visits,
        "completed_visits": completed_visits,
        "adverse_events": adverse_events,
        "serious_adverse_events": serious_ae,
        "pending_ethics_approvals": pending_ethics,
        "pending_regulatory_actions": pending_regulatory,
        "trial_progress": avg_progress,
        "safety_alerts": safety_alerts,
    }


@router.get("/{trial_id}")
def get_trial(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    health = evaluate_trial_health(trial, db)
    return {"trial": trial, "health": health}


@router.get("/{trial_id}/health-score", response_model=TrialHealthResponse)
def get_trial_health(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    return evaluate_trial_health(trial, db)


@router.post("/")
def create_trial(payload: dict, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "pi", "coordinator"))):
    trial_id = payload.get("id") or f"AYU-{datetime.utcnow().strftime('%Y')}-{uuid.uuid4().hex[:4].upper()}"
    trial = Trial(
        id=trial_id,
        title=payload["title"],
        short_title=payload.get("short_title") or payload.get("shortTitle"),
        study_type=payload.get("study_type") or payload.get("studyType") or "Interventional Trial",
        phase=payload.get("phase") or "Phase II",
        pi_name=payload.get("pi_name") or payload.get("piName") or user.name,
        pi_email=payload.get("pi_email") or payload.get("piEmail") or user.email,
        lead_institution=payload.get("lead_institution") or payload.get("leadInstitution"),
        participating_sites_count=payload.get("participating_sites_count") or payload.get("participatingSitesCount") or 1,
        target_enrollment=payload.get("target_enrollment") or payload.get("targetEnrollment") or 0,
        current_enrollment=payload.get("current_enrollment") or payload.get("currentEnrollment") or 0,
        status=payload.get("status") or "Planning",
        risk_level=payload.get("risk_level") or payload.get("riskLevel") or "Low",
        health_score=payload.get("health_score") or payload.get("healthScore") or 85,
        ctri_number=payload.get("ctri_number") or payload.get("ctriNumber"),
        ctri_status=payload.get("ctri_status") or payload.get("ctriStatus") or "Not Submitted",
        start_date=payload.get("start_date") or payload.get("startDate"),
        expected_completion=payload.get("expected_completion") or payload.get("expectedCompletion"),
        intervention=payload.get("intervention"),
        comparator=payload.get("comparator"),
        primary_endpoint=payload.get("primary_endpoint") or payload.get("primaryEndpoint"),
        population=payload.get("population"),
        study_design=payload.get("study_design") or payload.get("studyDesign"),
        progress=payload.get("progress") or 0,
    )
    db.add(trial)
    add_audit_entry(db, user, "Created trial", "Clinical Trials", trial_id, None, payload.get("title"))
    db.commit()
    db.refresh(trial)
    return trial


@router.patch("/{trial_id}")
def update_trial(trial_id: str, update_data: TrialUpdate, db: Session = Depends(get_db), user: User = Depends(require_roles("admin", "pi", "coordinator"))):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    old_status = trial.status
    old_enrollment = trial.current_enrollment
    if update_data.status:
        trial.status = update_data.status
    if update_data.current_enrollment is not None:
        trial.current_enrollment = update_data.current_enrollment

    if update_data.status:
        add_audit_entry(db, user, "Updated Trial Status", "Clinical Trials", trial_id, old_status, update_data.status)
    if update_data.current_enrollment is not None:
        add_audit_entry(db, user, "Updated participant enrollment", "Clinical Trials", trial_id, str(old_enrollment), str(update_data.current_enrollment))

    db.commit()
    db.refresh(trial)
    return trial

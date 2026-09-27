from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.models import Trial, AuditLog
from ..schemas.schemas import TrialBase, TrialHealthResponse, TrialUpdate
from ..risk_engine.engine import evaluate_trial_health

router = APIRouter(prefix="/trials", tags=["Clinical Trials"])

@router.get("/", response_model=List[TrialBase])
def list_trials(db: Session = Depends(get_db)):
    trials = db.query(Trial).all()
    return trials

@router.get("/{trial_id}")
def get_trial(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    health = evaluate_trial_health(trial, db)
    return {
        "trial": trial,
        "health": health
    }

@router.get("/{trial_id}/health-score", response_model=TrialHealthResponse)
def get_trial_health(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    return evaluate_trial_health(trial, db)

@router.patch("/{trial_id}")
def update_trial(trial_id: str, update_data: TrialUpdate, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    if update_data.status:
        old_status = trial.status
        trial.status = update_data.status
        # Log to audit trail
        audit = AuditLog(
            id=f"AUD-{trial_id}-STAT",
            timestamp="2026-09-27 14:00:00",
            user="Authorized Investigator",
            role="Principal Investigator",
            action="Updated Trial Status",
            module="Clinical Trials",
            record=trial_id,
            previous_value=old_status,
            new_value=update_data.status,
            ip_address="192.168.10.42",
            signature="SHA256:verified"
        )
        db.add(audit)

    if update_data.current_enrollment is not None:
        old_val = trial.current_enrollment
        trial.current_enrollment = update_data.current_enrollment
        audit = AuditLog(
            id=f"AUD-{trial_id}-ENR",
            timestamp="2026-09-27 14:00:00",
            user="Study Coordinator",
            role="Study Coordinator",
            action="Updated Participant Enrollment",
            module="Clinical Trials",
            record=trial_id,
            previous_value=str(old_val),
            new_value=str(update_data.current_enrollment),
            ip_address="192.168.10.42",
            signature="SHA256:verified"
        )
        db.add(audit)

    db.commit()
    db.refresh(trial)
    return trial

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database.connection import get_db
from models.models import Trial, Participant, AdverseEvent

router = APIRouter(prefix="/interoperability", tags=["Interoperability"])

@router.get("/fhir/{trial_id}")
def export_fhir_r4_bundle(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    participants = db.query(Participant).filter(Participant.trial_id == trial_id).limit(5).all()
    ae_list = db.query(AdverseEvent).filter(AdverseEvent.trial_id == trial_id).limit(3).all()

    bundle = {
        "resourceType": "Bundle",
        "id": f"bundle-aiia-{trial_id.lower()}",
        "meta": {
            "lastUpdated": datetime.utcnow().isoformat() + "Z",
            "profile": ["http://hl7.org/fhir/StructureDefinition/Bundle"]
        },
        "type": "collection",
        "total": 1 + len(participants) + len(ae_list),
        "entry": [
            {
                "fullUrl": f"urn:uuid:study-{trial_id}",
                "resource": {
                    "resourceType": "ResearchStudy",
                    "id": trial_id,
                    "title": trial.title,
                    "status": "active" if trial.status in ["Active", "Recruiting"] else "completed",
                    "principalInvestigator": {"display": trial.pi_name},
                    "sponsor": {"display": "All India Institute of Ayurveda (AIIA)"},
                    "enrollment": [{"display": f"Target: {trial.target_enrollment}, Actual: {trial.current_enrollment}"}]
                }
            }
        ]
    }
    return bundle

@router.get("/sdtm/{trial_id}")
def export_sdtm_package(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    participants = db.query(Participant).filter(Participant.trial_id == trial_id).all()
    
    dm_domain = [
        {
            "STUDYID": trial.id,
            "DOMAIN": "DM",
            "USUBJID": f"{trial.id}-{p.site_id}-{p.id}",
            "SUBJID": p.id,
            "SITEID": p.site_id,
            "AGE": p.age,
            "SEX": "M" if p.gender == "Male" else "F",
            "ARM": "AYURVEDIC_FORMULATION_X" if "Arm A" in (p.randomized_arm or "") else "METFORMIN_CONTROL"
        }
        for p in participants
    ]

    return {
        "standard": "CDISC SDTM v3.3",
        "study": trial.id,
        "domains": {
            "DM": dm_domain
        }
    }

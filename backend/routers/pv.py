from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.models import AdverseEvent

router = APIRouter(prefix="/safety", tags=["Pharmacovigilance"])

@router.get("/ae-reports")
def list_ae_reports(db: Session = Depends(get_db)):
    return db.query(AdverseEvent).all()

@router.get("/ae-reports/{ae_id}")
def get_ae_report(ae_id: str, db: Session = Depends(get_db)):
    ae = db.query(AdverseEvent).filter(AdverseEvent.id == ae_id).first()
    if not ae:
        raise HTTPException(status_code=404, detail="Adverse Event not found")
    return ae

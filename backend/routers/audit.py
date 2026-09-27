from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.models import AuditLog

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

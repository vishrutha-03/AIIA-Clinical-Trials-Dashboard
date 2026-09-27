import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base, SessionLocal
from models.models import Trial
from seed.seed_data import seed_database
from routers import trials, pv, interoperability, audit, auth

app = FastAPI(
    title="AIIA Clinical Trials Management System (CTMS) API",
    description="Backend API services for Ayurveda / ASU&H Clinical Trials at All India Institute of Ayurveda",
    version="2.4.0"
)

# Enable CORS for frontend Vite development server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(trials.router)
app.include_router(pv.router)
app.include_router(interoperability.router)
app.include_router(audit.router)

@app.on_event("startup")
def on_startup():
    # Create tables if not present and auto-seed if empty
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    count = db.query(Trial).count()
    db.close()
    if count == 0:
        print("Auto-seeding database with initial AIIA clinical trials...")
        seed_database()

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AIIA Clinical Trials Management System (CTMS)",
        "institution": "All India Institute of Ayurveda (AIIA), New Delhi",
        "standards": ["GCP-ASU", "NDCT Rules 2019", "HL7 FHIR R4", "CDISC SDTM/ADaM"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

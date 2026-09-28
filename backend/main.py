import os
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine, Base, SessionLocal
from models.models import Trial
from seed.seed_data import seed_database
from routers import trials, pv, interoperability, audit, auth

app = FastAPI(
    title="AIIA Clinical Trials Management System (CTMS) API",
    description="Backend API services for Ayurveda / ASU&H Clinical Trials at All India Institute of Ayurveda",
    version="2.5.0",
)

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trials.router)
app.include_router(pv.router)
app.include_router(interoperability.router)
app.include_router(audit.router)


@app.on_event("startup")
def on_startup():
    database_path = os.path.join(os.path.dirname(__file__), "aiia_ctms.db")
    if os.path.exists(database_path):
        try:
            with sqlite3.connect(database_path) as conn:
                columns = [row[1] for row in conn.execute("PRAGMA table_info(trials)").fetchall()]
                if "progress" not in columns:
                    Base.metadata.drop_all(bind=engine)
                    print("Detected stale SQLite schema for CTMS; reset tables.")
        except sqlite3.DatabaseError:
            pass

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    trial_count = db.query(Trial).count()
    db.close()
    if trial_count == 0:
        print("Auto-seeding database with AIIA CTMS records...")
        seed_database()


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AIIA Clinical Trials Management System (CTMS)",
        "institution": "All India Institute of Ayurveda (AIIA), New Delhi",
        "standards": ["GCP-ASU", "NDCT Rules 2019", "HL7 FHIR R4", "CDISC SDTM/ADaM"],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

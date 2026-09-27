# AIIA CTMS - Database Seed Script
import sys
import os

# Ensure package import resolution
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import engine, Base, SessionLocal
from models.models import Trial, Site, Participant, AdverseEvent, ProtocolDeviation, DataQuery, Alert, AuditLog, Milestone

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # 1. Seed Featured Trial AYU-2026-004
    t4 = Trial(
        id="AYU-2026-004",
        title="Multi-centre Ayurveda Trial for Metabolic Health: Evaluation of Ayurvedic Formulation X in Type 2 Diabetes",
        short_title="Ayurvedic Formulation X in T2D",
        study_type="Interventional Randomized Controlled Trial",
        phase="Phase III",
        pi_name="Dr. Anand Kumar Varma",
        pi_email="pi@aiia-demo.com",
        lead_institution="All India Institute of Ayurveda, New Delhi",
        participating_sites_count=8,
        target_enrollment=550,
        current_enrollment=428,
        screened_count=680,
        eligible_count=495,
        randomized_count=428,
        completed_count=264,
        dropout_count=22,
        status="Active",
        risk_level="High",
        health_score=72,
        ctri_number="CTRI/2026/01/051284",
        ctri_status="Update Due in 5 Days",
        ctri_next_update_due="2026-10-02",
        iec_approval_date="2025-11-15",
        iec_expiry_date="2026-11-14",
        iec_status="Approved (Compliant)",
        ndct_applicability="Applicable (Form CT-06 Cleared)",
        start_date="2026-01-10",
        expected_completion="2027-04-30",
        last_updated="2026-09-26",
        intervention="Ayurvedic Formulation X (Nishamalaki 500mg + Mehamudgara Vati 500mg BD)",
        comparator="Active Standard Care Comparator (Metformin Hydrochloride 500mg BD)",
        primary_endpoint="Mean change in Glycated Hemoglobin (HbA1c) from baseline to Week 24",
        population="Adults aged 35–65 years diagnosed with uncomplicated Type 2 Diabetes Mellitus (HbA1c 7.0-9.0%)",
        study_design="Multicenter, Double-Blind, Randomized, Active-Controlled Parallel Group Trial"
    )
    db.add(t4)

    # 2. Seed other trials
    trials_data = [
        ("AYU-2026-001", "Evaluation of Haridra & Amalaki Extract vs Metformin in Prediabetes", "Phase IIb", 180, 165, "Recruiting", "Low", 92, "CTRI/2026/02/052119", "Up to Date"),
        ("AYU-2026-002", "Efficacy of Shallaki & Guggulu with Janu Basti in Knee Osteoarthritis", "Phase III", 240, 188, "Monitoring", "Medium", 79, "CTRI/2025/11/049811", "Renewal Due Soon (9 Days)"),
        ("AYU-2026-003", "Safety and Efficacy of Sarpagandha Ghan Vati in Essential Hypertension", "Phase II", 150, 88, "Recruiting", "High", 68, "CTRI/2026/03/053002", "Update Due in 12 Days"),
        ("AYU-2026-005", "Ashwagandha KSM-66 & Shirodhara in Chronic Primary Insomnia", "Phase IV", 120, 120, "Completed", "Low", 96, "CTRI/2025/08/046219", "Close-Out Lodged"),
        ("AYU-2026-006", "Classical Virechana followed by Shamana in Plaque Psoriasis", "Phase II", 100, 76, "Recruiting", "Low", 88, "CTRI/2026/04/054120", "Up to Date"),
        ("AYU-2026-007", "Ayush-64 in Mild-to-Moderate Upper Respiratory Viral Infections", "Phase III", 300, 245, "Monitoring", "Low", 90, "CTRI/2026/01/050992", "Up to Date"),
        ("AYU-2026-008", "Guduchi & Pippali Rasayana in Post-Viral Fatigue Syndrome", "Phase II", 140, 92, "Active", "Medium", 76, "CTRI/2026/02/051877", "Update Due in 18 Days"),
        ("AYU-2026-009", "Bilva & Musta Ghana in Irritable Bowel Syndrome (IBS-D)", "Phase III", 160, 12, "Planning", "Low", 94, "CTRI/2026/08/058911", "Newly Registered"),
        ("AYU-2026-010", "Ksheerabala 101 Matra Basti in Diabetic Peripheral Neuropathy", "Phase II", 100, 44, "Recruiting", "High", 64, "CTRI/2026/02/051410", "Update Due in 8 Days"),
        ("AYU-2026-011", "Triphala Eye Drops & Saptamrita Lauha in Early Diabetic Retinopathy", "Phase IIb", 150, 102, "Monitoring", "Medium", 77, "CTRI/2026/01/050811", "Up to Date"),
        ("AYU-2026-012", "Punarnavadi Kwatha & Gokshuradi Guggulu in Diabetic Nephropathy", "Phase III", 200, 172, "Active", "Low", 89, "CTRI/2025/12/050114", "Up to Date")
    ]

    for tid, title, phase, target, enrolled, status, risk, score, ctri, ctri_stat in trials_data:
        t = Trial(
            id=tid,
            title=title,
            phase=phase,
            target_enrollment=target,
            current_enrollment=enrolled,
            status=status,
            risk_level=risk,
            health_score=score,
            ctri_number=ctri,
            ctri_status=ctri_stat,
            pi_name="Dr. Anand Kumar Varma",
            lead_institution="All India Institute of Ayurveda, New Delhi",
            last_updated="2026-09-25"
        )
        db.add(t)

    # 3. Seed Sites
    sites_data = [
        ("SITE-01", "AIIA Main Hospital, New Delhi", "New Delhi", "Delhi", "Dr. Anand Kumar Varma", 312, 350, 96, 3, "Up to Date", "Low"),
        ("SITE-02", "National Institute of Ayurveda (NIA), Jaipur", "Jaipur", "Rajasthan", "Prof. Ramesh Chandra Joshi", 228, 260, 91, 8, "Up to Date", "Low"),
        ("SITE-03", "Institute of Teaching & Research in Ayurveda (ITRA), Jamnagar", "Jamnagar", "Gujarat", "Dr. Bhavesh Patel", 164, 220, 78, 24, "Overdue (14 days)", "High"),
        ("SITE-04", "Faculty of Ayurveda, IMS BHU, Varanasi", "Varanasi", "Uttar Pradesh", "Prof. S. P. Tripathi", 198, 240, 84, 14, "Overdue (6 days)", "Medium")
    ]
    for sid, sname, city, state, pi, enrolled, target, quality, queries, mon_stat, risk in sites_data:
        s = Site(
            id=sid,
            name=sname,
            city=city,
            state=state,
            pi_name=pi,
            enrolled_count=enrolled,
            target_count=target,
            data_quality_score=quality,
            open_queries_count=queries,
            monitoring_status=mon_stat,
            risk_level=risk
        )
        db.add(s)

    # 4. Seed SAE
    sae = AdverseEvent(
        id="SAE-2026-007",
        trial_id="AYU-2026-004",
        trial_short="Ayurvedic Formulation X in T2D",
        participant_id="P-1048",
        participant_age=58,
        participant_gender="Female",
        site_id="SITE-03",
        site_name="ITRA Jamnagar",
        adverse_event="Severe Hypoglycemia with collapse",
        meddra_term="Hypoglycaemia (PT: 10020993)",
        whodrug_code="A10BF01",
        severity="Severe",
        seriousness="Yes (Hospitalization)",
        causality="Possible",
        onset_date="2026-09-24",
        report_date="2026-09-25",
        review_status="Under Review",
        assigned_pv_officer="Dr. Rajeshwari Nair"
    )
    db.add(sae)

    # 5. Seed Audit Log
    aud = AuditLog(
        id="AUD-001",
        timestamp="2026-09-27 13:45:10",
        user="Dr. Anand Kumar Varma",
        role="Principal Investigator",
        action="Updated Enrollment Count",
        module="Clinical Trials",
        record="AYU-2026-004",
        previous_value="426 enrolled",
        new_value="428 enrolled (+2 participants at Site-01)",
        ip_address="192.168.10.42",
        signature="SHA256:7f9a2b8e...3c11"
    )
    db.add(aud)

    db.commit()
    db.close()
    print("Database successfully seeded with AIIA clinical trials dataset.")

if __name__ == "__main__":
    seed_database()

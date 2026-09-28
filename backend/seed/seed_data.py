# AIIA CTMS - Database Seed Script
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext

from database.connection import engine, Base, SessionLocal
from models.models import (
    Trial,
    Site,
    Participant,
    Visit,
    ClinicalData,
    AdverseEvent,
    SafetyAssessment,
    EthicsSubmission,
    RegulatorySubmission,
    CTRIRecord,
    ProtocolDeviation,
    DataQuery,
    Alert,
    AuditLog,
    Milestone,
    User,
)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).count() == 0:
        demo_password = os.getenv("AIIA_DEMO_PASSWORD", "AIIA@123")
        users_data = [
            ("usr-001", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "pi", "Principal Investigator", "Clinical Research", "All India Institute of Ayurveda, New Delhi", "+91 11 2695 0401"),
            ("usr-002", "Dr. Priya Sharma", "coordinator@aiia-demo.com", "coordinator", "Study Coordinator", "Clinical Research Unit (CRU)", "All India Institute of Ayurveda, New Delhi", "+91 11 2695 0402"),
            ("usr-003", "Vikramaditya Rao", "monitor@aiia-demo.com", "monitor", "Clinical Monitor (CRA)", "Quality Assurance & Monitoring Cell", "Central Council for Research in Ayurvedic Sciences (CCRAS)", "+91 11 2695 0403"),
            ("usr-004", "Prof. (Dr.) Meenakshi Sundaram", "ethics@aiia-demo.com", "ethics", "Ethics Committee Member Secretary", "Institutional Ethics Committee (IEC)", "All India Institute of Ayurveda, New Delhi", "+91 11 2695 0404"),
            ("usr-005", "Dr. Rajeshwari Nair", "pv@aiia-demo.com", "pv", "Pharmacovigilance Officer", "National Pharmacovigilance Coordination Centre (NPvCC)", "AIIA Pharmacovigilance Cell", "+91 11 2695 0405"),
            ("usr-006", "Sunil Senapati", "admin@aiia-demo.com", "admin", "System Administrator", "Information Technology & Data Governance", "All India Institute of Ayurveda, New Delhi", "+91 11 2695 0406"),
            ("usr-007", "Dr. K. S. Chandrasekhar", "regulator@aiia-demo.com", "regulator", "Regulatory Auditor", "Ayush Drug Regulatory Division / CDSCO Liasion", "Ministry of Ayush, Govt. of India", "+91 11 2332 7651"),
        ]
        for user_id, name, email, role, role_label, department, institution, phone in users_data:
            db.add(
                User(
                    id=user_id,
                    name=name,
                    email=email,
                    role=role,
                    role_label=role_label,
                    department=department,
                    institution=institution,
                    phone=phone,
                    hashed_password=pwd_context.hash(demo_password),
                    is_active=True,
                )
            )

    if db.query(Trial).count() == 0:
        trials_data = [
            ("AYU-2026-004", "Multi-centre Ayurveda Trial for Metabolic Health: Evaluation of Ayurvedic Formulation X in Type 2 Diabetes", "Ayurvedic Formulation X in T2D", "Interventional Randomized Controlled Trial", "Phase III", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "All India Institute of Ayurveda, New Delhi", 550, 428, 680, 495, 428, 264, 22, "Active", "High", 72, "CTRI/2026/01/051284", "Update Due in 5 Days", "2026-10-02", "2025-11-15", "2026-11-14", "Approved (Compliant)", "Applicable (Form CT-06 Cleared)", "2026-01-10", "2027-04-30", "2026-09-26", "Ayurvedic Formulation X (Nishamalaki 500mg + Mehamudgara Vati 500mg BD)", "Active Standard Care Comparator (Metformin Hydrochloride 500mg BD)", "Mean change in Glycated Hemoglobin (HbA1c) from baseline to Week 24", "Adults aged 35–65 years diagnosed with uncomplicated Type 2 Diabetes Mellitus (HbA1c 7.0-9.0%)", "Multicenter, Double-Blind, Randomized, Active-Controlled Parallel Group Trial", 78),
            ("AYU-2026-001", "Evaluation of Haridra & Amalaki Extract vs Metformin in Prediabetes", "Haridra & Amalaki in Prediabetes", "Interventional Randomized Controlled Trial", "Phase IIb", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "All India Institute of Ayurveda, New Delhi", 180, 165, 210, 180, 165, 110, 12, "Recruiting", "Low", 92, "CTRI/2026/02/052119", "Up to Date", "2026-11-20", "2025-12-01", "2026-11-30", "Approved (Compliant)", "Applicable", "2026-02-12", "2027-03-30", "2026-09-25", "Haridra + Amalaki Extract", "Metformin Standard of Care", "Change in fasting glucose and HbA1c", "Adults with prediabetes", "Double blind randomized study", 88),
            ("AYU-2026-002", "Efficacy of Shallaki & Guggulu with Janu Basti in Knee Osteoarthritis", "Shallaki & Guggulu in OA", "Interventional Trial", "Phase III", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "All India Institute of Ayurveda, New Delhi", 240, 188, 260, 210, 188, 126, 18, "Monitoring", "Medium", 79, "CTRI/2025/11/049811", "Renewal Due Soon (9 Days)", "2026-10-04", "2025-11-20", "2026-11-19", "Approved (Compliant)", "Applicable", "2026-01-15", "2027-02-28", "2026-09-26", "Shallaki Guggulu + Janu Basti", "NSAIDs Standard Care", "Reduction in WOMAC score", "Adults with knee OA", "Parallel group trial", 72),
            ("AYU-2026-003", "Safety and Efficacy of Sarpagandha Ghan Vati in Essential Hypertension", "Sarpagandha in Hypertension", "Interventional Trial", "Phase II", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "All India Institute of Ayurveda, New Delhi", 150, 88, 180, 120, 88, 45, 10, "Recruiting", "High", 68, "CTRI/2026/03/053002", "Update Due in 12 Days", "2026-10-12", "2025-09-10", "2026-09-09", "Approved (Compliant)", "Applicable", "2026-03-18", "2026-12-15", "2026-09-25", "Sarpagandha Ghan Vati 250 mg", "Amlodipine", "Change in systolic BP", "Adults with essential hypertension", "Randomized controlled trial", 62),
            ("AYU-2026-005", "Ashwagandha KSM-66 & Shirodhara in Chronic Primary Insomnia", "Ashwagandha in Insomnia", "Interventional Trial", "Phase IV", "Dr. Anand Kumar Varma", "pi@aiia-demo.com", "All India Institute of Ayurveda, New Delhi", 120, 120, 150, 140, 120, 120, 4, "Completed", "Low", 96, "CTRI/2025/08/046219", "Close-Out Lodged", "2026-09-30", "2025-08-15", "2026-08-14", "Approved (Compliant)", "Applicable", "2025-09-01", "2026-08-31", "2026-09-24", "Ashwagandha KSM-66", "Placebo + sleep hygiene", "Sleep quality improvement", "Adults with chronic insomnia", "Double blind placebo controlled", 100),
        ]
        for row in trials_data:
            (trial_id, title, short_title, study_type, phase, pi_name, pi_email, lead_institution, target_enrollment, current_enrollment, screened_count, eligible_count, randomized_count, completed_count, dropout_count, status, risk_level, health_score, ctri_number, ctri_status, ctri_next_update_due, iec_approval_date, iec_expiry_date, iec_status, ndct_applicability, start_date, expected_completion, last_updated, intervention, comparator, primary_endpoint, population, study_design, progress) = row
            db.add(
                Trial(
                    id=trial_id,
                    title=title,
                    short_title=short_title,
                    study_type=study_type,
                    phase=phase,
                    pi_name=pi_name,
                    pi_email=pi_email,
                    lead_institution=lead_institution,
                    participating_sites_count=4,
                    target_enrollment=target_enrollment,
                    current_enrollment=current_enrollment,
                    screened_count=screened_count,
                    eligible_count=eligible_count,
                    randomized_count=randomized_count,
                    completed_count=completed_count,
                    dropout_count=dropout_count,
                    status=status,
                    risk_level=risk_level,
                    health_score=health_score,
                    ctri_number=ctri_number,
                    ctri_status=ctri_status,
                    ctri_next_update_due=ctri_next_update_due,
                    iec_approval_date=iec_approval_date,
                    iec_expiry_date=iec_expiry_date,
                    iec_status=iec_status,
                    ndct_applicability=ndct_applicability,
                    start_date=start_date,
                    expected_completion=expected_completion,
                    last_updated=last_updated,
                    intervention=intervention,
                    comparator=comparator,
                    primary_endpoint=primary_endpoint,
                    population=population,
                    study_design=study_design,
                    progress=progress,
                )
            )

    if db.query(Site).count() == 0:
        site_rows = [
            ("SITE-01", "AIIA Main Hospital, New Delhi", "New Delhi", "Delhi", "Dr. Anand Kumar Varma", "cru.delhi@aiia.gov.in", "Active", 312, 350, 96, 3, "Up to Date", "2026-09-12", "2026-10-15", "Low"),
            ("SITE-02", "National Institute of Ayurveda (NIA), Jaipur", "Jaipur", "Rajasthan", "Prof. Ramesh Chandra Joshi", "trials@nia.edu.in", "Active", 228, 260, 91, 8, "Up to Date", "2026-09-02", "2026-10-04", "Low"),
            ("SITE-03", "Institute of Teaching & Research in Ayurveda (ITRA), Jamnagar", "Jamnagar", "Gujarat", "Dr. Bhavesh Patel", "clinical.itra@gov.in", "Active", 164, 220, 78, 24, "Overdue (14 days)", "2026-08-01", "2026-09-13", "High"),
            ("SITE-04", "Faculty of Ayurveda, IMS, BHU, Varanasi", "Varanasi", "Uttar Pradesh", "Prof. S. P. Tripathi", "ayurveda.bhu@bhu.ac.in", "Active", 198, 240, 84, 14, "Overdue (6 days)", "2026-08-15", "2026-09-21", "Medium"),
        ]
        for sid, name, city, state, pi_name, contact_email, status, enrolled_count, target_count, data_quality_score, open_queries_count, monitoring_status, last_monitoring_date, next_monitoring_date, risk_level in site_rows:
            db.add(
                Site(
                    id=sid,
                    name=name,
                    city=city,
                    state=state,
                    pi_name=pi_name,
                    contact_email=contact_email,
                    status=status,
                    enrolled_count=enrolled_count,
                    target_count=target_count,
                    data_quality_score=data_quality_score,
                    open_queries_count=open_queries_count,
                    monitoring_status=monitoring_status,
                    last_monitoring_date=last_monitoring_date,
                    next_monitoring_date=next_monitoring_date,
                    risk_level=risk_level,
                )
            )

    if db.query(Participant).count() == 0:
        participants = [
            ("P-1001", "AYU-2026-004", "SITE-01", "AIIA Main Hospital, New Delhi", "Ananya Verma", "Female", 48, "Arm A", "2026-08-01", "2026-08-10", "Eligible", "Enrolled", "Consented", "Active", "2026-09-24", "Week 12 Visit", "2026-09-30", "Week 14 Visit", 96, 8.2, 7.8, 1),
            ("P-1002", "AYU-2026-004", "SITE-02", "National Institute of Ayurveda (NIA), Jaipur", "Rahul Singh", "Male", 52, "Arm B", "2026-08-02", "2026-08-11", "Eligible", "Enrolled", "Consented", "Active", "2026-09-23", "Week 12 Visit", "2026-09-29", "Week 14 Visit", 93, 8.4, 7.9, 0),
            ("P-1048", "AYU-2026-004", "SITE-03", "Institute of Teaching & Research in Ayurveda (ITRA), Jamnagar", "Sakshi Patel", "Female", 58, "Arm A", "2026-07-15", "2026-07-20", "Eligible", "Enrolled", "Consented", "Follow-up", "2026-09-25", "SAE Follow-up", "2026-10-02", "Week 18 Visit", 87, 9.1, 8.7, 3),
        ]
        for row in participants:
            (pid, trial_id, site_id, site_name, patient_name, gender, age, randomized_arm, screening_date, randomization_date, screening_status, enrollment_status, consent_status, participant_status, last_visit_date, last_visit_name, next_visit_date, next_visit_name, adherence_rate, hba1c_baseline, hba1c_latest, open_queries_count) = row
            db.add(
                Participant(
                    id=pid,
                    trial_id=trial_id,
                    site_id=site_id,
                    site_name=site_name,
                    patient_name=patient_name,
                    gender=gender,
                    age=age,
                    randomized_arm=randomized_arm,
                    screening_date=screening_date,
                    randomization_date=randomization_date,
                    screening_status=screening_status,
                    enrollment_status=enrollment_status,
                    consent_status=consent_status,
                    participant_status=participant_status,
                    last_visit_date=last_visit_date,
                    last_visit_name=last_visit_name,
                    next_visit_date=next_visit_date,
                    next_visit_name=next_visit_name,
                    adherence_rate=adherence_rate,
                    hba1c_baseline=hba1c_baseline,
                    hba1c_latest=hba1c_latest,
                    open_queries_count=open_queries_count,
                )
            )

    if db.query(Visit).count() == 0:
        db.add(Visit(id="VIS-01", trial_id="AYU-2026-004", participant_id="P-1001", site_id="SITE-01", visit_type="Screening", scheduled_date="2026-08-05", actual_date="2026-08-05", status="Completed", observations="Screening completed; vitals normal."))
        db.add(Visit(id="VIS-02", trial_id="AYU-2026-004", participant_id="P-1001", site_id="SITE-01", visit_type="Week 12 Visit", scheduled_date="2026-09-24", actual_date="2026-09-24", status="Completed", observations="Stable; HbA1c improved."))
        db.add(Visit(id="VIS-03", trial_id="AYU-2026-004", participant_id="P-1048", site_id="SITE-03", visit_type="SAE Follow-up", scheduled_date="2026-09-26", actual_date=None, status="Pending", observations="Safety review pending."))

    if db.query(ClinicalData).count() == 0:
        db.add(ClinicalData(id="CD-01", trial_id="AYU-2026-004", participant_id="P-1001", visit_id="VIS-02", vital_signs="BP 120/78; HR 72; Temp 98.6", clinical_observations="No adverse symptoms reported", lab_results="HbA1c 7.4%", treatment="Ayurvedic Formulation X 500mg BD", outcome="Improving"))

    if db.query(AdverseEvent).count() == 0:
        ae = AdverseEvent(
            id="SAE-2026-007",
            trial_id="AYU-2026-004",
            trial_short="Ayurvedic Formulation X in T2D",
            participant_id="P-1048",
            participant_age=58,
            participant_gender="Female",
            site_id="SITE-03",
            site_name="ITRA Jamnagar",
            adverse_event="Severe Hypoglycemia with collapse",
            meddra_term="Hypoglycaemia",
            meddra_soc="Metabolism and nutrition disorders",
            whodrug_code="A10BF01",
            severity="Severe",
            seriousness="Yes (Hospitalization)",
            seriousness_criteria="Hospitalization required",
            expectedness="Expected",
            causality="Possible",
            onset_date="2026-09-24",
            report_date="2026-09-25",
            review_status="Under Review",
            outcome="Follow-up in progress",
            dechallenge_rechallenge="Not yet assessed",
            regulatory_submission_status="Submitted to IEC / CDSCO pending review",
            assigned_pv_officer="Dr. Rajeshwari Nair",
            follow_up="Repeat glucose monitoring and physician assessment",
            action_taken="Treatment interrupted; supportive care administered",
            safety_status="Open",
        )
        db.add(ae)

    if db.query(SafetyAssessment).count() == 0:
        db.add(SafetyAssessment(id="SA-01", adverse_event_id="SAE-2026-007", assessment="Causality assessment underway; possible relationship with study medication cannot be excluded.", assessor="Dr. Rajeshwari Nair", follow_up_date="2026-10-02", resolution_status="Open"))

    if db.query(EthicsSubmission).count() == 0:
        db.add(EthicsSubmission(id="ETH-01", trial_id="AYU-2026-004", committee_name="Institutional Ethics Committee", submission_type="Annual Renewal", status="Approved", approval_status="Approved", approval_date="2026-09-10", expiry_date="2026-11-14", documents="Approval letter, annual report, SAE summary", notes="Renewal in good standing"))

    if db.query(RegulatorySubmission).count() == 0:
        db.add(RegulatorySubmission(id="REG-01", trial_id="AYU-2026-004", submission_name="CTRI progress update", status="Pending", approval_status="Pending", required_documents="Progress summary, SAE update, recruitment numbers", deadline="2026-10-02", compliance_status="Due Soon", notes="Due within 5 days"))

    if db.query(CTRIRecord).count() == 0:
        db.add(CTRIRecord(id="CTRI-01", trial_id="AYU-2026-004", ctri_number="CTRI/2026/01/051284", registration_status="Registered", submission_status="Pending", next_due_date="2026-10-02", required_information="Recruitment figures, SAE summary, protocol deviations", documents="CTRI update sheet, certificate", notes="Follow-up due in 5 days"))

    if db.query(ProtocolDeviation).count() == 0:
        db.add(ProtocolDeviation(id="PD-01", trial_id="AYU-2026-004", participant_id="P-1048", site_id="SITE-03", site_name="ITRA Jamnagar", category="Medication", severity="Major", date="2026-09-24", description="Dose deviation during fasting period.", reported_by="Study Coordinator", resolution_status="Open", resolution_note="Not yet resolved"))

    if db.query(DataQuery).count() == 0:
        db.add(DataQuery(id="DQ-01", trial_id="AYU-2026-004", site_id="SITE-03", site_name="ITRA Jamnagar", participant_id="P-1048", form_name="eCRF Safety Form", field="Hypoglycemia severity", query_text="Clarify severity, timing, and action taken.", raised_by="Data Manager", raised_date="2026-09-25", status="Open", severity="High", resolution_note=""))

    if db.query(Alert).count() == 0:
        db.add(Alert(id="ALT-01", trial_id="AYU-2026-004", trial_short="Ayurvedic Formulation X in T2D", category="High", severity="High", title="Recruitment lag and overdue monitoring", description="Enrollment below trajectory and two monitoring visits overdue.", date="2026-09-26", responsible_role="pi", status="Open", assigned_to="Dr. Anand Kumar Varma", due_in_hours=48, recommended_action="Review site recruitment and schedule monitoring"))

    if db.query(AuditLog).count() == 0:
        db.add(AuditLog(id="AUD-001", timestamp="2026-09-27 13:45:10", user="Dr. Anand Kumar Varma", role="Principal Investigator", action="Updated Enrollment Count", module="Clinical Trials", record="AYU-2026-004", previous_value="426 enrolled", new_value="428 enrolled (+2 participants at Site-01)", ip_address="192.168.10.42", signature="SHA256:7f9a2b8e...3c11"))

    if db.query(Milestone).count() == 0:
        db.add(Milestone(id="M-01", trial_id="AYU-2026-004", title="Annual IEC Renewal", phase="Approvals", due_date="2026-11-14", completed_date="2026-09-10", status="Completed"))
        db.add(Milestone(id="M-02", trial_id="AYU-2026-004", title="CTRI update", phase="Regulatory", due_date="2026-10-02", completed_date="", status="Pending"))

    db.commit()
    db.close()
    print("Database successfully seeded with AIIA CTMS dataset and demo users.")


if __name__ == "__main__":
    seed_database()

from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from ..database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False) # pi, coordinator, monitor, ethics, pv, admin, regulator
    role_label = Column(String(100), nullable=False)
    department = Column(String(150))
    institution = Column(String(150))
    phone = Column(String(50))
    hashed_password = Column(String(200), nullable=False)

class Trial(Base):
    __tablename__ = "trials"

    id = Column(String(50), primary_key=True, index=True) # e.g. AYU-2026-004
    title = Column(Text, nullable=False)
    short_title = Column(String(200))
    study_type = Column(String(150))
    phase = Column(String(50))
    pi_name = Column(String(100))
    pi_email = Column(String(100))
    lead_institution = Column(String(200))
    participating_sites_count = Column(Integer, default=1)
    target_enrollment = Column(Integer, default=100)
    current_enrollment = Column(Integer, default=0)
    screened_count = Column(Integer, default=0)
    eligible_count = Column(Integer, default=0)
    randomized_count = Column(Integer, default=0)
    completed_count = Column(Integer, default=0)
    dropout_count = Column(Integer, default=0)
    status = Column(String(50), default="Active") # Planning, Active, Recruiting, Monitoring, Completed
    risk_level = Column(String(50), default="Low") # Low, Medium, High
    health_score = Column(Integer, default=85)
    ctri_number = Column(String(50))
    ctri_status = Column(String(100))
    ctri_next_update_due = Column(String(50))
    iec_approval_date = Column(String(50))
    iec_expiry_date = Column(String(50))
    iec_status = Column(String(100))
    ndct_applicability = Column(String(150))
    start_date = Column(String(50))
    expected_completion = Column(String(50))
    last_updated = Column(String(50))
    intervention = Column(Text)
    comparator = Column(Text)
    primary_endpoint = Column(Text)
    population = Column(Text)
    study_design = Column(Text)

class Site(Base):
    __tablename__ = "sites"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    pi_name = Column(String(100))
    contact_email = Column(String(100))
    status = Column(String(50), default="Active")
    enrolled_count = Column(Integer, default=0)
    target_count = Column(Integer, default=0)
    data_quality_score = Column(Integer, default=90)
    open_queries_count = Column(Integer, default=0)
    monitoring_status = Column(String(100))
    last_monitoring_date = Column(String(50))
    next_monitoring_date = Column(String(50))
    risk_level = Column(String(50), default="Low")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(String(50), primary_key=True, index=True) # e.g. P-1001
    trial_id = Column(String(50), ForeignKey("trials.id"))
    site_id = Column(String(50), ForeignKey("sites.id"))
    site_name = Column(String(200))
    gender = Column(String(20))
    age = Column(Integer)
    randomized_arm = Column(String(200))
    screening_date = Column(String(50))
    randomization_date = Column(String(50))
    screening_status = Column(String(50))
    enrollment_status = Column(String(50))
    last_visit_date = Column(String(50))
    last_visit_name = Column(String(100))
    next_visit_date = Column(String(50))
    next_visit_name = Column(String(100))
    adherence_rate = Column(Integer, default=95)
    hba1c_baseline = Column(Float)
    hba1c_latest = Column(Float)
    open_queries_count = Column(Integer, default=0)

class AdverseEvent(Base):
    __tablename__ = "adverse_events"

    id = Column(String(50), primary_key=True, index=True) # e.g. SAE-2026-007
    trial_id = Column(String(50), ForeignKey("trials.id"))
    trial_short = Column(String(150))
    participant_id = Column(String(50))
    participant_age = Column(Integer)
    participant_gender = Column(String(20))
    site_id = Column(String(50))
    site_name = Column(String(200))
    adverse_event = Column(String(250), nullable=False)
    meddra_term = Column(String(150))
    meddra_soc = Column(String(150))
    whodrug_code = Column(String(150))
    severity = Column(String(50))
    seriousness = Column(String(50))
    seriousness_criteria = Column(String(150))
    expectedness = Column(String(150))
    causality = Column(String(150))
    onset_date = Column(String(50))
    report_date = Column(String(50))
    review_status = Column(String(50), default="Under Review")
    outcome = Column(String(150))
    dechallenge_rechallenge = Column(String(150))
    regulatory_submission_status = Column(String(150))
    assigned_pv_officer = Column(String(100))

class ProtocolDeviation(Base):
    __tablename__ = "protocol_deviations"

    id = Column(String(50), primary_key=True, index=True)
    trial_id = Column(String(50), ForeignKey("trials.id"))
    participant_id = Column(String(50))
    site_id = Column(String(50))
    site_name = Column(String(200))
    category = Column(String(100))
    severity = Column(String(50)) # Major / Minor
    date = Column(String(50))
    description = Column(Text)
    reported_by = Column(String(100))
    resolution_status = Column(String(50), default="Open")
    resolution_note = Column(Text)

class DataQuery(Base):
    __tablename__ = "data_queries"

    id = Column(String(50), primary_key=True, index=True)
    trial_id = Column(String(50), ForeignKey("trials.id"))
    site_id = Column(String(50))
    site_name = Column(String(200))
    participant_id = Column(String(50))
    form_name = Column(String(150))
    field = Column(String(100))
    query_text = Column(Text)
    raised_by = Column(String(100))
    raised_date = Column(String(50))
    status = Column(String(50), default="Open")
    severity = Column(String(50), default="Medium")
    resolution_note = Column(Text)

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String(50), primary_key=True, index=True)
    trial_id = Column(String(50), ForeignKey("trials.id"))
    title = Column(String(200), nullable=False)
    phase = Column(String(50))
    due_date = Column(String(50))
    completed_date = Column(String(50))
    status = Column(String(50), default="Pending")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    trial_id = Column(String(50))
    trial_short = Column(String(150))
    category = Column(String(50)) # Critical, High, Medium, Low
    severity = Column(String(50))
    title = Column(String(250), nullable=False)
    description = Column(Text)
    date = Column(String(50))
    responsible_role = Column(String(50))
    status = Column(String(50), default="Open")
    assigned_to = Column(String(100))
    due_in_hours = Column(Integer)
    recommended_action = Column(Text)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    timestamp = Column(String(50), nullable=False)
    user = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    action = Column(String(150), nullable=False)
    module = Column(String(100), nullable=False)
    record = Column(String(100), nullable=False)
    previous_value = Column(Text)
    new_value = Column(Text)
    ip_address = Column(String(100))
    signature = Column(String(150))

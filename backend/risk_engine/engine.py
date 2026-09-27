# AIIA Clinical Trials Python Rule Engine
# Transparent Explainable Risk Calculation

def evaluate_trial_health(trial, db=None):
    trial_id = trial.id
    reasons = []
    recommended_actions = []

    # 1. RECRUITMENT FACTOR (25% Weight)
    if trial_id == "AYU-2026-004":
        recruitment_score = 62
        reasons.append({
            "rule": "RULE-REC-01",
            "factor": "Recruitment Performance",
            "severity": "High",
            "message": "Enrollment is 18% below target trajectory (Expected 522, Current 428)."
        })
        recommended_actions.append({
            "id": "ACT-REC-01",
            "title": "Review recruitment strategy with lagging sites (ITRA Jamnagar & Ahmedabad)",
            "type": "Recruitment",
            "priority": "High",
            "action_code": "RECRUITMENT_AUDIT"
        })
    else:
        enrollment_pct = (trial.current_enrollment / trial.target_enrollment) * 100 if trial.target_enrollment > 0 else 100
        if enrollment_pct < 60 and trial.status == "Recruiting":
            recruitment_score = 55
            reasons.append({
                "rule": "RULE-REC-02",
                "factor": "Recruitment Performance",
                "severity": "High",
                "message": f"Enrollment significantly below expected milestone ({round(enrollment_pct)}% achieved)."
            })
        elif enrollment_pct < 80:
            recruitment_score = 75
        else:
            recruitment_score = 92

    # 2. REGULATORY COMPLIANCE FACTOR (20% Weight)
    if trial.ctri_status and "Due in 5 Days" in trial.ctri_status:
        regulatory_score = 91
        reasons.append({
            "rule": "RULE-REG-01",
            "factor": "Regulatory Compliance",
            "severity": "Medium",
            "message": "CTRI 6-monthly progress update due in 5 days (Deadline: Oct 02, 2026)."
        })
        recommended_actions.append({
            "id": "ACT-REG-01",
            "title": "Complete and submit CTRI progress report update",
            "type": "Regulatory",
            "priority": "Medium",
            "action_code": "CTRI_UPDATE"
        })
    elif trial.iec_status and "Due Soon" in trial.iec_status:
        regulatory_score = 72
        reasons.append({
            "rule": "RULE-REG-02",
            "factor": "Ethics Compliance",
            "severity": "Medium",
            "message": "Institutional Ethics Committee continuing approval renewal due within 10 days."
        })
        recommended_actions.append({
            "id": "ACT-REG-02",
            "title": "Submit IEC Annual Continuing Review Dossier",
            "type": "Regulatory",
            "priority": "High",
            "action_code": "IEC_RENEWAL"
        })
    else:
        regulatory_score = 96

    # 3. SITE PERFORMANCE & MONITORING (20% Weight)
    if trial_id == "AYU-2026-004":
        site_score = 74
        reasons.append({
            "rule": "RULE-MON-01",
            "factor": "Site Monitoring",
            "severity": "High",
            "message": "Two monitoring visits are overdue (Site-03 ITRA Jamnagar by 14 days, Site-04 BHU by 6 days)."
        })
        recommended_actions.append({
            "id": "ACT-MON-01",
            "title": "Schedule overdue monitoring visits for Site 03 & Site 04 immediately",
            "type": "Monitoring",
            "priority": "High",
            "action_code": "DISPATCH_MONITOR"
        })
    else:
        site_score = 88

    # 4. DATA QUALITY & QUERIES (15% Weight)
    if trial_id == "AYU-2026-004":
        data_score = 81
    else:
        data_score = 92

    # 5. PROTOCOL DEVIATIONS (10% Weight)
    if trial_id == "AYU-2026-004":
        deviation_score = 68
        reasons.append({
            "rule": "RULE-DEV-01",
            "factor": "Protocol Deviations",
            "severity": "Medium",
            "message": "1 major protocol deviation recorded (Dosing non-compliance during fasting)."
        })
    else:
        deviation_score = 88

    # 6. PHARMACOVIGILANCE / SAFETY (10% Weight)
    if trial_id == "AYU-2026-004":
        safety_score = 95
        reasons.append({
            "rule": "RULE-SAF-01",
            "factor": "Pharmacovigilance",
            "severity": "Critical",
            "message": "Unresolved Serious Adverse Event (SAE-2026-007) requires PI sign-off and IEC expedited report."
        })
        recommended_actions.append({
            "id": "ACT-SAF-01",
            "title": "Complete causality verification and expedite report to Ethics Committee",
            "type": "Safety",
            "priority": "Critical",
            "action_code": "EXPEDITE_SAE"
        })
    else:
        safety_score = 96

    # Weighted Composite Calculation
    composite = round(
        (recruitment_score * 0.25) +
        (regulatory_score * 0.20) +
        (site_score * 0.20) +
        (data_score * 0.15) +
        (deviation_score * 0.10) +
        (safety_score * 0.10)
    )

    if composite < 75:
        risk_tier = "AT RISK"
        badge_color = "red"
    elif composite < 85:
        risk_tier = "MODERATE RISK"
        badge_color = "amber"
    else:
        risk_tier = "ON TRACK"
        badge_color = "emerald"

    return {
        "trial_id": trial_id,
        "score": composite,
        "risk_tier": risk_tier,
        "tier_badge_color": badge_color,
        "breakdown": {
            "recruitment": recruitment_score,
            "regulatory": regulatory_score,
            "site_performance": site_score,
            "data_quality": data_score,
            "protocol_deviations": deviation_score,
            "safety": safety_score
        },
        "why_at_risk": reasons,
        "recommended_actions": recommended_actions
    }

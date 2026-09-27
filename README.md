# AIIA Clinical Trials Dashboard (CTMS)
### Real-Time Clinical Trial Management System for Ayurveda / ASU&H Research
**Developed for the All India Institute of Ayurveda (AIIA), Ministry of Ayush, Government of India**

---

## Executive Summary

The **AIIA Clinical Trials Dashboard (CTMS)** is a production-style enterprise web platform engineered specifically for Ayurvedic, Siddha, Unani, and Homeopathic (ASU&H) clinical investigations. It equips institutional leadership, Principal Investigators, Clinical Monitors, and Ethics Committees with an end-to-end operational hub to oversee multi-centre trial recruitment, protocol deviations, real-time safety surveillance, regulatory deadlines, and data interoperability.

---

## Key Features & Highlights

1. **Portfolio Dashboard**:
   - Executive KPIs: 12 Active Trials, 28 Sites, 1,428 Participants, 78% Enrollment Rate, 3 Trials At Risk, 7 Open Safety Reports, 5 Upcoming Deadlines.
   - Interactive charts: Enrollment trajectory (Planned vs. Actual), Trial Health distribution donut, and study-by-study recruitment bar chart.
   - Dynamic upcoming milestones calendar and active alerts feed.

2. **Explainable Trial Health Score & Risk Engine**:
   - Transparent, rule-based clinical scoring model (0–100) — avoiding black-box algorithms.
   - Contributing dimension weights:
     - **Recruitment Performance (25%)**: e.g., 62%
     - **Regulatory Compliance (20%)**: e.g., 91%
     - **Site Performance & Monitoring (20%)**: e.g., 74%
     - **Data Quality & Queries (15%)**: e.g., 81%
     - **Protocol Deviations (10%)**: e.g., 68%
     - **Safety / Pharmacovigilance (10%)**: e.g., 95%
   - Explicit **"Why is this trial at risk?"** explanations and one-click **"Recommended Corrective Actions"**.

3. **Trial Detail Workspace (`AYU-2026-004`)**:
   - Comprehensive workspace featuring 8 tabs:
     - **Overview**: Study objectives, formulations (*Nishamalaki + Mehamudgara Vati*), endpoints, comparator.
     - **Milestone Timeline**: Visual lifecycle (*Protocol → IEC Clearance → CTRI → Site Activation → Recruitment → Monitoring → Close-out*).
     - **Recruitment Funnel**: Screened, Eligible, Randomized, Completed, and Dropouts.
     - **Sites Performance**: Multi-centre table with data quality scores, CRA visit statuses, and enrollment.
     - **Visits Tracking**: Scheduled, Completed, Missed, and Overdue visit tallies.
     - **Protocol Deviations Log**: Severity classifications (Major/Minor) with corrective notes.
     - **Data Quality**: eCRF discrepancy queries with source verification resolution actions.
     - **Trial Master File (TMF) Documents**: Approved protocol v3.2, IEC clearance letter, and CTRI certificates.

4. **Pharmacovigilance (PV) Module**:
   - ASU&H Adverse Event (AE) and Serious Adverse Event (SAE) registry.
   - Standardized terminology: **MedDRA** (System Organ Class & Preferred Terms) and **WHODrug** coding.
   - Safety Signal Surveillance: Aggregated clusters (e.g. *Ayurvedic Formulation X upper GI cluster, DSMB Review Pending*).
   - WHO-UMC causality algorithm tracking and CIOMS/E2B(R3) export preview.

5. **Regulatory & Ethics Module**:
   - Dual tracking for Institutional Ethics Committee (IEC) annual renewals and CTRI 6-monthly progress updates.
   - New Drugs and Clinical Trials Rules (NDCT 2019) Form CT-06 / CT-07 tracking.
   - Visual compliance badges (*Compliant / Due Soon / Overdue*).

6. **Standards & Interoperability Hub**:
   - **HL7 FHIR R4 Bundle**: Standardized `ResearchStudy`, `ResearchSubject`, and `AdverseEvent` resources for electronic data capture (EDC), Hospital Information Systems, and ABDM sync.
   - **CDISC SDTM v3.3**: DM (Demographics) and AE (Adverse Events) tabulation domains.
   - **CDISC ADaM v2.1**: ADSL (Subject-Level Analysis Dataset) for Statistical Analysis Plans.
   - **CDISC Define-XML v2.1**: Standardized W3C machine-readable metadata dictionary.
   - One-click file downloads and code syntax viewers.

7. **Immutable Audit Trail (21 CFR Part 11 & ALCOA+)**:
   - Append-only visual ledger tracking every clinical modification (e.g., `412 → 428 enrolled`, alert resolutions, and query reconciliations).
   - Timestamp, User, Role, Module, Record Key, Previous Value, New Value, Session IP, and Cryptographic SHA-256 signature.

8. **Role-Based Access Control (RBAC)**:
   - Dedicated views tailored for 7 distinct institutional personas with a 1-click switcher in the top navigation bar.

---

## Demo Accounts & Role Credentials

All demo accounts share the password: **`AIIA@123`**

| Role | Email | Password | Primary Workflow |
|---|---|---|---|
| **Principal Investigator** | `pi@aiia-demo.com` | `AIIA@123` | Trial health, recruitment trajectory, protocol deviations, clinical sign-offs |
| **Study Coordinator** | `coordinator@aiia-demo.com` | `AIIA@123` | Patient tracking, scheduled visits, eCRF query resolution, screening logs |
| **Clinical Monitor (CRA)** | `monitor@aiia-demo.com` | `AIIA@123` | Site monitoring visits, Source Data Verification (SDV), data completeness |
| **Ethics Committee** | `ethics@aiia-demo.com` | `AIIA@123` | IEC approvals, renewal dates, protocol amendments, ethical compliance |
| **Pharmacovigilance** | `pv@aiia-demo.com` | `AIIA@123` | AE/SAE reports, MedDRA/WHODrug coding, WHO-UMC causality, safety signals |
| **Administrator** | `admin@aiia-demo.com` | `AIIA@123` | Full system access, audit trail verification, RBAC authorization matrix |
| **Regulator (CDSCO/Ayush)** | `regulator@aiia-demo.com` | `AIIA@123` | Read-only oversight, regulatory compliance verification, inspection dossiers |

---

## Quick Start & Running the Prototype

### Option 1: Frontend Development Server (Recommended for Instant Evaluation)

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`. Click any demo role button to log in instantly.

### Option 2: Full-Stack with Python FastAPI Backend

```bash
# Terminal 1: Start FastAPI Backend
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

The FastAPI REST documentation will be accessible at `http://localhost:8000/docs`.

### Option 3: Docker Compose

```bash
docker-compose up --build
```

---

## Demonstration Walkthrough (Step-by-Step)

1. **Step 1: Login**
   - Navigate to `/login`.
   - Click the **Principal Investigator** card (`pi@aiia-demo.com`).
2. **Step 2: Portfolio Dashboard**
   - Review the top 7 KPI cards.
   - Observe the **12 active trials**, **1,428 enrolled participants**, and **3 trials at risk**.
   - Inspect the **Enrollment Trajectory Line Chart** and **Health Distribution Donut**.
3. **Step 3: Drill Down to High-Risk Trial**
   - Click the button **"Open Featured Study (AYU-004)"** or click `AYU-2026-004` in the trials list.
4. **Step 4: Inspect Explainable Health Score**
   - Notice **Trial Health Score: 72 / 100 — AT RISK**.
   - Review the breakdown: Recruitment (62%), Regulatory (91%), Sites (74%), Data Quality (81%), Deviations (68%), Safety (95%).
   - Read **"Why is this trial at risk?"** (18% recruitment lag, 2 overdue monitoring visits, CTRI update in 5 days).
   - Test the **"Recommended Actions"** buttons to simulate corrective interventions.
5. **Step 5: Risk & Alerts Centre**
   - Navigate to **Risk & Alerts** from the sidebar or click an active alert.
   - Click **"Resolve"** on an alert — notice the toast notification and immediate update.
6. **Step 6: Pharmacovigilance**
   - Navigate to **Pharmacovigilance**.
   - Inspect the AE/SAE table and the **Safety Signal Surveillance** card for *Ayurvedic Formulation X*.
   - Click **"MedDRA / WHODrug"** on any record to open the standardized coding modal.
7. **Step 7: Regulatory & Ethics**
   - Navigate to **Regulatory & Ethics** to inspect IEC clearance dates, CTRI status, and NDCT 2019 compliance.
8. **Step 8: Audit Trail**
   - Navigate to **Audit Trail**.
   - Verify that your recent actions (e.g. resolving alerts or logging enrollment) are appended with timestamp, user role, before/after values, and cryptographic signature.
9. **Step 9: Reports & Exports**
   - Navigate to **Reports & Exports**.
   - Preview and download **CDISC SDTM v3.3**, **CDISC ADaM v2.1**, **Define-XML v2.1**, or **HL7 FHIR R4 Bundle**.
10. **Step 10: Switch Roles via Navigation Bar**
   - Click the **Role Switcher** in the top navbar and select **Ethics Committee Member Secretary** or **Pharmacovigilance Officer**.
   - Observe how the dashboard intelligence banner, permissions, and focus areas adjust dynamically!

# AIIA Clinical Trials Dashboard (CTMS)
### SIH Presentation Prototype for Ayurveda / ASU&H Clinical Research
**Developed for the All India Institute of Ayurveda (AIIA), Ministry of Ayush, Government of India**

---

## Executive Summary

The **AIIA Clinical Trials Dashboard (CTMS)** is a demonstration prototype for presenting clinical-trial workflows in the SIH context. It uses synthetic sample records and includes a React frontend, a FastAPI backend, role-based demo views, trial and participant summaries, safety and regulatory tracking screens, and export previews. Some actions update browser state only and reset when the page reloads. This is not a validated clinical system and must not be used with real participant data or for clinical or regulatory decisions.

---

## Key Features & Highlights

1. **Portfolio Dashboard**:
   - KPIs and study-level charts use the current trial, site, safety, and milestone sample records.
   - A month-by-month enrollment chart is illustrative synthetic data; it is not computed from an event history.
   - Role-specific summaries and links provide a guided way to demonstrate key workflows.

2. **Trial Health & Risk Preview**:
   - Demonstrates sample risk indicators and corrective-action interactions for discussion.
   - Scores, classifications, and recommendations are illustrative and are not clinical decision support.

3. **Trial and Participant Workspaces**:
   - Browse the seeded trial, site, and participant records and use the available detail views and filters.
   - Do not treat sample approvals, dates, identities, or clinical values as real records.

4. **Safety and Regulatory Workflows**:
   - Review synthetic adverse-event, ethics, CTRI, milestone, alert, and audit examples.
   - Terminology fields and export examples are previews; no validated coding, submission, or external-system integration is provided.

5. **Role-Based Demo Access**:
   - Seven seeded personas demonstrate different navigation and dashboard views.
   - Route-level guards complement the sidebar visibility rules. Demo role switching is for presentation only, not a production identity system.

6. **Interoperability and Export Previews**:
   - The UI can display generated FHIR-style and SDTM-style sample JSON.
   - No ABDM, EDC, hospital, or regulator is connected. ADaM, Define-XML, and standards validation are not implemented.

7. **Demo Activity History**:
   - Demonstrates activity rows and CSV export. In-session entries are held in browser memory and are not immutable, cryptographically signed, or compliant electronic records.

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

### Option 1: Frontend Demo (Fastest)

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Click a demo role button to enter using the synthetic frontend dataset. Edits made in browser state reset after a page reload.

### Option 2: Full-Stack with Python FastAPI Backend

```bash
# Terminal 1: Start FastAPI Backend (Windows PowerShell)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8001

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

The API and interactive documentation are available at `http://localhost:8001/` and `http://localhost:8001/docs`. The frontend can also be run without the backend for a mock-data presentation.

### Option 3: Docker Compose

```bash
docker-compose up --build
```

---

## Suggested SIH Walkthrough

1. **Step 1: Login**
   - Navigate to `/login`.
   - Click the **Principal Investigator** card (`pi@aiia-demo.com`).
2. **Step 2: Portfolio Dashboard**
   - Explain that displayed counts come from the synthetic sample records.
   - Point out that the month-by-month enrollment line is illustrative while current trial bars and KPIs use the trial list.
3. **Step 3: Drill Down to High-Risk Trial**
   - Click the button **"Open Featured Study (AYU-004)"** or click `AYU-2026-004` in the trials list.
4. **Step 4: Explore trial status and risk examples**
   - Review the seeded study details and explain that scores and risk recommendations are prototype examples, not clinical advice.
5. **Step 5: Risk & Alerts Centre**
   - Open **Risk & Alerts** and resolve an example alert to demonstrate the interaction and activity entry.
6. **Step 6: Safety Review**
   - Open **Pharmacovigilance** and inspect sample adverse-event records and terminology fields.
7. **Step 7: Ethics and Regulatory Tracking**
   - Open **Regulatory & Ethics** to inspect example approval dates and CTRI/NDCT tracking fields; these are not verified submissions.
8. **Step 8: Activity History and Exports**
   - Open **Audit Trail**, demonstrate the sample activity view, then preview CSV/JSON exports.
9. **Step 9: Interoperability Preview**
   - Open **Interoperability** and explain that payloads are generated from synthetic records; external systems and standards validators are not connected.
10. **Step 10: Switch Roles via Navigation Bar**
   - Click the **Role Switcher** in the top navbar and select **Ethics Committee Member Secretary** or **Pharmacovigilance Officer**.
   - Observe how the dashboard intelligence banner, permissions, and focus areas adjust dynamically!

import React from 'react';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  FileCheck2,
  Database,
  UserCheck,
  Clock,
  EyeOff,
  Server,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SecurityCompliancePage() {
  const complianceFrameworks = [
    {
      title: 'Good Clinical Practice for ASU&H (GCP-ASU)',
      authority: 'Ministry of Ayush, Government of India',
      status: 'Designed to Support',
      points: [
        'Ethical clinical trial design for Ayurvedic formulations and classical Panchakarma interventions',
        'Standard Operating Procedures (SOPs) for investigator qualifications and subject safety monitoring',
        'Pharmacovigilance causality assessment guidelines for polyherbal and herbo-mineral drugs'
      ]
    },
    {
      title: 'National Ethical Guidelines for Biomedical Research (2017)',
      authority: 'Indian Council of Medical Research (ICMR)',
      status: 'Designed to Support',
      points: [
        'Institutional Ethics Committee (IEC) review workflow and quorum documentation',
        'Informed consent process documentation in regional languages with witness authentication',
        'Compensation and clinical management provisions for trial-related adverse events'
      ]
    },
    {
      title: 'New Drugs and Clinical Trials Rules (NDCT 2019)',
      authority: 'Central Drugs Standard Control Organization (CDSCO)',
      status: 'Designed to Support',
      points: [
        'Form CT-06 / CT-07 trial registration alignment and milestone tracking',
        'Expedited Serious Adverse Event (SAE) reporting mechanism within 24 hours of knowledge',
        'Inspection-ready trial master file (TMF) and subject-level documentation'
      ]
    },
    {
      title: 'Digital Personal Data Protection Act (DPDP Act 2023)',
      authority: 'Parliament of India / Data Protection Board',
      status: 'Designed to Support',
      points: [
        'Pseudonymization of participant personal health data (Synthetic research IDs P-1001..)',
        'Role-Based Access Control preventing unauthorized access across departments',
        'Purpose limitation and auditable participant consent management'
      ]
    },
    {
      title: 'ALCOA+ Data Integrity Principles',
      authority: 'WHO / US FDA / EMA International Standards',
      status: 'Designed to Support',
      points: [
        'Attributable (digital audit signatures), Legible (clean eCRF interfaces), Contemporaneous (timestamped entries)',
        'Original (source data verification tracking), Accurate (automated validation range rules)',
        'Complete, Consistent, Enduring, and Available throughout the regulatory archival window'
      ]
    },
    {
      title: '21 CFR Part 11 Electronic Records Alignment',
      authority: 'US FDA Technical Guidance',
      status: 'Designed to Support',
      points: [
        'Secure append-only audit trail logging user, timestamp, previous value and new value',
        'Session timeouts, password complexity rules, and cryptographic audit records',
        'System validation controls and electronic signature verification'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Security, Regulatory Compliance & Data Governance
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Architecture Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Technical mechanisms and regulatory framework mappings designed to support clinical research compliance
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Prototype Demonstration Disclaimer</p>
          <p>
            This system architecture is <strong>designed to support compliance requirements</strong> outlined in GCP-ASU, ICMR 2017, NDCT Rules 2019, and the DPDP Act 2023. The prototype incorporates the requisite technical controls, audit mechanisms, and data schemas for institutional review and demonstration.
          </p>
        </div>
      </div>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="p-2 rounded bg-teal-50 text-teal-700 w-fit">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict granular permission matrices for Principal Investigators, Coordinators, Monitors, Ethics Members, PV Officers, and Regulators.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="p-2 rounded bg-blue-50 text-blue-700 w-fit">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">JWT & Session Security</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cryptographically signed JSON Web Tokens (HMAC-SHA256) with idle expiration, CSRF defense, and HTTPS transport-level encryption.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="p-2 rounded bg-purple-50 text-purple-700 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Cryptographic Data Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AES-256 encryption at rest, TLS 1.3 in transit, and immutable SHA-256 hashing on all audit trail log entries.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="p-2 rounded bg-emerald-50 text-emerald-700 w-fit">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Privacy & De-Identification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automated synthetic participant pseudonyms (P-1001..) preventing personal identifiable health information exposure.
          </p>
        </div>
      </div>

      {/* Compliance Frameworks Mapping */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Regulatory & Ethical Frameworks Alignment Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceFrameworks.map((fw) => (
            <div key={fw.title} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{fw.title}</h3>
                  <p className="text-[11px] text-slate-500">{fw.authority}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                  {fw.status}
                </span>
              </div>

              <ul className="space-y-1.5 pt-2 text-xs text-slate-600">
                {fw.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Code2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Database,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import {
  generateFhirR4Bundle,
  generateSdtmDataset,
  generateAdamDataset,
  generateDefineXml,
  triggerDownload
} from '../services/cdiscFhirService';

export default function ReportsExportsPage() {
  const { trials, participants, aeReports, sites, showToast } = useTrials();

  const [selectedTrialId, setSelectedTrialId] = useState('AYU-2026-004');
  const [previewModal, setPreviewModal] = useState(null); // { type, title, content, filename, mimeType }
  const [copied, setCopied] = useState(false);

  const selectedTrial = trials.find(t => t.id === selectedTrialId) || trials[0];

  const handleExportCsv = (reportName) => {
    let csvContent = '';
    let filename = '';

    if (reportName === 'Trial Portfolio') {
      filename = `AIIA_Trial_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Trial ID,Title,Type,Phase,PI,Sites,Target,Enrolled,EnrollmentPct,HealthScore,Status,RiskLevel,CTRI\n' +
        trials.map(t => `"${t.id}","${t.title}","${t.studyType}","${t.phase}","${t.piName}",${t.participatingSitesCount},${t.targetEnrollment},${t.currentEnrollment},${Math.round((t.currentEnrollment/t.targetEnrollment)*100)}%,${t.healthScore},"${t.status}","${t.riskLevel}","${t.ctriNumber}"`).join('\n');
    } else if (reportName === 'Recruitment') {
      filename = `AIIA_Recruitment_Report_${selectedTrial.id}.csv`;
      csvContent = 'ParticipantID,TrialID,Site,Gender,Age,RandomizedArm,ScreeningStatus,EnrollmentStatus,AdherencePct,BaselineHbA1c,LatestHbA1c\n' +
        participants.map(p => `"${p.id}","${p.trialId}","${p.siteName}","${p.gender}",${p.age},"${p.randomizedArm}","${p.screeningStatus}","${p.enrollmentStatus}",${p.adherenceRate}%,${p.hbA1cBaseline || ''},${p.hbA1cLatest || ''}`).join('\n');
    } else if (reportName === 'Safety') {
      filename = `AIIA_Pharmacovigilance_Safety_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'ReportID,TrialID,ParticipantID,AdverseEvent,MedDRA,Severity,Seriousness,Causality,ReportDate,Status\n' +
        aeReports.map(a => `"${a.id}","${a.trialId}","${a.participantId}","${a.adverseEvent}","${a.meddraTerm}","${a.severity}","${a.seriousness}","${a.causality}","${a.reportDate}","${a.reviewStatus}"`).join('\n');
    } else {
      filename = `AIIA_Site_Performance_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'SiteID,Name,City,PI,Enrolled,Target,DataQualityPct,OpenQueries,MonitoringStatus\n' +
        sites.map(s => `"${s.id}","${s.name}","${s.city}","${s.piName}",${s.enrolledCount},${s.targetCount},${s.dataQualityScore}%,${s.openQueriesCount},"${s.monitoringStatus}"`).join('\n');
    }

    triggerDownload(csvContent, filename, 'text/csv;charset=utf-8;');
    showToast(`CSV Report Generated & Downloaded: ${filename}`);
  };

  const handleExportJson = () => {
    const data = {
      institution: 'All India Institute of Ayurveda',
      exportTimestamp: new Date().toISOString(),
      standard: 'AIIA-CTMS-JSON-v2',
      trial: selectedTrial,
      sites: sites.filter(s => selectedTrial.siteIds?.includes(s.id)),
      participants: participants.filter(p => p.trialId === selectedTrial.id),
      adverseEvents: aeReports.filter(a => a.trialId === selectedTrial.id)
    };
    const filename = `${selectedTrial.id}_StudyData_Export.json`;
    triggerDownload(JSON.stringify(data, null, 2), filename, 'application/json');
    showToast(`JSON Export Downloaded: ${filename}`);
  };

  const handlePreviewSdtm = () => {
    const sdtm = generateSdtmDataset(selectedTrial, participants, aeReports);
    const content = JSON.stringify(sdtm, null, 2);
    setPreviewModal({
      title: `CDISC SDTM v3.3 Dataset Domains (DM & AE) — ${selectedTrial.id}`,
      subtitle: 'Sample CDISC Submission Tabulations Package for DCGI/CDSCO',
      content,
      filename: `${selectedTrial.id}_SDTM_Datasets.json`,
      mimeType: 'application/json'
    });
  };

  const handlePreviewAdam = () => {
    const adam = generateAdamDataset(selectedTrial, participants);
    const content = JSON.stringify(adam, null, 2);
    setPreviewModal({
      title: `CDISC ADaM v2.1 (ADSL Subject-Level Analysis) — ${selectedTrial.id}`,
      subtitle: 'Analysis Data Model for Statistical Analysis Plan (SAP) execution',
      content,
      filename: `${selectedTrial.id}_ADSL_Dataset.json`,
      mimeType: 'application/json'
    });
  };

  const handlePreviewDefineXml = () => {
    const xml = generateDefineXml(selectedTrial);
    setPreviewModal({
      title: `CDISC Define-XML v2.1 Study Metadata Definition — ${selectedTrial.id}`,
      subtitle: 'W3C/ODM Standards-based metadata specification for SDTM IG 3.3',
      content: xml,
      filename: `define_${selectedTrial.id.toLowerCase()}.xml`,
      mimeType: 'application/xml'
    });
  };

  const handlePreviewFhir = () => {
    const fhir = generateFhirR4Bundle(selectedTrial, participants, aeReports);
    const content = JSON.stringify(fhir, null, 2);
    setPreviewModal({
      title: `HL7 FHIR R4 Bundle Export (ResearchStudy & ResearchSubject) — ${selectedTrial.id}`,
      subtitle: 'Interoperable FHIR R4 payload for EDC, Hospital Information Systems, and ABDM',
      content,
      filename: `fhir_bundle_${selectedTrial.id.toLowerCase()}.json`,
      mimeType: 'application/json'
    });
  };

  const copyToClipboard = () => {
    if (!previewModal) return;
    navigator.clipboard.writeText(previewModal.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied payload to clipboard.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports & Standards Interoperability Exports
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              CDISC & HL7 FHIR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional clinical trials reports, regulatory dossiers, CDISC SDTM/ADaM tabulations, and HL7 FHIR R4 bundles
          </p>
        </div>

        {/* Study Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Target Study:</label>
          <select
            value={selectedTrialId}
            onChange={(e) => setSelectedTrialId(e.target.value)}
            className="text-xs py-1.5 px-3 border border-slate-300 rounded-md bg-white font-mono font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {trials.map(t => (
              <option key={t.id} value={t.id}>{t.id} — {t.shortTitle}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Standards Assurance:</strong> All data exports are generated according to official CDISC (SDTMIG 3.3, ADaM 2.1) and HL7 FHIR R4 schema structures. All files labeled as sample/prototype interoperability payloads.
          </span>
        </div>
      </div>

      {/* Standard Institutional Reports (CSV & JSON) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-700" />
          Institutional Clinical Trial Reports (CSV & Full JSON)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Trial Portfolio Report</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Complete overview of all 12 registered studies, phase, PI, health scores, and recruitment rates.
              </p>
            </div>
            <button
              onClick={() => handleExportCsv('Trial Portfolio')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Portfolio CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Recruitment & Participant Roster</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                De-identified patient enrollment logs, treatment arm randomization, and visit adherence rates.
              </p>
            </div>
            <button
              onClick={() => handleExportCsv('Recruitment')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Recruitment CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Site Performance & Monitoring Log</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Multicenter performance matrix, data completeness ratings, and overdue CRA audit logs.
              </p>
            </div>
            <button
              onClick={() => handleExportCsv('Sites')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Sites CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Pharmacovigilance Safety Report</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Adverse Events (AE) and SAE registries with WHO-UMC causality and MedDRA SOC/PT classifications.
              </p>
            </div>
            <button
              onClick={() => handleExportCsv('Safety')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Safety CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Comprehensive Study JSON Package</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Full relational JSON payload containing study protocol, sites, participants, and eCRF queries.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Study JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regulatory & Interoperability Exports: Section 15 & 21 */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-700" />
          Regulatory Interoperability Formats (CDISC SDTM, ADaM, Define-XML & HL7 FHIR R4)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SDTM Export */}
          <div className="p-4 rounded-lg border border-teal-200 bg-teal-50/30 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                CDISC Tabulation
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">CDISC SDTM v3.3</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Demographics (DM) and Adverse Events (AE) standardized tabulation domains for regulatory submission.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviewSdtm}
                className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview & Export</span>
              </button>
            </div>
          </div>

          {/* ADaM Export */}
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/30 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                CDISC Analysis
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">CDISC ADaM v2.1 (ADSL)</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Subject-Level Analysis Dataset (ADSL) for statistical testing of primary endpoints and covariates.
              </p>
            </div>
            <button
              onClick={handlePreviewAdam}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview & Export</span>
            </button>
          </div>

          {/* Define-XML Export */}
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/30 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Metadata Standard
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">CDISC Define-XML v2.1</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Machine-readable XML metadata dictionary specifying variables, item definitions, and codelists.
              </p>
            </div>
            <button
              onClick={handlePreviewDefineXml}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview & Export</span>
            </button>
          </div>

          {/* HL7 FHIR R4 Bundle */}
          <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/30 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                HL7 Healthcare FHIR
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-2">HL7 FHIR R4 JSON Bundle</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                ResearchStudy, ResearchSubject, and AdverseEvent resource bundle for hospital EHR and ABDM sync.
              </p>
            </div>
            <button
              onClick={handlePreviewFhir}
              className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview & Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 animate-in fade-in-50">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewModal.title}</h3>
                <p className="text-xs text-slate-500">{previewModal.subtitle}</p>
              </div>
              <button
                onClick={() => setPreviewModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-emerald-400">
              <pre className="whitespace-pre-wrap">{previewModal.content}</pre>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Filename: {previewModal.filename}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => {
                    triggerDownload(previewModal.content, previewModal.filename, previewModal.mimeType);
                    showToast(`Downloaded: ${previewModal.filename}`);
                  }}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

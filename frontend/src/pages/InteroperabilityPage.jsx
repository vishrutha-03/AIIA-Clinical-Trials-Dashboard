import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  Database,
  Building,
  Server,
  Layers,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Copy
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import { generateFhirR4Bundle, generateSdtmDataset } from '../services/cdiscFhirService';

export default function InteroperabilityPage() {
  const { trials, participants, aeReports, showToast } = useTrials();
  const [selectedFormat, setSelectedFormat] = useState('fhir');
  const [copied, setCopied] = useState(false);

  const sampleTrial = trials.find(t => t.id === 'AYU-2026-004') || trials[0];

  const fhirBundle = generateFhirR4Bundle(sampleTrial, participants, aeReports);
  const sdtmPackage = generateSdtmDataset(sampleTrial, participants, aeReports);

  const activePayload = selectedFormat === 'fhir' ? JSON.stringify(fhirBundle, null, 2) : JSON.stringify(sdtmPackage, null, 2);

  const copyPayload = () => {
    navigator.clipboard.writeText(activePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Interoperability payload copied to clipboard.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Data Interoperability & Integration Architecture
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              HL7 FHIR R4 & CDISC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Architecture for Electronic Data Capture (EDC), Hospital Information Systems (HIS), ABDM, and CDISC regulatory submissions
          </p>
        </div>
      </div>

      {/* Realistic Integration Architecture Diagrams (Section 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthcare Interoperability Flow */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-teal-700" />
              Healthcare Ecosystem Integration (HL7 FHIR R4)
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400">REST API Bridge</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-white p-3 rounded border border-slate-200 shadow-2xs">
              <span className="text-teal-800">AIIA CTMS Platform</span>
              <span className="text-slate-400">Core System of Record</span>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-400">
              <div className="h-4 w-0.5 bg-slate-300" />
              <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                HTTPS REST API / OAuth2 Bearer
              </span>
              <div className="h-4 w-0.5 bg-slate-300" />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-teal-50 p-3 rounded border border-teal-200 shadow-2xs">
              <span className="text-teal-900">HL7 FHIR R4 Transformation Adapter</span>
              <span className="text-xs font-mono text-teal-700">JSON-LD / REST</span>
            </div>

            <div className="flex flex-col items-center justify-center text-slate-400">
              <div className="h-4 w-0.5 bg-slate-300" />
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Bidirectional Sync
              </span>
              <div className="h-4 w-0.5 bg-slate-300" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs">
                <Database className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <strong className="block text-[11px] text-slate-800">EDC Systems</strong>
                <span className="text-[10px] text-slate-400">REDCap / OpenClinica</span>
              </div>
              <div className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs">
                <Building className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <strong className="block text-[11px] text-slate-800">Hospital EHR / HIS</strong>
                <span className="text-[10px] text-slate-400">AIIA e-Hospital</span>
              </div>
              <div className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs">
                <Server className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <strong className="block text-[11px] text-slate-800">ABDM Gateway</strong>
                <span className="text-[10px] text-slate-400">ABHA Health ID Sync</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            *Mock interface representation demonstrating system integration readiness for National Digital Health Mission standards.
          </p>
        </div>

        {/* Regulatory CDISC Standards Flow */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-700" />
              Regulatory CDISC Pipeline (DCGI / CDSCO)
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400">Standardized Datasets</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Data Collection</span>
                <strong className="block text-teal-800 mt-1">CDASH</strong>
                <span className="text-[9px] text-slate-400">Standard eCRFs</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Tabulation</span>
                <strong className="block text-blue-800 mt-1">SDTM v3.3</strong>
                <span className="text-[9px] text-slate-400">DM, AE, DS, LB</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Analysis</span>
                <strong className="block text-purple-800 mt-1">ADaM v2.1</strong>
                <span className="text-[9px] text-slate-400">ADSL, ADAE</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Metadata</span>
                <strong className="block text-amber-800 mt-1">Define-XML</strong>
                <span className="text-[9px] text-slate-400">W3C Compliant</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800">ASU&H Standardized Terminology Harmonization</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                AIIA CTMS bridges classical Ayurvedic diagnostic categorizations (Prakriti, Rogi Pareeksha, Dosha Dushya Sammurchana) into internationally recognized MedDRA terms (System Organ Classes) and WHODrug codes for global peer-reviewed clinical dossiers.
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Validatable with OpenCDISC / Pinnacle 21 Community Rules
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Payload Inspector */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-teal-700" />
              Live Interoperability Schema Viewer (Study: {sampleTrial.id})
            </h3>
            <p className="text-xs text-slate-500">
              Inspect generated JSON payloads for HL7 FHIR R4 Bundle vs CDISC SDTM tabulations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-slate-300 p-0.5 bg-slate-100 text-xs">
              <button
                onClick={() => setSelectedFormat('fhir')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  selectedFormat === 'fhir' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                HL7 FHIR R4
              </button>
              <button
                onClick={() => setSelectedFormat('sdtm')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  selectedFormat === 'sdtm' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                CDISC SDTM v3.3
              </button>
            </div>

            <button
              onClick={copyPayload}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
            </button>
          </div>
        </div>

        <div className="h-96 rounded-lg bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{activePayload}</pre>
        </div>
      </div>
    </div>
  );
}

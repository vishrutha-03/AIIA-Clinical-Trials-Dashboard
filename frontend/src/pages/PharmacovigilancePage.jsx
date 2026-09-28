import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertCircle,
  FileCheck2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  Info,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useTrials } from '../context/TrialsContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function PharmacovigilancePage() {
  const navigate = useNavigate();
  const { isReadOnly } = useAuth();
  const { aeReports, safetySignals, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [seriousnessFilter, setSeriousnessFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCodingAe, setSelectedCodingAe] = useState(null);

  const filteredAe = aeReports.filter((ae) => {
    const matchesSearch =
      ae.id.toLowerCase().includes(search.toLowerCase()) ||
      ae.trialId.toLowerCase().includes(search.toLowerCase()) ||
      ae.adverseEvent.toLowerCase().includes(search.toLowerCase()) ||
      ae.meddraTerm.toLowerCase().includes(search.toLowerCase());

    const matchesSeriousness =
      seriousnessFilter === 'All' ||
      (seriousnessFilter === 'SAE' && ae.seriousness.startsWith('Yes')) ||
      (seriousnessFilter === 'AE' && ae.seriousness === 'No');

    const matchesStatus =
      statusFilter === 'All' || ae.reviewStatus === statusFilter;

    return matchesSearch && matchesSeriousness && matchesStatus;
  });

  const safetyTrendData = [
    { month: 'Apr', nonserious: 4, sae: 1 },
    { month: 'May', nonserious: 6, sae: 0 },
    { month: 'Jun', nonserious: 8, sae: 1 },
    { month: 'Jul', nonserious: 10, sae: 2 },
    { month: 'Aug', nonserious: 9, sae: 1 },
    { month: 'Sep', nonserious: 12, sae: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ASU&H Pharmacovigilance Centre
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Demo Safety Register
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synthetic adverse-event records and example safety review fields; terminology and causality are not clinically validated.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports-exports')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Export Safety CIOMS / SDTM AE</span>
          </button>
        </div>
      </div>

      {/* Top 5 Safety KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard
          title="Total AE Reports"
          value={aeReports.length}
          subtitle="Records in this demo"
          icon={ShieldAlert}
          status="normal"
        />
        <KpiCard
          title="SAE Reports"
          value={aeReports.filter((ae) => ae.seriousness?.startsWith('Yes')).length}
          subtitle="Marked serious in sample"
          icon={AlertCircle}
          status="danger"
        />
        <KpiCard
          title="Under Review"
          value={aeReports.filter((ae) => ae.reviewStatus === 'Under Review').length}
          subtitle="Review status in sample"
          icon={Clock}
          status="warning"
        />
        <KpiCard
          title="Resolved"
          value={aeReports.filter((ae) => ae.safetyStatus === 'Resolved').length}
          subtitle="Marked resolved in sample"
          icon={CheckCircle2}
          status="success"
        />
        <KpiCard
          title="Reporting Due"
          value={aeReports.filter((ae) => /pending/i.test(ae.regulatorySubmissionStatus || '')).length}
          subtitle="Submission text says pending"
          icon={Clock}
          status="danger"
        />
      </div>

      {/* Aggregated Safety Signals Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Ayurvedic Safety Signal Surveillance & Aggregated Clusters
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Example Signal Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetySignals.map((signal) => (
            <div
              key={signal.id}
              className="p-4 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded">
                    Potential Signal ({signal.id})
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-1">
                    {signal.formulationName}
                  </h3>
                </div>
                <span className="text-xs font-black text-purple-800 bg-white px-2 py-1 rounded border border-purple-200 shadow-2xs">
                  {signal.eventCount} Events
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {signal.signalDescription}
              </p>

              <div className="pt-2 border-t border-purple-100 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">MedDRA Cluster:</span>
                  <strong className="text-slate-800 font-mono">{signal.meddraCluster}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Trend Status:</span>
                  <strong className="text-purple-700">{signal.signalTrend}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">DSMB Review:</span>
                  <strong className="text-amber-700">{signal.dsmbReviewStatus}</strong>
                </div>
              </div>

              <div className="mt-2 p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700">
                <strong className="text-slate-900">Proposed Protocol Action:</strong> {signal.actionProposed}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Trend Chart */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Adverse Events Reporting Velocity (6 Months)</h3>
            <p className="text-xs text-slate-500">Monthly breakdown of Non-Serious AE vs Serious Adverse Events (SAE)</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            All ASU&H Formulations
          </span>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safetyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="nonserious" name="Non-Serious Adverse Events (AE)" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sae" name="Serious Adverse Events (SAE)" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Adverse Events & SAE Master Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Report ID, study, event description, or MedDRA code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={seriousnessFilter}
              onChange={(e) => setSeriousnessFilter(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Severity / Seriousness</option>
              <option value="SAE">Serious (SAE Only)</option>
              <option value="AE">Non-Serious (AE Only)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Review Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Trial ID</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Adverse Event (MedDRA Term)</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Seriousness</th>
                <th className="py-2.5 px-3">Causality (WHO-UMC)</th>
                <th className="py-2.5 px-3">Report Date</th>
                <th className="py-2.5 px-3">Review Status</th>
                <th className="py-2.5 px-3 text-right">Coding / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAe.map((ae) => {
                const isSae = ae.seriousness.startsWith('Yes');

                return (
                  <tr key={ae.id} className={`hover:bg-slate-50 ${isSae ? 'bg-red-50/15' : ''}`}>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-900 whitespace-nowrap">
                      {ae.id}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      <Link to={`/trials/${ae.trialId}`} className="hover:text-teal-700 hover:underline">
                        {ae.trialId}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold whitespace-nowrap">
                      {ae.participantId}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="font-semibold text-slate-900">{ae.adverseEvent}</p>
                      <p className="text-[11px] text-purple-700 font-mono mt-0.5">{ae.meddraTerm}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={ae.severity} size="xs" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSae ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ae.seriousness}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                      {ae.causality}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {ae.reportDate}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={ae.reviewStatus} size="xs" />
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCodingAe(ae)}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded font-semibold text-[11px] border border-purple-200 transition-colors"
                      >
                        MedDRA / WHODrug
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MedDRA / WHODrug Coding Modal */}
      {selectedCodingAe && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Standardized MedDRA & WHODrug Coding Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedCodingAe(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Report Identifier</span>
                <p className="font-mono font-bold text-slate-900">{selectedCodingAe.id} ({selectedCodingAe.trialId})</p>
                <p className="text-slate-600">Verbatim Term: <strong>{selectedCodingAe.adverseEvent}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">MedDRA Classification</span>
                  <p className="font-bold text-slate-800 mt-1">{selectedCodingAe.meddraTerm}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">System Organ Class: {selectedCodingAe.meddraSoc}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">WHODrug Dictionary Code</span>
                  <p className="font-bold text-slate-800 mt-1 font-mono">{selectedCodingAe.whodrugCode}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ayurvedic Formulation Mapping: Verified</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <p><strong>Causality Algorithm:</strong> WHO-UMC Probability Assessment ({selectedCodingAe.causality})</p>
                <p><strong>Dechallenge / Rechallenge:</strong> {selectedCodingAe.dechallengeRechallenge}</p>
                <p><strong>Regulatory Transmission:</strong> {selectedCodingAe.regulatorySubmissionStatus}</p>
                <p><strong>Assigned PV Medical Assessor:</strong> {selectedCodingAe.assignedPvOfficer}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  showToast('Regulatory transmission packet exported (CIOMS I XML format).', 'info');
                  setSelectedCodingAe(null);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
              >
                Export CIOMS / E2B(R3)
              </button>
              <button
                onClick={() => setSelectedCodingAe(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

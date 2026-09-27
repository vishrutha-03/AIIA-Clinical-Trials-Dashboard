import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
  HelpCircle,
  FileQuestion
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { useTrials } from '../context/TrialsContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function DataQualityPage() {
  const navigate = useNavigate();
  const { isReadOnly } = useAuth();
  const { queries, siteRankings, resolveQuery, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState(null);

  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.trialId.toLowerCase().includes(search.toLowerCase()) ||
      q.siteName.toLowerCase().includes(search.toLowerCase()) ||
      q.queryText.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesSite = !selectedSiteFilter || q.siteName.toLowerCase().includes(selectedSiteFilter.toLowerCase().split(' ')[0]);

    return matchesSearch && matchesStatus && matchesSite;
  });

  const chartData = siteRankings.map(s => ({
    name: s.site.split(' ')[0],
    fullName: s.site,
    score: s.score,
    openQueries: s.openQueries,
    resolvedQueries: s.resolvedQueries,
    fill: s.score >= 90 ? '#10B981' : s.score >= 80 ? '#F59E0B' : '#EF4444'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Data Quality & Discrepancy Management
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              ALCOA+ Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated eCRF range validation, source data discrepancies, query resolution workflows, and site completeness scores
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Central validation engine executed: 0 new anomalies detected.', 'info');
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Execute Auto-Validation Sweep</span>
        </button>
      </div>

      {/* Top 4 Data Quality KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="Data Completeness"
          value="98.4%"
          subtitle="eCRF mandatory fields"
          icon={CheckCircle2}
          status="success"
        />
        <KpiCard
          title="Open Data Queries"
          value={queries.filter(q => q.status === 'Open').length}
          subtitle="Awaiting site response"
          icon={Clock}
          status="warning"
        />
        <KpiCard
          title="Resolved Queries"
          value={queries.filter(q => q.status === 'Resolved').length}
          subtitle="Reconciled with source"
          icon={CheckCircle2}
          status="normal"
        />
        <KpiCard
          title="Missing Value Rate"
          value="0.6%"
          subtitle="Well below 2% limit"
          icon={ShieldCheck}
          status="success"
        />
      </div>

      {/* Site Comparison Chart: Section 14 */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Multicenter Site Data Quality Benchmark (%)
            </h2>
            <p className="text-xs text-slate-500">
              Comparison across participating hospital centres. Click any site bar to filter discrepancy queries below.
            </p>
          </div>
          {selectedSiteFilter && (
            <button
              onClick={() => setSelectedSiteFilter(null)}
              className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 flex items-center gap-1"
            >
              <span>Filtering by: {selectedSiteFilter}</span>
              <span className="font-bold ml-1">✕</span>
            </button>
          )}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onClick={(state) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const item = state.activePayload[0].payload;
                  setSelectedSiteFilter(item.fullName);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[60, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-modal border border-slate-700">
                        <p className="font-bold text-teal-300">{data.fullName}</p>
                        <p className="mt-1">Quality Rating: <strong>{data.score}%</strong></p>
                        <p>Open Queries: <strong>{data.openQueries}</strong> | Resolved: <strong>{data.resolvedQueries}</strong></p>
                        <p className="text-[10px] text-teal-400 mt-1">Click to filter queries below</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} cursor="pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ≥90% Exemplary / Good</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 80-89% Acceptable</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> &lt;80% High Concern (ITRA Jamnagar: 78%)</span>
          </div>
          <span className="text-slate-400">Source: Central eCRF Engine</span>
        </div>
      </div>

      {/* Discrepancy Queries Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries by ID, study, participant, or form..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Query Statuses</option>
              <option value="Open">Open</option>
              <option value="Answered">Answered</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Query ID</th>
                <th className="py-2.5 px-3">Study ID</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Centre</th>
                <th className="py-2.5 px-3">eCRF Form & Field</th>
                <th className="py-2.5 px-3">Query Discrepancy Narrative</th>
                <th className="py-2.5 px-3">Origin / Trigger</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueries.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {q.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    {q.trialId}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold whitespace-nowrap">
                    {q.participantId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {q.siteName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">{q.formName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{q.field}</span>
                  </td>
                  <td className="py-2.5 px-3 max-w-sm text-slate-700">
                    <p>{q.queryText}</p>
                    {q.resolutionNote && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        ✓ {q.resolutionNote}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                    {q.raisedBy}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={q.status} size="xs" />
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    {q.status !== 'Resolved' && !isReadOnly && (
                      <button
                        onClick={() => resolveQuery(q.id, 'Source document verified with clinical lab report')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Reconcile & Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Plus,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import StatusBadge from '../components/common/StatusBadge';
import HealthScoreGauge from '../components/common/HealthScoreGauge';

export default function TrialsPage() {
  const navigate = useNavigate();
  const { trials } = useTrials();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort trials
  const filteredTrials = useMemo(() => {
    return trials
      .filter((t) => {
        const matchesSearch =
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.piName.toLowerCase().includes(search.toLowerCase()) ||
          t.ctriNumber?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesRisk = riskFilter === 'All' || t.riskLevel === riskFilter;
        const matchesType = typeFilter === 'All' || t.studyType.includes(typeFilter);

        return matchesSearch && matchesStatus && matchesRisk && matchesType;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'enrollmentPct') {
          valA = (a.currentEnrollment / a.targetEnrollment) * 100;
          valB = (b.currentEnrollment / b.targetEnrollment) * 100;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [trials, search, statusFilter, riskFilter, typeFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Clinical Trials Registry
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
              {filteredTrials.length} of {trials.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registered Ayurveda / ASU&H clinical investigations under AIIA governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports-exports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Trial ID, formulation, PI, or CTRI..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk (At Risk)</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk (On Track)</option>
            </select>
          </div>

          {/* Study Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Study Types</option>
              <option value="Randomized">Randomized Controlled</option>
              <option value="Comparative">Comparative Trial</option>
              <option value="Pragmatic">Pragmatic / Observational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trials Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Trial ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Study Title & Intervention</th>
                <th className="py-3 px-3">Phase & Type</th>
                <th className="py-3 px-3">Principal Investigator</th>
                <th className="py-3 px-2 text-center">Sites</th>
                <th
                  onClick={() => handleSort('enrollmentPct')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Enrolled / Target</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('healthScore')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Health Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">CTRI Status</th>
                <th className="py-3 px-3 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrials.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No clinical trials match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTrials.map((t) => {
                  const pct = Math.round((t.currentEnrollment / t.targetEnrollment) * 100);
                  const isHighRisk = t.riskLevel === 'High' || t.healthScore < 75;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => navigate(`/trials/${t.id}`)}
                      className={`hover:bg-teal-50/40 cursor-pointer transition-colors ${
                        isHighRisk ? 'bg-red-50/15' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span>{t.id}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-semibold text-slate-900 leading-snug line-clamp-1">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {t.intervention}
                        </p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{t.phase}</span>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{t.studyType}</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-medium text-slate-900">{t.piName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{t.leadInstitution}</p>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-700">
                        {t.participatingSitesCount}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {t.currentEnrollment} <span className="font-normal text-slate-400">/ {t.targetEnrollment}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-black text-xs ${
                            t.healthScore >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.healthScore >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {t.healthScore} / 100
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={t.status} size="xs" />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={t.riskLevel} size="xs" />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-mono text-[10px] text-slate-500 font-semibold">{t.ctriNumber}</p>
                        <p className={`text-[10px] font-semibold ${t.ctriStatus?.includes('Due') ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {t.ctriStatus}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {t.lastUpdated}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <strong>{filteredTrials.length}</strong> active clinical investigations
          </span>
          <span className="font-medium text-slate-600">
            Total Target Cohort: 2,340 participants
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function SitesPage() {
  const navigate = useNavigate();
  const { isReadOnly } = useAuth();
  const { sites, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [monitoringFilter, setMonitoringFilter] = useState('All');

  const filtered = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.city.toLowerCase().includes(search.toLowerCase()) ||
      site.piName.toLowerCase().includes(search.toLowerCase());

    const matchesMonitoring =
      monitoringFilter === 'All' ||
      (monitoringFilter === 'Overdue' && site.monitoringStatus.includes('Overdue')) ||
      (monitoringFilter === 'Up to Date' && site.monitoringStatus.includes('Up to Date'));

    return matchesSearch && matchesMonitoring;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Multicenter Clinical Sites & Monitoring
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {sites.length} Active Centers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            CRA on-site monitoring cycles, Source Data Verification (SDV), and clinical site quality scores
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Central monitoring dispatch notice sent to all regional CRAs.', 'info');
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Dispatch CRA Monitoring Notice</span>
        </button>
      </div>

      {/* Overdue Monitoring Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-red-900">
          <h3 className="font-bold">Overdue CRA Monitoring Visits Requiring Action</h3>
          <p>
            <strong>Site-03 (ITRA Jamnagar):</strong> Routine Source Data Verification visit is <strong>14 days overdue</strong> (Next was scheduled for Sept 13, 2026). 24 unaddressed data queries pending.
          </p>
          <p>
            <strong>Site-04 (BHU Varanasi):</strong> Cycle 4 monitoring visit is <strong>6 days overdue</strong> (Scheduled Sept 21, 2026).
          </p>
        </div>
      </div>

      {/* Site KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="Active Participating Sites"
          value={sites.length}
          subtitle="8 core AIIA network centres"
          icon={Building2}
          status="normal"
        />
        <KpiCard
          title="Monitoring Overdue"
          value="2 Sites"
          subtitle="ITRA Jamnagar & BHU"
          icon={AlertTriangle}
          status="danger"
        />
        <KpiCard
          title="Average Data Quality"
          value="87.6%"
          subtitle="Source data completeness"
          icon={ShieldCheck}
          status="success"
        />
        <KpiCard
          title="Total Open Queries"
          value="83"
          subtitle="Across all active sites"
          icon={Clock}
          status="warning"
        />
      </div>

      {/* Sites Master Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Site name, city, or Principal Investigator..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={monitoringFilter}
              onChange={(e) => setMonitoringFilter(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Monitoring Statuses</option>
              <option value="Overdue">Overdue Visits Only</option>
              <option value="Up to Date">Up to Date</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Site ID</th>
                <th className="py-2.5 px-3">Centre Name</th>
                <th className="py-2.5 px-3">City & State</th>
                <th className="py-2.5 px-3">Site Principal Investigator</th>
                <th className="py-2.5 px-3 text-right">Enrollment</th>
                <th className="py-2.5 px-3 text-center">Data Quality</th>
                <th className="py-2.5 px-3 text-center">Open Queries</th>
                <th className="py-2.5 px-3">Monitoring Status</th>
                <th className="py-2.5 px-3">Next Visit Date</th>
                <th className="py-2.5 px-3">Site Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((site) => {
                const pct = Math.round((site.enrolledCount / site.targetCount) * 100);
                const isOverdue = site.monitoringStatus.includes('Overdue');

                return (
                  <tr key={site.id} className={`hover:bg-slate-50 ${isOverdue ? 'bg-red-50/15' : ''}`}>
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {site.id}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {site.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {site.city}, {site.state}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {site.piName}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="font-bold text-slate-900">{site.enrolledCount}</span>
                      <span className="text-slate-400"> / {site.targetCount} ({pct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={site.dataQualityScore >= 90 ? 'text-emerald-700' : 'text-amber-700'}>
                        {site.dataQualityScore}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        site.openQueriesCount > 10 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {site.openQueriesCount}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={site.monitoringStatus} size="xs" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {site.nextMonitoringDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={site.riskLevel} size="xs" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

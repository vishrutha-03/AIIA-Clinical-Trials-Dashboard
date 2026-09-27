import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function RegulatoryEthicsPage() {
  const navigate = useNavigate();
  const { trials, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('All');

  const complianceList = trials.map((t) => {
    let overallCompliance = 'Compliant';
    if (t.ctriStatus?.includes('Due in 5 Days') || t.iecStatus?.includes('Due Soon')) {
      overallCompliance = 'Due Soon';
    } else if (t.ctriStatus?.includes('Overdue') || t.iecStatus?.includes('Expired')) {
      overallCompliance = 'Overdue';
    }

    return {
      ...t,
      overallCompliance
    };
  });

  const filtered = complianceList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.ctriNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesComp =
      filterCompliance === 'All' || item.overallCompliance === filterCompliance;

    return matchesSearch && matchesComp;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Regulatory Compliance & Ethics Dossier
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              NDCT Rules 2019 & ICMR 2017
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional Ethics Committee (IEC) clearances, CTRI registries, and New Drugs & Clinical Trials Rules monitoring
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Regulatory Compliance Dossier compiled for CDSCO inspection audit.', 'info');
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate CDSCO Inspection Packet</span>
        </button>
      </div>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="IEC Approvals Valid"
          value="11 / 12"
          subtitle="1 renewal pending"
          icon={ShieldCheck}
          status="success"
        />
        <KpiCard
          title="CTRI Active Registrations"
          value="12"
          subtitle="All studies logged"
          icon={FileCheck2}
          status="primary"
        />
        <KpiCard
          title="Deadlines Due Soon"
          value="2"
          subtitle="Within 14 days"
          icon={Clock}
          status="warning"
        />
        <KpiCard
          title="NDCT CT-06 Status"
          value="100%"
          subtitle="Pre-trial permissions active"
          icon={CheckCircle2}
          status="normal"
        />
      </div>

      {/* Regulatory Timeline Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-900">
          <h3 className="font-bold">Active Regulatory Action Window</h3>
          <p>
            <strong>AYU-2026-004:</strong> CTRI 6-monthly progress update window closes on <strong>October 02, 2026 (5 days remaining)</strong>.
            Mandatory subject recruitment totals and adverse event summaries must be committed to the public CTRI portal.
          </p>
          <p>
            <strong>AYU-2026-002:</strong> Institutional Ethics Committee continuation certificate expires on <strong>October 04, 2026 (9 days remaining)</strong>.
          </p>
        </div>
      </div>

      {/* Master Regulatory & Ethics Tracking Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Study ID, CTRI number, or title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Compliance States</option>
              <option value="Compliant">Compliant</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Study ID</th>
                <th className="py-2.5 px-3">Study Title</th>
                <th className="py-2.5 px-3">IEC Clearance</th>
                <th className="py-2.5 px-3">IEC Expiry</th>
                <th className="py-2.5 px-3">CTRI Identifier</th>
                <th className="py-2.5 px-3">CTRI Update Status</th>
                <th className="py-2.5 px-3">NDCT Rules (2019)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((study) => (
                <tr key={study.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {study.id}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs font-semibold text-slate-900 truncate">
                    {study.title}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    {study.iecApprovalDate}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                    {study.iecExpiryDate}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap font-semibold">
                    {study.ctriNumber}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`font-semibold ${study.ctriStatus?.includes('Due') ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {study.ctriStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{study.ctriNextUpdateDue}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    {study.ndctApplicability}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={study.overallCompliance} size="xs" />
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <Link
                      to={`/trials/${study.id}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
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

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  ArrowRight,
  Download,
  Calendar,
  User,
  Fingerprint
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import { triggerDownload } from '../services/cdiscFhirService';

export default function AuditTrailPage() {
  const { auditLogs, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.record.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.newValue.toLowerCase().includes(search.toLowerCase());

    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesRole = roleFilter === 'All' || log.role === roleFilter;

    return matchesSearch && matchesModule && matchesRole;
  });

  const exportAuditLog = () => {
    const csvContent =
      'Timestamp,User,Role,Action,Module,Record,PreviousValue,NewValue,IP_Session,Signature\n' +
      auditLogs
        .map(
          (l) =>
            `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.module}","${l.record}","${l.previousValue}","${l.newValue}","${l.ipAddress}","${l.signature}"`
        )
        .join('\n');
    triggerDownload(csvContent, `AIIA_CTMS_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    showToast('Immutable Audit Log Exported (CSV format).');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Audit Trail & Electronic Signatures
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              21 CFR Part 11
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Append-only immutable record of all clinical modifications, investigator sign-offs, and data discrepancies
          </p>
        </div>

        <button
          onClick={exportAuditLog}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Security Assurance Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-4 flex items-center justify-between text-xs border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-teal-500/20 text-teal-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Immutable Append-Only Integrity</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Each state mutation is cryptographically time-stamped and bound to the authenticated user session. Direct deletion or in-place overrides are prohibited by architecture.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-teal-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
          <Lock className="w-3.5 h-3.5" />
          <span>ALCOA+ Verified</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by user, action, study ID, or record..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Modules</option>
            <option value="Clinical Trials">Clinical Trials</option>
            <option value="Pharmacovigilance">Pharmacovigilance</option>
            <option value="Risk & Alerts">Risk & Alerts</option>
            <option value="Data Quality">Data Quality</option>
            <option value="Regulatory & Ethics">Regulatory & Ethics</option>
            <option value="Users & Roles">Users & Roles</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Roles</option>
            <option value="Principal Investigator">Principal Investigator</option>
            <option value="Study Coordinator">Study Coordinator</option>
            <option value="Clinical Research Associate (Monitor)">Monitor</option>
            <option value="Pharmacovigilance Officer">Pharmacovigilance</option>
            <option value="Ethics Committee Member Secretary">Ethics Secretary</option>
            <option value="System Administrator">Administrator</option>
          </select>
        </div>
      </div>

      {/* Master Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp (IST)</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Clinical Action</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Record Key</th>
                <th className="py-2.5 px-3">Audit Delta (Before → After)</th>
                <th className="py-2.5 px-3">Session & Cryptographic Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-normal">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-sans font-bold text-slate-900 block">{log.user}</span>
                    <span className="font-sans text-[11px] text-teal-700">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-teal-900 whitespace-nowrap">
                    {log.record}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs font-sans text-xs">
                    <div className="text-slate-500 line-through text-[11px] truncate">
                      {log.previousValue}
                    </div>
                    <div className="text-emerald-700 font-medium truncate mt-0.5">
                      → {log.newValue}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    <div>{log.ipAddress}</div>
                    <div className="text-teal-600 font-bold">{log.signature}</div>
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

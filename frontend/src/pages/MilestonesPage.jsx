import React, { useState } from 'react';
import { CalendarCheck2, Search, Filter, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function MilestonesPage() {
  const { milestones, trials } = useTrials();

  const [selectedTrial, setSelectedTrial] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = milestones.filter((m) => {
    const matchesTrial = selectedTrial === 'All' || m.trialId === selectedTrial;
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.trialId.toLowerCase().includes(search.toLowerCase());
    return matchesTrial && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Trial Milestones & Lifecycle Roadmaps
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Protocol to Close-Out
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Key operational milestones, regulatory review deadlines, recruitment targets, and close-out gates
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="Total Milestones"
          value="48"
          subtitle="Across active portfolio"
          icon={CalendarCheck2}
          status="normal"
        />
        <KpiCard
          title="Completed Milestones"
          value="31"
          subtitle="64.5% overall progress"
          icon={CheckCircle2}
          status="success"
        />
        <KpiCard
          title="Milestones At Risk"
          value="3"
          subtitle="Recruitment milestones"
          icon={AlertTriangle}
          status="danger"
        />
        <KpiCard
          title="Upcoming in 30 Days"
          value="5"
          subtitle="DSMB review & CTRI"
          icon={Clock}
          status="warning"
        />
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Milestone title or Trial ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTrial}
              onChange={(e) => setSelectedTrial(e.target.value)}
              className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Studies</option>
              {trials.map(t => (
                <option key={t.id} value={t.id}>{t.id}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Milestone Key</th>
                <th className="py-2.5 px-3">Study ID</th>
                <th className="py-2.5 px-3">Milestone Title</th>
                <th className="py-2.5 px-3">Lifecycle Phase</th>
                <th className="py-2.5 px-3">Target Due Date</th>
                <th className="py-2.5 px-3">Actual / Completion Date</th>
                <th className="py-2.5 px-3">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {m.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    {m.trialId}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {m.title}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {m.phase}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {m.dueDate}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                    {m.completedDate || 'Pending Execution'}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={m.status} size="xs" />
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

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Activity,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import StatusBadge from '../components/common/StatusBadge';
import KpiCard from '../components/common/KpiCard';

export default function ParticipantsPage() {
  const navigate = useNavigate();
  const { participants, sites, trials, showToast } = useTrials();

  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [trialFilter, setTrialFilter] = useState('All');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.trialId.toLowerCase().includes(search.toLowerCase()) ||
      p.randomizedArm.toLowerCase().includes(search.toLowerCase()) ||
      p.siteName.toLowerCase().includes(search.toLowerCase());

    const matchesSite = siteFilter === 'All' || p.siteId === siteFilter;
    const matchesTrial = trialFilter === 'All' || p.trialId === trialFilter;

    return matchesSearch && matchesSite && matchesTrial;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Trial Participants Registry
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {participants.length} Demo Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Privacy-safe synthetic participant records, randomisation arms, and protocol visit tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Synthetic sample data · not a privacy certification</span>
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="Total Randomized"
          value={participants.filter((participant) => participant.randomizedArm).length}
          subtitle={`Across ${sites.length} demo sites`}
          icon={Users}
          status="primary"
        />
        <KpiCard
          title="Active in Follow-up"
          value="1,240"
          subtitle="On scheduled therapy"
          icon={Activity}
          status="success"
        />
        <KpiCard
          title="Visits Scheduled This Week"
          value="68"
          subtitle="Window adherence 94%"
          icon={Calendar}
          status="normal"
        />
        <KpiCard
          title="Mean Protocol Adherence"
          value="92.4%"
          subtitle="Medication diaries"
          icon={UserCheck}
          status="success"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Synthetic Participant ID (e.g. P-1001), site, or arm..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={trialFilter}
            onChange={(e) => setTrialFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Studies</option>
            {trials.map(t => (
              <option key={t.id} value={t.id}>{t.id}</option>
            ))}
          </select>

          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Sites</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.name.split(',')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Subject ID</th>
                <th className="py-2.5 px-3">Study ID</th>
                <th className="py-2.5 px-3">Participating Site</th>
                <th className="py-2.5 px-3">Randomized Treatment Arm</th>
                <th className="py-2.5 px-3">Screening</th>
                <th className="py-2.5 px-3">Enrollment</th>
                <th className="py-2.5 px-3">Last Visit Completed</th>
                <th className="py-2.5 px-3">Next Scheduled Visit</th>
                <th className="py-2.5 px-3 text-center">Adherence</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedParticipant(p)}>
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {p.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    <Link to={`/trials/${p.trialId}`} className="hover:underline hover:text-teal-700" onClick={(e) => e.stopPropagation()}>
                      {p.trialId}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">
                    {p.siteName}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs font-medium text-slate-900 truncate">
                    {p.randomizedArm}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={p.screeningStatus} size="xs" />
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={p.enrollmentStatus} size="xs" />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800 block">{p.lastVisitName}</span>
                    <span className="text-[10px] text-slate-400">{p.lastVisitDate}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-teal-800 block">{p.nextVisitName}</span>
                    <span className="text-[10px] text-teal-600 font-semibold">{p.nextVisitDate}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`font-bold ${p.adherenceRate >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {p.adherenceRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedParticipant(p);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal max-w-md w-full p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  De-Identified Participant Chart ({selectedParticipant.id})
                </h3>
                <p className="text-xs text-slate-400 font-mono">Study: {selectedParticipant.trialId}</p>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Demographics</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    Age: {selectedParticipant.age} yrs • Gender: {selectedParticipant.gender}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Site Assignment</span>
                  <p className="font-semibold text-slate-800 mt-0.5 truncate">
                    {selectedParticipant.siteName}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Treatment Arm</span>
                <p className="font-semibold text-teal-900 bg-teal-50 p-2 rounded border border-teal-200 mt-1">
                  {selectedParticipant.randomizedArm}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Baseline HbA1c</span>
                  <p className="text-base font-bold text-slate-800">{selectedParticipant.hbA1cBaseline}%</p>
                </div>
                <div className="p-2.5 rounded border border-emerald-200 bg-emerald-50/40">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold">Latest HbA1c (Week 24)</span>
                  <p className="text-base font-bold text-emerald-800">{selectedParticipant.hbA1cLatest}%</p>
                </div>
              </div>

              <div className="space-y-1 pt-1 text-slate-600">
                <p><strong>Randomization Date:</strong> {selectedParticipant.randomizationDate}</p>
                <p><strong>Protocol Compliance:</strong> {selectedParticipant.adherenceRate}% verification</p>
                <p><strong>Open Queries:</strong> {selectedParticipant.openQueriesCount}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

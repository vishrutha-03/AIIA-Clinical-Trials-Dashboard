import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  UserCheck,
  Check,
  Moon,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useTrials } from '../context/TrialsContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';

export default function RiskAlertsPage() {
  const navigate = useNavigate();
  const { isReadOnly } = useAuth();
  const { alerts, resolveAlert, snoozeAlert, assignAlert, showToast } = useTrials();

  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Open');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignModalAlert, setAssignModalAlert] = useState(null);
  const [assigneeInput, setAssigneeInput] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity =
      severityFilter === 'All' ||
      a.severity.toLowerCase() === severityFilter.toLowerCase() ||
      a.category.toLowerCase() === severityFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.trialId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignModalAlert || !assigneeInput) return;
    assignAlert(assignModalAlert.id, assigneeInput);
    setAssignModalAlert(null);
    setAssigneeInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Risk & Operational Alerts Centre
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
              {alerts.filter(a => a.status === 'Open').length} Open
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated clinical risk detection, safety triggers, regulatory deadlines & protocol deviation alerts
          </p>
        </div>
      </div>

      {/* Severity Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => { setSeverityFilter('Critical'); setStatusFilter('Open'); }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:shadow-card transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-red-800">Critical Alerts</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-700 mt-1">
            {alerts.filter(a => a.severity === 'critical' && a.status === 'Open').length}
          </p>
          <p className="text-[11px] text-red-600 font-medium">SAE & Regulatory Breaches</p>
        </div>

        <div
          onClick={() => { setSeverityFilter('High'); setStatusFilter('Open'); }}
          className="p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:shadow-card transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-800">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {alerts.filter(a => a.severity === 'high' && a.status === 'Open').length}
          </p>
          <p className="text-[11px] text-amber-600 font-medium">Recruitment Lag & Major Deviations</p>
        </div>

        <div
          onClick={() => { setSeverityFilter('Medium'); setStatusFilter('Open'); }}
          className="p-3 bg-sky-50 border border-sky-200 rounded-lg cursor-pointer hover:shadow-card transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-sky-800">Medium Risk</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-sky-700 mt-1">
            {alerts.filter(a => a.severity === 'medium' && a.status === 'Open').length}
          </p>
          <p className="text-[11px] text-sky-600 font-medium">Overdue Visits & Data Queries</p>
        </div>

        <div
          onClick={() => { setSeverityFilter('Low'); setStatusFilter('Open'); }}
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:shadow-card transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-800">Low / Informative</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {alerts.filter(a => a.severity === 'low' && a.status === 'Open').length}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Upcoming Milestones</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by title, study, description, or assigned personnel..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Snoozed">Snoozed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold">No alerts match your filter criteria.</p>
            <p className="text-xs text-slate-400">All trial signals are resolved or within nominal tolerance.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';
            const isOpen = alert.status === 'Open';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-lg border p-4 shadow-card transition-all hover:border-slate-300 ${
                  isCritical && isOpen
                    ? 'border-l-4 border-l-red-600 bg-red-50/10'
                    : isHigh && isOpen
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={alert.category} size="xs" />
                      <span className="font-mono text-xs font-bold text-teal-800">{alert.trialId}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-600">{alert.trialShort}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">{alert.date}</span>
                      <span className="ml-auto lg:ml-2">
                        <StatusBadge status={alert.status} size="xs" />
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alert.description}
                    </p>

                    {alert.recommendedAction && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                        <strong className="text-slate-900 shrink-0">Protocol Recommendation:</strong>
                        <span>{alert.recommendedAction}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Responsible Role: <strong className="text-slate-800 uppercase">{alert.responsibleRole}</strong></span>
                      <span>Assigned To: <strong className="text-slate-800">{alert.assignedTo || 'Unassigned'}</strong></span>
                      {alert.dueInHours && isOpen && (
                        <span className="text-red-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Target Resolution Window: {alert.dueInHours}h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/trials/${alert.trialId}`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1 w-full justify-center transition-colors"
                    >
                      <span>View Study</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {isOpen && !isReadOnly && (
                      <>
                        <button
                          onClick={() => resolveAlert(alert.id, 'Action verified by user')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 w-full justify-center transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>

                        <button
                          onClick={() => snoozeAlert(alert.id, 24)}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1 w-full justify-center transition-colors"
                        >
                          <Moon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Snooze 24h</span>
                        </button>

                        <button
                          onClick={() => {
                            setAssignModalAlert(alert);
                            setAssigneeInput(alert.assignedTo || '');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1 w-full justify-center transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>Assign</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Modal */}
      {assignModalAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Reassign Alert Responsibility
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Designate clinical investigator or coordinator for {assignModalAlert.id}
            </p>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Assignee Name</label>
                <input
                  type="text"
                  required
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalAlert(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

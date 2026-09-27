import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FlaskConical,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  TrendingDown,
  Info,
  Check,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useTrials } from '../context/TrialsContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import HealthScoreGauge from '../components/common/HealthScoreGauge';

export default function TrialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isReadOnly } = useAuth();
  const {
    getTrialWithHealth,
    sites,
    deviations,
    queries,
    documents,
    resolveAlert,
    resolveQuery,
    updateTrialStatus,
    updateTrialEnrollment,
    showToast
  } = useTrials();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSiteModal, setSelectedSiteModal] = useState(null);

  const trial = getTrialWithHealth(id || 'AYU-2026-004');

  if (!trial) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Study Not Found</h2>
        <p className="text-xs text-slate-500">The requested clinical trial ID {id} does not exist in the registry.</p>
        <button
          onClick={() => navigate('/trials')}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold"
        >
          Return to Trials Registry
        </button>
      </div>
    );
  }

  const computedHealth = trial.computedHealth;
  const breakdown = computedHealth?.breakdown || trial.scoreBreakdown;

  // Filter trial specific sub-records
  const trialDeviations = deviations.filter(d => d.trialId === trial.id);
  const trialQueries = queries.filter(q => q.trialId === trial.id);
  const trialDocs = documents.filter(d => d.trialId === trial.id);
  const trialSites = sites.filter(s => trial.siteIds?.includes(s.id));

  // Funnel data for recruitment tab
  const recruitmentFunnel = [
    { stage: 'Screened', count: trial.screenedCount || 680, fill: '#64748B' },
    { stage: 'Eligible', count: trial.eligibleCount || 495, fill: '#0EA5E9' },
    { stage: 'Randomized', count: trial.randomizedCount || 428, fill: '#0D9488' },
    { stage: 'Completed', count: trial.completedCount || 264, fill: '#10B981' },
    { stage: 'Dropouts', count: trial.dropoutCount || 22, fill: '#EF4444' }
  ];

  const handleActionClick = (action) => {
    if (action.actionCode === 'RECRUITMENT_AUDIT') {
      showToast('Recruitment audit notification dispatched to lead site coordinators.', 'info');
      navigate('/risk-alerts');
    } else if (action.actionCode === 'DISPATCH_MONITOR') {
      showToast('CRA Monitoring visit notices dispatched to ITRA Jamnagar and BHU Varanasi.', 'info');
      navigate('/sites');
    } else if (action.actionCode === 'CTRI_UPDATE') {
      showToast('Redirecting to Regulatory & Ethics module for CTRI Form 6 submission...', 'info');
      navigate('/regulatory-ethics');
    } else {
      showToast(`Action executed: ${action.title}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/trials')}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
            title="Back to trials list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                {trial.id}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">{trial.phase}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">{trial.ctriNumber}</span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mt-0.5">
              {trial.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isReadOnly && (
            <>
              <button
                onClick={() => updateTrialEnrollment(trial.id, 1)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                title="Simulate subject enrollment"
              >
                + Log Enrollment
              </button>
              <button
                onClick={() => {
                  const newStatus = trial.status === 'Active' ? 'Monitoring' : 'Active';
                  updateTrialStatus(trial.id, newStatus);
                }}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Change Status
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/reports-exports')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CDISC / FHIR</span>
          </button>
        </div>
      </div>

      {/* Trial Header Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Principal Investigator</p>
          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{trial.piName}</p>
          <p className="text-[10px] text-slate-500 truncate">{trial.leadInstitution}</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Recruitment Progress</p>
          <p className="text-xs font-bold text-slate-900 mt-0.5">
            {trial.currentEnrollment} <span className="font-normal text-slate-400">/ {trial.targetEnrollment}</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full"
                style={{ width: `${Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-teal-700">
              {Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Participating Sites</p>
          <p className="text-xs font-bold text-slate-900 mt-0.5">{trial.participatingSitesCount} Active Centres</p>
          <p className="text-[10px] text-amber-600 font-semibold">2 overdue monitoring</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">CTRI Status</p>
          <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono truncate">{trial.ctriNumber}</p>
          <p className="text-[10px] font-semibold text-amber-700">{trial.ctriStatus}</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Ethics (IEC) Clearance</p>
          <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{trial.iecStatus}</p>
          <p className="text-[10px] text-slate-500">Expires: {trial.iecExpiryDate}</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Overall Study Status</p>
          <div className="mt-1 flex items-center gap-1.5">
            <StatusBadge status={trial.status} size="xs" />
            <StatusBadge status={trial.riskLevel} size="xs" />
          </div>
        </div>
      </div>

      {/* SECTION 9: EXPLAINABLE TRIAL HEALTH SCORE & RISK ENGINE */}
      <div className="bg-white rounded-xl border-2 border-red-200 shadow-card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
          Explainable AI / Rule Engine
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <HealthScoreGauge
              score={trial.healthScore}
              riskTier={computedHealth?.riskTier || 'AT RISK'}
              size="lg"
            />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Transparent Rule-Based Health Computation
              </h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Score dynamically calculated across 6 verified operational dimensions (Recruitment, Regulatory, Sites, Data Quality, Deviations, Safety).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => navigate('/risk-alerts')}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review 3 Triggered Alerts</span>
            </button>
          </div>
        </div>

        {/* Contributing Factors Grid (Progress Bars) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Recruitment</span>
              <span className="text-xs font-black text-red-700">{breakdown?.recruitment || 62}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${breakdown?.recruitment || 62}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 25%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Regulatory</span>
              <span className="text-xs font-black text-emerald-700">{breakdown?.regulatory || 91}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown?.regulatory || 91}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 20%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Sites</span>
              <span className="text-xs font-black text-amber-700">{breakdown?.sitePerformance || 74}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown?.sitePerformance || 74}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 20%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Data Quality</span>
              <span className="text-xs font-black text-teal-700">{breakdown?.dataQuality || 81}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${breakdown?.dataQuality || 81}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 15%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Deviations</span>
              <span className="text-xs font-black text-amber-700">{breakdown?.protocolDeviations || 68}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown?.protocolDeviations || 68}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 10%</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-bold text-slate-700">Safety / SAE</span>
              <span className="text-xs font-black text-emerald-700">{breakdown?.safety || 95}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown?.safety || 95}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Weight: 10%</p>
          </div>
        </div>

        {/* Explainability Breakdown: Why is this trial at risk? & Recommended Actions */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          {/* Why is this trial at risk? */}
          <div className="bg-red-50/50 rounded-lg p-3.5 border border-red-200/80">
            <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Why is this trial at risk?
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-900">Enrollment is 18% below target trajectory:</strong>
                  <span className="text-slate-600 block text-[11px]">
                    Projected 522 participants enrolled by Month 9; current enrollment stands at 428 across 8 centres.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-900">Two monitoring visits are overdue:</strong>
                  <span className="text-slate-600 block text-[11px]">
                    Site-03 (ITRA Jamnagar) is 14 days overdue and Site-04 (BHU Varanasi) is 6 days overdue for routine CRA source data verification.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-900">CTRI update due in 5 days:</strong>
                  <span className="text-slate-600 block text-[11px]">
                    Mandatory 6-monthly progress report update window expires on October 02, 2026.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="bg-teal-50/50 rounded-lg p-3.5 border border-teal-200/80 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Recommended Corrective Actions
              </h4>
              <div className="space-y-2">
                {trial.recommendedActions && trial.recommendedActions.length > 0 ? (
                  trial.recommendedActions.map((action, i) => (
                    <div
                      key={action.id || i}
                      className="flex items-center justify-between p-2 rounded bg-white border border-teal-200/60 shadow-2xs text-xs"
                    >
                      <span className="text-slate-800 font-medium truncate pr-2">{action.title}</span>
                      <button
                        onClick={() => handleActionClick(action)}
                        className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold shrink-0 transition-colors"
                      >
                        {action.actionLabel || 'Execute'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-teal-200/60 text-xs">
                      <span className="text-slate-800 font-medium">Review recruitment strategy with lagging sites</span>
                      <button
                        onClick={() => handleActionClick({ actionCode: 'RECRUITMENT_AUDIT', title: 'Recruitment Audit' })}
                        className="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-semibold"
                      >
                        Initiate Review
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-teal-200/60 text-xs">
                      <span className="text-slate-800 font-medium">Schedule overdue monitoring visits for Site 03 & 04</span>
                      <button
                        onClick={() => handleActionClick({ actionCode: 'DISPATCH_MONITOR', title: 'Schedule Visit' })}
                        className="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-semibold"
                      >
                        Dispatch CRA
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-teal-200/60 text-xs">
                      <span className="text-slate-800 font-medium">Complete and submit CTRI progress report update</span>
                      <button
                        onClick={() => handleActionClick({ actionCode: 'CTRI_UPDATE', title: 'CTRI Update' })}
                        className="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-semibold"
                      >
                        Submit CTRI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Action resolutions automatically re-evaluate risk scores and append entries to immutable audit log.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-lg shadow-2xs">
        <div className="flex overflow-x-auto no-scrollbar px-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'timeline', label: 'Milestone Timeline' },
            { id: 'recruitment', label: 'Recruitment' },
            { id: 'sites', label: `Sites (${trialSites.length})` },
            { id: 'visits', label: 'Visits' },
            { id: 'deviations', label: `Protocol Deviations (${trialDeviations.length})` },
            { id: 'dataQuality', label: `Data Quality (${trialQueries.length})` },
            { id: 'documents', label: `Documents (${trialDocs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-800 bg-teal-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Study Objective</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  To evaluate the clinical efficacy, glycemic control, safety, and insulin-sensitizing effects of standardized Ayurvedic Formulation X (Nishamalaki & Mehamudgara Vati) compared with active standard care (Metformin) in subjects with Type 2 Diabetes Mellitus.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Investigational Intervention</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {trial.intervention}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Comparator</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {trial.comparator}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Study Population</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {trial.population}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Study Design Architecture</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {trial.studyDesign}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Efficacy Endpoint</h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {trial.primaryEndpoint}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Start Date</span>
              <strong className="text-slate-800">{trial.startDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Expected Completion</span>
              <strong className="text-slate-800">{trial.expectedCompletion}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">NDCT Rules Status</span>
              <strong className="text-emerald-700">{trial.ndctApplicability}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Last Regulatory Audit</span>
              <strong className="text-slate-800">{trial.lastUpdated}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Clinical Trial Lifecycle Flow</h3>
            <p className="text-xs text-slate-500">
              Protocol → IEC Approval → CTRI Registration → Site Activation → Recruitment → Monitoring → Close-out
            </p>
          </div>

          {/* Visual Step-by-Step Horizontal Lifecycle */}
          <div className="py-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div className="absolute top-1/2 left-0 w-4/6 h-1 bg-teal-600 -translate-y-1/2 z-0" />

              {[
                { label: 'Protocol', status: 'completed', date: 'Oct 2025' },
                { label: 'IEC Approval', status: 'completed', date: 'Nov 2025' },
                { label: 'CTRI Registration', status: 'completed', date: 'Jan 2026' },
                { label: 'Site Activation', status: 'completed', date: 'Jan 2026' },
                { label: 'Recruitment', status: 'current', date: 'Feb - Dec 2026' },
                { label: 'Monitoring', status: 'current', date: 'Active' },
                { label: 'Close-out', status: 'pending', date: 'Apr 2027' }
              ].map((step, idx) => (
                <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                      step.status === 'completed'
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                        : step.status === 'current'
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-white text-slate-400 border-2 border-slate-300'
                    }`}
                  >
                    {step.status === 'completed' ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="font-bold text-xs text-slate-900 mt-2">{step.label}</span>
                  <span className="text-[10px] text-slate-400">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Milestones Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Milestone Key</th>
                  <th className="py-2.5 px-3">Stage Title</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Completion Date</th>
                  <th className="py-2.5 px-3">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">M-01</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Protocol Scientific Review & Finalization</td>
                  <td className="py-2.5 px-3 text-slate-600">2025-10-15</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">2025-10-12</td>
                  <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">M-02</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Institutional Ethics Committee (IEC) Clearance</td>
                  <td className="py-2.5 px-3 text-slate-600">2025-11-20</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">2025-11-15</td>
                  <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">M-03</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">CTRI Registration & Clinical Trial Clearance</td>
                  <td className="py-2.5 px-3 text-slate-600">2026-01-10</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">2026-01-08</td>
                  <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">M-04</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Multicenter Site Initiation Visits (8 Centres)</td>
                  <td className="py-2.5 px-3 text-slate-600">2026-01-25</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">2026-01-22</td>
                  <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-red-50/20">
                  <td className="py-2.5 px-3 font-mono font-bold text-red-700">M-07</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Full Enrollment Target (550 Participants)</td>
                  <td className="py-2.5 px-3 text-slate-600">2026-11-30</td>
                  <td className="py-2.5 px-3 text-slate-400">In Progress (428 / 550)</td>
                  <td className="py-2.5 px-3"><StatusBadge status="At Risk" size="xs" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Recruitment */}
      {activeTab === 'recruitment' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target</span>
              <p className="text-xl font-extrabold text-slate-900">{trial.targetEnrollment}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Screened</span>
              <p className="text-xl font-extrabold text-slate-700">{trial.screenedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Eligible</span>
              <p className="text-xl font-extrabold text-sky-700">{trial.eligibleCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-700">Randomized</span>
              <p className="text-xl font-extrabold text-teal-800">{trial.randomizedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Completed</span>
              <p className="text-xl font-extrabold text-emerald-800">{trial.completedCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
              <span className="text-[10px] uppercase font-bold text-red-700">Dropouts</span>
              <p className="text-xl font-extrabold text-red-800">{trial.dropoutCount}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Clinical Trial Recruitment Funnel
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recruitmentFunnel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="stage" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#0D9488" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sites */}
      {activeTab === 'sites' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Multicenter Trial Participating Sites</h3>
              <p className="text-xs text-slate-500">Site performance, monitoring status, source data verification, and quality rating</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Site ID</th>
                  <th className="py-2.5 px-3">Centre Name</th>
                  <th className="py-2.5 px-3">Site PI</th>
                  <th className="py-2.5 px-3 text-right">Participants</th>
                  <th className="py-2.5 px-3">Monitoring Status</th>
                  <th className="py-2.5 px-3 text-center">Data Quality</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialSites.map((site) => {
                  const pct = Math.round((site.enrolledCount / site.targetCount) * 100);
                  const isOverdue = site.monitoringStatus?.includes('Overdue');

                  return (
                    <tr
                      key={site.id}
                      onClick={() => navigate('/sites')}
                      className={`hover:bg-slate-50 cursor-pointer ${isOverdue ? 'bg-amber-50/20' : ''}`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{site.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{site.name}</td>
                      <td className="py-2.5 px-3 text-slate-700">{site.piName}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold">{site.enrolledCount}</span>
                        <span className="text-slate-400"> / {site.targetCount} ({pct}%)</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={site.monitoringStatus} size="xs" />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold ${site.dataQualityScore >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {site.dataQualityScore}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={site.riskLevel} size="xs" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Visits */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Visits</span>
              <p className="text-2xl font-black text-slate-800">3,120</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Completed Visits</span>
              <p className="text-2xl font-black text-emerald-800">2,842 (91.1%)</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700">Missed Visits</span>
              <p className="text-2xl font-black text-amber-800">148</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
              <span className="text-[10px] uppercase font-bold text-red-700">Overdue Visits</span>
              <p className="text-2xl font-black text-red-800">44</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recent Clinical Participant Visits
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Visit ID</th>
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3">Site</th>
                    <th className="py-2.5 px-3">Visit Protocol</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">VIS-901</td>
                    <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold">P-1001</td>
                    <td className="py-2.5 px-3">AIIA New Delhi</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">Visit 8 (Week 32)</td>
                    <td className="py-2.5 px-3 text-slate-600">2026-09-15</td>
                    <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">VIS-902</td>
                    <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold">P-1002</td>
                    <td className="py-2.5 px-3">AIIA New Delhi</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">Visit 8 (Week 32)</td>
                    <td className="py-2.5 px-3 text-slate-600">2026-09-18</td>
                    <td className="py-2.5 px-3"><StatusBadge status="Completed" size="xs" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-red-50/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-red-700">VIS-904</td>
                    <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold">P-1005</td>
                    <td className="py-2.5 px-3">ITRA Jamnagar</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">Visit 7 (Week 28)</td>
                    <td className="py-2.5 px-3 text-slate-600">2026-09-25</td>
                    <td className="py-2.5 px-3"><StatusBadge status="Overdue" size="xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Protocol Deviations */}
      {activeTab === 'deviations' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Protocol Deviations Log</h3>
              <p className="text-xs text-slate-500">Documented GCP deviations, severity classifications, and corrective actions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Deviation ID</th>
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3">Site</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description & Resolution</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialDeviations.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{dev.id}</td>
                    <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold">{dev.participantId}</td>
                    <td className="py-2.5 px-3 text-slate-700">{dev.siteName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{dev.category}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={dev.severity} size="xs" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{dev.date}</td>
                    <td className="py-2.5 px-3 max-w-sm">
                      <p className="text-slate-800 font-medium">{dev.description}</p>
                      {dev.resolutionNote && (
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          ✓ {dev.resolutionNote}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={dev.resolutionStatus} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Data Quality */}
      {activeTab === 'dataQuality' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Completeness</span>
              <p className="text-2xl font-black text-slate-800">98.4%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
              <span className="text-[10px] uppercase font-bold text-red-700">Open Queries</span>
              <p className="text-2xl font-black text-red-800">{trialQueries.filter(q => q.status === 'Open').length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Resolved Queries</span>
              <p className="text-2xl font-black text-emerald-800">{trialQueries.filter(q => q.status === 'Resolved').length}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-center">
              <span className="text-[10px] uppercase font-bold text-teal-700">Validation Score</span>
              <p className="text-2xl font-black text-teal-800">{breakdown?.dataQuality || 81}%</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Active eCRF Discrepancy Queries
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Query ID</th>
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3">Site</th>
                    <th className="py-2.5 px-3">Form & Field</th>
                    <th className="py-2.5 px-3">Query Text</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trialQueries.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{q.id}</td>
                      <td className="py-2.5 px-3 font-mono text-teal-800 font-semibold">{q.participantId}</td>
                      <td className="py-2.5 px-3 text-slate-700">{q.siteName}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 block">{q.formName}</span>
                        <span className="text-slate-500 text-[11px]">{q.field}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs">{q.queryText}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={q.status} size="xs" />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {q.status !== 'Resolved' && !isReadOnly && (
                          <button
                            onClick={() => resolveQuery(q.id, 'Verified decimal precision with hospital biochemistry sheet')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Resolve Query
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
      )}

      {/* Tab 8: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trial Master File (TMF) Regulatory Documents</h3>
              <p className="text-xs text-slate-500">Versioned protocol, IEC approvals, CTRI certifications, and monitoring logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trialDocs.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">v{doc.version}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Approved: {doc.approvalDate} • Verified by: {doc.verifiedBy}
                  </p>
                </div>
                <button
                  onClick={() => showToast(`Mock Document Downloaded: ${doc.name}`, 'info')}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                  title="Download document copy"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

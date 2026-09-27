import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  FileCheck2,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useTrials } from '../context/TrialsContext';
import {
  ENROLLMENT_TREND_DATA,
  TRIAL_HEALTH_DISTRIBUTION,
  PORTFOLIO_ENROLLMENT_BARS
} from '../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    trials,
    alerts,
    milestones,
    portfolioMetrics,
    resolveAlert
  } = useTrials();

  const role = currentUser?.role || 'pi';

  // Filter open alerts for the dashboard
  const openAlerts = alerts.filter(a => a.status === 'Open').slice(0, 6);

  // Filter upcoming milestones
  const upcomingMilestones = milestones.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Research Portfolio
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
              Live Monitor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AIIA Clinical Trials Management System • All India Institute of Ayurveda
          </p>
        </div>

        {/* Role-Specific Focus Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-2 text-xs">
            <span className="text-slate-400">Viewing as:</span>
            <span className="font-bold text-slate-800">{currentUser?.roleLabel}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </div>
          <button
            onClick={() => navigate('/trials/AYU-2026-004')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <span>Open Featured Study (AYU-004)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Role-Based Intelligence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 rounded-xl p-4 text-white shadow-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {role === 'pi' && 'Principal Investigator View'}
              {role === 'coordinator' && 'Study Coordinator Center'}
              {role === 'monitor' && 'Clinical Monitor Workspace'}
              {role === 'ethics' && 'Ethics & Regulatory Secretariat'}
              {role === 'pv' && 'Pharmacovigilance Dashboard'}
              {role === 'admin' && 'Enterprise Administration'}
              {role === 'regulator' && 'Regulatory Audit Authority (Read-Only)'}
            </span>
            <span className="text-xs text-slate-300">
              {role === 'pi' && 'Primary Focus: Trial Health, Recruitment Targets, Protocol Deviations & Overdue Actions'}
              {role === 'coordinator' && 'Primary Focus: Participant Adherence, Visits, Screening & Data Queries'}
              {role === 'monitor' && 'Primary Focus: Site Performance, CRA Monitoring Visits & Source Data Verification'}
              {role === 'ethics' && 'Primary Focus: IEC Approvals, Expirations, CTRI Compliance & Annual Renewals'}
              {role === 'pv' && 'Primary Focus: SAE Adjudication, MedDRA Coding & ASU&H Safety Signal Surveillance'}
              {role === 'admin' && 'Primary Focus: System Health, RBAC Provisioning & Enterprise Audit Logging'}
              {role === 'regulator' && 'Primary Focus: CDSCO/NDCT Rules 2019, GCP-ASU & ALCOA+ Regulatory Oversight'}
            </span>
          </div>
          <p className="text-xs text-slate-200">
            {role === 'pi' && 'Attention: Trial AYU-2026-004 is currently AT RISK (Score 72) due to recruitment lag and overdue monitoring.'}
            {role === 'coordinator' && 'Attention: 44 overdue participant visits across ITRA Jamnagar and BHU Varanasi require immediate scheduling.'}
            {role === 'monitor' && 'Attention: Site-03 (ITRA Jamnagar) is 14 days overdue for CRA Cycle 4 routine monitoring visit.'}
            {role === 'ethics' && 'Attention: Site-01 IEC approval renewal for AYU-2026-002 is due in 9 days (Oct 04, 2026).'}
            {role === 'pv' && 'Attention: SAE-2026-007 (Severe Hypoglycemia) requires expedited PI sign-off within 24 hours.'}
            {role === 'admin' && 'All 8 multicenter nodes reporting healthy encrypted REST telemetry. Audit trail immutable.'}
            {role === 'regulator' && 'Read-only verified access granted. 12 active Ayurvedic clinical studies registered under CTRI.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/risk-alerts')}
          className="self-start md:self-center shrink-0 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-red-500/50"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{portfolioMetrics.trialsAtRisk} Trials At Risk</span>
        </button>
      </div>

      {/* Top 7 Enterprise KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <KpiCard
          title="Active Trials"
          value={portfolioMetrics.activeTrials}
          subtitle="12 registered studies"
          icon={FlaskConical}
          status="primary"
          onClick={() => navigate('/trials')}
        />
        <KpiCard
          title="Active Sites"
          value={portfolioMetrics.activeSites}
          subtitle="Multicentre network"
          icon={Building2}
          status="normal"
          onClick={() => navigate('/sites')}
        />
        <KpiCard
          title="Total Participants"
          value={portfolioMetrics.totalParticipants.toLocaleString()}
          subtitle="Target: 1,830"
          icon={Users}
          trend="+8.4%"
          trendDirection="up"
          status="normal"
          onClick={() => navigate('/participants')}
        />
        <KpiCard
          title="Enrollment Rate"
          value={`${portfolioMetrics.enrollmentRate}%`}
          subtitle="Portfolio average"
          icon={TrendingUp}
          trend="-4.2%"
          trendDirection="down"
          status={portfolioMetrics.enrollmentRate < 80 ? 'warning' : 'success'}
        />
        <KpiCard
          title="Trials At Risk"
          value={portfolioMetrics.trialsAtRisk}
          subtitle="Action required"
          icon={AlertTriangle}
          status="danger"
          onClick={() => navigate('/risk-alerts')}
        />
        <KpiCard
          title="Open Safety Reports"
          value={portfolioMetrics.openSafetyReports}
          subtitle="1 SAE under review"
          icon={ShieldAlert}
          status="warning"
          onClick={() => navigate('/pharmacovigilance')}
        />
        <KpiCard
          title="Upcoming Deadlines"
          value={portfolioMetrics.upcomingDeadlines}
          subtitle="Within 30 days"
          icon={Clock}
          status="normal"
          onClick={() => navigate('/regulatory-ethics')}
        />
      </div>

      {/* Charts Row: Enrollment Trend & Trial Health Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Planned vs Actual Enrollment */}
        <div className="lg:col-span-2 bg-white rounded-lg p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Portfolio Enrollment Trajectory</h2>
              <p className="text-xs text-slate-500">Planned vs actual cumulative participant enrollment (2026 YTD)</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Monthly Cadence
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ENROLLMENT_TREND_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 2000]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="planned"
                  name="Planned Protocol Target"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Enrolled"
                  stroke="#0D9488"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Current Gap: <strong>402 participants behind schedule (21.9% variance)</strong></span>
            <span className="text-teal-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/participants')}>
              Drill down by study →
            </span>
          </div>
        </div>

        {/* Donut Chart: Trial Health Distribution */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Trial Health Distribution</h2>
              <span className="text-xs text-slate-400">12 Studies</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Rule-engine composite risk classification</p>

            <div className="h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRIAL_HEALTH_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {TRIAL_HEALTH_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">12</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Trials</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {TRIAL_HEALTH_DISTRIBUTION.map(item => (
                <div key={item.name} className="flex items-center gap-2 p-1.5 rounded bg-slate-50 border border-slate-100 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 text-[11px] font-medium">{item.name}</span>
                  <span className="ml-auto font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/risk-alerts')}
            className="mt-4 w-full py-1.5 text-xs text-red-700 font-semibold bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
          >
            Review 3 At-Risk Trials & Factors
          </button>
        </div>
      </div>

      {/* Bar Chart: Trial Portfolio Enrollment Distribution */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Study Portfolio Recruitment Performance</h2>
            <p className="text-xs text-slate-500">Enrolled participants vs protocol target across all 12 registered studies</p>
          </div>
          <span className="text-xs text-slate-500">
            Click any bar to open study workspace
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PORTFOLIO_ENROLLMENT_BARS}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onClick={(state) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const item = state.activePayload[0].payload;
                  navigate('/trials/AYU-2026-004');
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="shortName" stroke="#94A3B8" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" height={45} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = Math.round((data.enrolled / data.target) * 100);
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-modal border border-slate-700">
                        <p className="font-bold text-teal-300">{data.trial}: {data.shortName}</p>
                        <p className="mt-1">Enrolled: <strong>{data.enrolled}</strong> / {data.target} ({pct}%)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click to view study workspace</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="enrolled" radius={[4, 4, 0, 0]}>
                {PORTFOLIO_ENROLLMENT_BARS.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} cursor="pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Recent Alerts & Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-card flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900">Active Operational & Clinical Alerts</h2>
            </div>
            <button
              onClick={() => navigate('/risk-alerts')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All ({openAlerts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-96 divide-y divide-slate-100">
            {openAlerts.map(alert => (
              <div key={alert.id} className="pt-3 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={alert.category} size="xs" />
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{alert.trialId}</span>
                      <span className="text-[11px] text-slate-400">• {alert.date.split(' ')[0]}</span>
                    </div>
                    <h4
                      onClick={() => navigate(`/trials/${alert.trialId}`)}
                      className="text-xs font-bold text-slate-900 hover:text-teal-700 cursor-pointer"
                    >
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => resolveAlert(alert.id, 'Resolved from portfolio dashboard')}
                      className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => navigate(`/trials/${alert.trialId}`)}
                      className="text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-card flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Upcoming Trial Milestones</h2>
            </div>
            <button
              onClick={() => navigate('/milestones')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Milestones Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="pb-2">Study</th>
                  <th className="pb-2">Milestone</th>
                  <th className="pb-2">Target Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingMilestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-mono font-semibold text-slate-700">{m.trialId}</td>
                    <td className="py-2.5 font-medium text-slate-900 pr-2">{m.title}</td>
                    <td className="py-2.5 text-slate-600 whitespace-nowrap">{m.dueDate}</td>
                    <td className="py-2.5">
                      <StatusBadge status={m.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

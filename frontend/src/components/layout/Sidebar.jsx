import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  Building2,
  CalendarCheck2,
  ShieldAlert,
  FileCheck2,
  Database,
  AlertTriangle,
  FileSpreadsheet,
  History,
  Network,
  Lock,
  UserCog,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrials } from '../../context/TrialsContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, canAccessModule } = useAuth();
  const { alerts, queries, aeReports } = useTrials();

  // Active unaddressed counts for badge highlights
  const openAlertsCount = alerts.filter(a => a.status === 'Open').length;
  const openQueriesCount = queries.filter(q => q.status === 'Open').length;
  const underReviewAeCount = aeReports.filter(a => a.reviewStatus === 'Under Review').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'trials', label: 'Clinical Trials', path: '/trials', icon: FlaskConical },
    { id: 'participants', label: 'Participants', path: '/participants', icon: Users },
    { id: 'sites', label: 'Sites & Monitoring', path: '/sites', icon: Building2 },
    { id: 'milestones', label: 'Milestones', path: '/milestones', icon: CalendarCheck2 },
    {
      id: 'pv',
      label: 'Pharmacovigilance',
      path: '/pharmacovigilance',
      icon: ShieldAlert,
      badge: underReviewAeCount > 0 ? underReviewAeCount : null,
      badgeColor: 'bg-purple-600'
    },
    { id: 'regulatory', label: 'Regulatory & Ethics', path: '/regulatory-ethics', icon: FileCheck2 },
    {
      id: 'dataQuality',
      label: 'Data Quality',
      path: '/data-quality',
      icon: Database,
      badge: openQueriesCount > 0 ? openQueriesCount : null,
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'riskAlerts',
      label: 'Risk & Alerts',
      path: '/risk-alerts',
      icon: AlertTriangle,
      badge: openAlertsCount > 0 ? openAlertsCount : null,
      badgeColor: 'bg-red-600'
    },
    { id: 'reports', label: 'Reports & Exports', path: '/reports-exports', icon: FileSpreadsheet },
    { id: 'auditTrail', label: 'Audit Trail', path: '/audit-trail', icon: History },
    { id: 'interoperability', label: 'Interoperability', path: '/interoperability', icon: Network },
    { id: 'security', label: 'Security & Compliance', path: '/security-compliance', icon: Lock },
    { id: 'users', label: 'Users & Roles', path: '/users-roles', icon: UserCog },
    { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0 border border-teal-500/50">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">AIIA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  CTMS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate">All India Institute of Ayurveda</p>
              <p className="text-[11px] text-teal-400 font-medium truncate">Clinical Research Platform</p>
            </div>
          </div>
        </div>

        {/* Current User Role Banner in Sidebar */}
        <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Role</p>
            <p className="text-xs font-semibold text-teal-300 truncate">{currentUser?.roleLabel || 'Guest'}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const hasAccess = canAccessModule(item.id);
            if (!hasAccess) return null;

            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-teal-400" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Compliance Footer Tag */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              GCP-ASU & NDCT
            </span>
            <span className="text-[10px] text-slate-400 font-mono">v2.4-PROD</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Designed to support ICMR 2017 & 21 CFR Part 11 requirements
          </p>
        </div>
      </aside>
    </>
  );
}

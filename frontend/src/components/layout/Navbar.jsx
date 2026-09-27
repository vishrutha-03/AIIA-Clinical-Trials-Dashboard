import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Check,
  Building,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrials } from '../../context/TrialsContext';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRole, logout, usersList } = useAuth();
  const { alerts, globalSearch, setGlobalSearch } = useTrials();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const openAlertsCount = alerts.filter(a => a.status === 'Open').length;
  const criticalCount = alerts.filter(a => a.status === 'Open' && a.severity === 'critical').length;

  // Compute breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);

  const formatBreadcrumb = (part) => {
    if (part.startsWith('AYU-')) return part;
    return part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleRoleSelect = (roleKey) => {
    switchRole(roleKey);
    setRoleMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900 font-medium">AIIA CTMS</Link>
              {pathParts.length > 0 && <span className="text-slate-400">/</span>}
              {pathParts.map((part, index) => {
                const url = `/${pathParts.slice(0, index + 1).join('/')}`;
                const isLast = index === pathParts.length - 1;
                return (
                  <React.Fragment key={url}>
                    {isLast ? (
                      <span className="font-semibold text-slate-900">{formatBreadcrumb(part)}</span>
                    ) : (
                      <Link to={url} className="hover:text-slate-900">{formatBreadcrumb(part)}</Link>
                    )}
                    {!isLast && <span className="text-slate-400">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                title="Switch Demo Role (RBAC)"
              >
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-medium hidden md:inline">Role:</span>
                <span className="font-bold text-teal-800">{currentUser?.roleLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-modal border border-slate-200 py-1 z-50 animate-in fade-in-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Switch Active RBAC Role
                  </div>
                  {usersList.map((user) => {
                    const isSelected = currentUser?.role === user.role;
                    return (
                      <button
                        key={user.role}
                        onClick={() => handleRoleSelect(user.role)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-teal-50/70 font-semibold text-teal-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{user.roleLabel}</div>
                          <div className="text-[10px] text-slate-400">{user.email}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Clinical Notifications"
            >
              <Bell className="w-4 h-4" />
              {openAlertsCount > 0 && (
                <span className={`absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-white ${criticalCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-amber-500'}`}>
                  {openAlertsCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-teal-500/30">
                  {currentUser?.avatar || 'AI'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-none">{currentUser?.name?.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{currentUser?.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-modal border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <p className="text-[10px] text-teal-700 font-medium mt-0.5">{currentUser?.department}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>User Profile & Security</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}

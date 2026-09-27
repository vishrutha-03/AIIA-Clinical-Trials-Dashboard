import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Key,
  CheckCircle2,
  Save,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrials } from '../context/TrialsContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useTrials();

  const [notifications, setNotifications] = useState({
    criticalSae: true,
    recruitmentLag: true,
    ctriDeadlines: true,
    monitoringOverdue: true,
    dailyDigest: false
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('User preferences and security settings saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your clinical credentials, alert notifications, and security sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg shadow-2xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'profile'
              ? 'border-teal-600 text-teal-800 bg-teal-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Role</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'notifications'
              ? 'border-teal-600 text-teal-800 bg-teal-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notification Preferences</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'security'
              ? 'border-teal-600 text-teal-800 bg-teal-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center ring-4 ring-teal-500/20">
              {currentUser?.avatar || 'AI'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{currentUser?.name}</h2>
              <p className="text-xs text-teal-700 font-semibold">{currentUser?.roleLabel}</p>
              <p className="text-[11px] text-slate-400">{currentUser?.institution}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser?.name}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Institutional Email</label>
              <input
                type="email"
                disabled
                defaultValue={currentUser?.email}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Department / Division</label>
              <input
                type="text"
                defaultValue={currentUser?.department}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Contact Phone</label>
              <input
                type="text"
                defaultValue={currentUser?.phone || '+91 11 2695 0400'}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Clinical Alert Triggers & Routing</h2>
          <p className="text-xs text-slate-500">
            Configure automated alerts dispatched by the Explainable Risk Engine
          </p>

          <div className="space-y-3 pt-2">
            {[
              { key: 'criticalSae', title: 'Critical SAE & Expedited Safety Reports', desc: 'Instant priority notification when an unexpected SAE is logged by a study site' },
              { key: 'recruitmentLag', title: 'Recruitment Milestone Lag Triggers (>15% variance)', desc: 'Alert when actual participant enrollment falls behind protocol trajectory' },
              { key: 'ctriDeadlines', title: 'CTRI 6-Monthly Progress Update Reminders', desc: 'Early warning dispatched 14 days and 5 days prior to statutory window close' },
              { key: 'monitoringOverdue', title: 'Overdue Monitoring Visits (>7 days past interval)', desc: 'Notifications for CRA Source Data Verification scheduling lag' },
              { key: 'dailyDigest', title: 'Daily Portfolio Clinical Research Summary', desc: 'Consolidated end-of-day summary email with open queries and enrollment count' },
            ].map(item => (
              <label key={item.key} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="h-4 w-4 mt-0.5 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block">{item.title}</strong>
                  <span className="text-slate-500">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-b-lg border border-slate-200 p-6 shadow-card space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Authentication & Session Security</h2>
            <p className="text-xs text-slate-500">
              Active login session authenticated through JWT with 21 CFR Part 11 electronic signature policy
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-slate-600" />
                <div>
                  <strong className="text-slate-900 block">Current Web Session (Active)</strong>
                  <span className="text-[11px] text-slate-500">IP: 192.168.10.42 • New Delhi • Chrome / Edge</span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                Valid Token
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase">Demo Password Reset</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
              <p>
                In this prototype deployment, all demo roles share the master password <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold text-slate-900">AIIA@123</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

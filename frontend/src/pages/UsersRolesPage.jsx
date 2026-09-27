import React, { useState } from 'react';
import {
  UserCog,
  Shield,
  Search,
  Check,
  X,
  UserCheck,
  Building,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS } from '../data/mockData';

export default function UsersRolesPage() {
  const { currentUser, switchRole } = useAuth();
  const [search, setSearch] = useState('');

  const filteredUsers = INITIAL_USERS.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.roleLabel.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  const PERMISSION_MATRIX = [
    { module: 'Portfolio Dashboard', pi: true, coordinator: true, monitor: true, ethics: true, pv: true, admin: true, regulator: true },
    { module: 'Clinical Trials (Full Edit)', pi: true, coordinator: true, monitor: false, ethics: false, pv: false, admin: true, regulator: false },
    { module: 'Participants Registry', pi: true, coordinator: true, monitor: false, ethics: false, pv: false, admin: true, regulator: false },
    { module: 'Sites & Monitoring Visits', pi: true, coordinator: true, monitor: true, ethics: false, pv: false, admin: true, regulator: false },
    { module: 'Pharmacovigilance (AE/SAE)', pi: true, coordinator: false, monitor: false, ethics: true, pv: true, admin: true, regulator: false },
    { module: 'Regulatory & Ethics Dossier', pi: true, coordinator: false, monitor: false, ethics: true, pv: false, admin: true, regulator: false },
    { module: 'Data Quality & Queries', pi: true, coordinator: true, monitor: true, ethics: false, pv: false, admin: true, regulator: false },
    { module: 'Risk Alerts Resolution', pi: true, coordinator: true, monitor: true, ethics: true, pv: true, admin: true, regulator: false },
    { module: 'Reports & FHIR/CDISC Export', pi: true, coordinator: true, monitor: true, ethics: true, pv: true, admin: true, regulator: true },
    { module: 'Immutable Audit Trail', pi: true, coordinator: false, monitor: false, ethics: true, pv: false, admin: true, regulator: true },
    { module: 'User Role Administration', pi: false, coordinator: false, monitor: false, ethics: false, pv: false, admin: true, regulator: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              User Management & Role-Based Access Control (RBAC)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              7 Clinical Roles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional directory, credential profiles, and granular module authorization privileges
          </p>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Configured Role Accounts</h2>
          <span className="text-xs text-slate-400">Click Switch Role to immediately adopt profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">User & Name</th>
                <th className="py-2.5 px-3">Role Designation</th>
                <th className="py-2.5 px-3">Institutional Email</th>
                <th className="py-2.5 px-3">Department / Division</th>
                <th className="py-2.5 px-3">Current Active Status</th>
                <th className="py-2.5 px-3 text-right">Switch Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isActive = currentUser?.role === user.role;

                return (
                  <tr key={user.id} className={`hover:bg-slate-50 ${isActive ? 'bg-teal-50/40' : ''}`}>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                          {user.avatar}
                        </div>
                        <span className="font-bold text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                        {user.roleLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {user.department}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          Currently Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Available</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => switchRole(user.role)}
                        disabled={isActive}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isActive ? 'Logged In' : 'Switch Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Granular Permission Matrix */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-card space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Role-Based Authorization Permission Matrix (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Functional capabilities and access controls mapped across clinical operational modules
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-2 text-center">PI</th>
                <th className="py-2.5 px-2 text-center">Coordinator</th>
                <th className="py-2.5 px-2 text-center">Monitor</th>
                <th className="py-2.5 px-2 text-center">Ethics</th>
                <th className="py-2.5 px-2 text-center">PV</th>
                <th className="py-2.5 px-2 text-center">Admin</th>
                <th className="py-2.5 px-2 text-center">Regulator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_MATRIX.map((row) => (
                <tr key={row.module} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-semibold text-slate-900">{row.module}</td>
                  <td className="py-2 px-2 text-center">
                    {row.pi ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.coordinator ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.monitor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.ethics ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.pv ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {row.regulator ? <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">Read</span> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
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

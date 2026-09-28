import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS } from '../data/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('pi@aiia-demo.com');
  const [password, setPassword] = useState('AIIA@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('AIIA@123');
    setError('');
    const result = await login(demoEmail, 'AIIA@123');
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* AIIA Institutional Emblem & Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-teal-600 text-white font-extrabold text-3xl shadow-lg ring-4 ring-teal-500/20 mb-3 border border-teal-400/40">
          A
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          AIIA
        </h1>
        <p className="text-sm font-semibold text-teal-400 tracking-wide uppercase mt-0.5">
          All India Institute of Ayurveda
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Clinical Research Management System (CTMS)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white text-slate-800 py-8 px-6 shadow-modal rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aiia-demo.com"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Security Password
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <span className="ml-2">Remember credentials</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Reset: Use password AIIA@123 for any of the listed roles below.')}
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin text-teal-400" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In to CTMS
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center mb-3">
              One-Click Role-Based Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {INITIAL_USERS.map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-all text-xs group"
                >
                  <div className="font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                    {u.roleLabel}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {u.email}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              Demo Master Password: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-semibold">AIIA@123</code>
            </p>
          </div>
        </div>

        {/* Demo data notice */}
        <div className="text-center mt-6 text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium text-slate-300">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            SIH presentation prototype · Synthetic records only
          </p>
          <p className="text-[11px] text-slate-500">
            Not a validated system for clinical or regulatory decisions
          </p>
        </div>
      </div>
    </div>
  );
}

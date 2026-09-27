import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, AlertTriangle, Info, ArrowRight, Check } from 'lucide-react';
import { useTrials } from '../../context/TrialsContext';

export default function NotificationDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { alerts, resolveAlert } = useTrials();

  if (!isOpen) return null;

  const openAlerts = alerts.filter(a => a.status === 'Open');

  const handleAlertClick = (alert) => {
    onClose();
    if (alert.trialId) {
      navigate(`/trials/${alert.trialId}`);
    } else {
      navigate('/risk-alerts');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-modal flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900">Clinical Notification Centre</h2>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {openAlerts.length} Active
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {openAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium">No unresolved notifications</p>
                <p className="text-xs text-slate-400">All trial alerts are currently addressed.</p>
              </div>
            ) : (
              openAlerts.map(alert => {
                let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                let Icon = Info;

                if (alert.severity === 'critical') {
                  badgeStyle = 'bg-red-50 text-red-700 border-red-200';
                  Icon = AlertCircle;
                } else if (alert.severity === 'high') {
                  badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                  Icon = AlertTriangle;
                } else if (alert.severity === 'medium') {
                  badgeStyle = 'bg-sky-50 text-sky-700 border-sky-200';
                  Icon = Info;
                }

                return (
                  <div key={alert.id} className="pt-3 first:pt-0">
                    <div className={`p-3 rounded-lg border transition-all ${badgeStyle} hover:shadow-subtle`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-current">
                          {alert.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{alert.trialShort || alert.trialId}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2.5">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">Target Role: <strong className="text-slate-700 uppercase">{alert.responsibleRole}</strong></span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => resolveAlert(alert.id, 'Resolved via notification quick-action')}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleAlertClick(alert)}
                            className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                navigate('/risk-alerts');
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Open Full Risk & Alerts Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">AIIA Real-Time Dispatcher</span>
          </div>
        </div>
      </div>
    </div>
  );
}

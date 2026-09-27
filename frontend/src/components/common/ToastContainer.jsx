import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTrials } from '../../context/TrialsContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useTrials();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let bgStyle = 'bg-slate-900 text-white border-slate-700';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;

        if (toast.type === 'error') {
          bgStyle = 'bg-red-900 text-white border-red-700';
          icon = <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />;
        } else if (toast.type === 'info') {
          bgStyle = 'bg-blue-900 text-white border-blue-700';
          icon = <Info className="w-5 h-5 text-blue-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-modal border text-sm transition-all duration-200 animate-in slide-in-from-bottom-2 ${bgStyle}`}
          >
            {icon}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

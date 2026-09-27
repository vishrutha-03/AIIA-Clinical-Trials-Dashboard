import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  status = 'normal',
  onClick,
  className = ''
}) {
  const isAlert = status === 'danger' || status === 'warning';

  let borderStyle = 'border-slate-200 hover:border-slate-300';
  let iconBg = 'bg-slate-100 text-slate-700';

  if (status === 'danger') {
    borderStyle = 'border-red-200 bg-red-50/20 hover:border-red-300';
    iconBg = 'bg-red-100 text-red-700';
  } else if (status === 'warning') {
    borderStyle = 'border-amber-200 bg-amber-50/20 hover:border-amber-300';
    iconBg = 'bg-amber-100 text-amber-700';
  } else if (status === 'success') {
    borderStyle = 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300';
    iconBg = 'bg-emerald-100 text-emerald-700';
  } else if (status === 'primary') {
    borderStyle = 'border-blue-200 hover:border-blue-300';
    iconBg = 'bg-blue-100 text-blue-800';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-4 border shadow-subtle transition-all duration-150 ${borderStyle} ${onClick ? 'cursor-pointer hover:shadow-card' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${status === 'danger' ? 'text-red-700' : 'text-slate-900'}`}>
              {value}
            </span>
            {trend && (
              <span className={`inline-flex items-center text-xs font-semibold ${trendDirection === 'up' ? 'text-emerald-700' : trendDirection === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                {trendDirection === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-md shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

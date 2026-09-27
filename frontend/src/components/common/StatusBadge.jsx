import React from 'react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;

  const s = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  // Clinical trial statuses
  if (s.includes('recruiting')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500 animate-pulse';
  } else if (s.includes('active')) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (s.includes('monitoring')) {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotColor = 'bg-indigo-500';
  } else if (s.includes('completed')) {
    styles = 'bg-teal-50 text-teal-700 border-teal-200';
    dotColor = 'bg-teal-600';
  } else if (s.includes('planning')) {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
    dotColor = 'bg-sky-500';
  } else if (s.includes('on hold') || s.includes('closed')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  }

  // Risk levels
  else if (s === 'high' || s.includes('at risk') || s === 'critical') {
    styles = 'bg-red-50 text-red-700 border-red-200 font-semibold';
    dotColor = 'bg-red-600 animate-ping';
  } else if (s === 'medium' || s.includes('moderate')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    dotColor = 'bg-amber-500';
  } else if (s === 'low' || s.includes('on track')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  }

  // Regulatory & Compliance
  else if (s.includes('compliant') || s.includes('approved') || s.includes('up to date')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (s.includes('due soon') || s.includes('update due')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    dotColor = 'bg-amber-500';
  } else if (s.includes('overdue')) {
    styles = 'bg-red-50 text-red-700 border-red-200 font-bold';
    dotColor = 'bg-red-500';
  }

  // Safety / Review
  else if (s.includes('under review')) {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (s.includes('resolved') || s.includes('closed')) {
    styles = 'bg-slate-50 text-slate-600 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5'
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap ${styles} ${sizeClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}

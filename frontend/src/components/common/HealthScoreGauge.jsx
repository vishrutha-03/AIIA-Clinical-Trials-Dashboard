import React from 'react';

export default function HealthScoreGauge({ score = 72, riskTier = 'AT RISK', size = 'lg', showLabel = true }) {
  // Determine color palette based on health score
  let strokeColor = '#EF4444'; // Red for at risk (< 75)
  let textColor = 'text-red-700';
  let bgColor = 'bg-red-50 text-red-700 border-red-200';

  if (score >= 85) {
    strokeColor = '#10B981'; // Emerald for on track
    textColor = 'text-emerald-700';
    bgColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (score >= 75) {
    strokeColor = '#F59E0B'; // Amber for moderate risk
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const radius = size === 'sm' ? 24 : 40;
  const strokeWidth = size === 'sm' ? 4 : 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg
          className="transform -rotate-90"
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
        >
          {/* Background track */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold ${size === 'sm' ? 'text-sm' : 'text-xl'} ${textColor}`}>
            {score}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-semibold text-slate-400">/ 100</span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trial Health Score
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${bgColor}`}>
              {riskTier}
            </span>
            <span className="text-xs text-slate-500">
              {score < 75 ? 'Multi-factor risk threshold exceeded' : score < 85 ? 'Close monitoring indicated' : 'Operating within nominal bounds'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

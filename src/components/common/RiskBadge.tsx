import React from 'react';
import { RiskLevel, AlertSeverity } from '../../types';
import { ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const norm = level.toLowerCase();

  let colorClasses = 'bg-slate-700 text-slate-200 border-slate-600';
  let Icon = AlertCircle;
  let label = level.toUpperCase();

  if (norm === 'low' || norm === 'advisory') {
    colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ring-emerald-500/20';
    Icon = ShieldCheck;
  } else if (norm === 'moderate') {
    colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30 ring-amber-500/20';
    Icon = AlertTriangle;
  } else if (norm === 'high' || norm === 'warning') {
    colorClasses = 'bg-orange-500/15 text-orange-400 border-orange-500/30 ring-orange-500/20';
    Icon = AlertTriangle;
  } else if (norm === 'critical') {
    colorClasses = 'bg-red-500/20 text-red-400 border-red-500/40 ring-red-500/30 animate-pulse';
    Icon = AlertOctagon;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono uppercase tracking-wider border font-medium ${colorClasses} ${sizeClasses}`}
      role="status"
      aria-label={`Risk level: ${label}`}
    >
      {showIcon && <Icon className={iconSizeClasses} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};

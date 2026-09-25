import React from 'react';
import { Info, Cpu } from 'lucide-react';

interface SimulatedBannerProps {
  label?: string;
  subtext?: string;
  className?: string;
  variant?: 'subtle' | 'pill' | 'card';
}

export const SimulatedBanner: React.FC<SimulatedBannerProps> = ({
  label = 'DEMO MODEL DATA',
  subtext = 'Simulation prototype — ready to connect with FastAPI / ML inference model',
  className = '',
  variant = 'pill',
}) => {
  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 ${className}`}
        title={subtext}
      >
        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs ${className}`}
    >
      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-cyan-300 font-mono tracking-wide uppercase text-[11px]">
          {label}
        </p>
        <p className="text-cyan-200/80 text-[11px] mt-0.5 leading-relaxed">{subtext}</p>
      </div>
    </div>
  );
};

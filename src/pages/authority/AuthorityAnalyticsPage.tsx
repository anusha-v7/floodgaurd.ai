import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  BarChart3,
  Calendar,
  Layers,
  AlertTriangle,
  Info,
  Cpu,
  ShieldCheck,
  Activity
} from 'lucide-react';

export const AuthorityAnalyticsPage: React.FC = () => {
  const historicalRainfallData = [
    { year: '2020', monsoonTotalMm: 840, floodDays: 6 },
    { year: '2021', monsoonTotalMm: 920, floodDays: 8 },
    { year: '2022', monsoonTotalMm: 1150, floodDays: 14 },
    { year: '2023', monsoonTotalMm: 780, floodDays: 5 },
    { year: '2024', monsoonTotalMm: 1020, floodDays: 11 },
    { year: '2025', monsoonTotalMm: 1280, floodDays: 16 },
    { year: '2026 (YTD)', monsoonTotalMm: 940, floodDays: 12 },
  ];

  const riskDistributionData = [
    { name: 'Critical (4 Zones)', value: 4, color: '#ef4444' },
    { name: 'High (8 Zones)', value: 8, color: '#f97316' },
    { name: 'Moderate (5 Zones)', value: 5, color: '#eab308' },
    { name: 'Low (7 Zones)', value: 7, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              HISTORICAL & STATISTICAL TELEMETRY
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Catchment Analytics & Trend Modeling
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Decadal precipitation patterns, seasonal inundation frequency, and spatial hazard distributions.
          </p>
        </div>
      </div>

      {/* Model Performance Metrics Card (Strict honesty constraint) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              AI / ML Model Performance Metrics
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800">
            AWAITING EMPIRICAL VALIDATION
          </span>
        </div>

        {/* Required Honest Notice */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <Activity className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
          <h4 className="text-lg font-bold text-slate-200">
            Model evaluation metrics will appear after model validation.
          </h4>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            In accordance with scientific rigor, performance indicators (Accuracy, Precision, Recall, F1-Score, MAE, RMSE) are reserved until test fold validation against ground-truth radar reflectivities and physical stream gauges is finalized.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono max-w-2xl mx-auto">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Accuracy</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Precision</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Recall</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">F1 Score</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">MAE (Depth)</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">RMSE</span>
              <span className="text-slate-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historical Rainfall & Flood Days Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Annual Monsoon Rainfall vs Inundation Days
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Comparison of seasonal precipitation depth (mm) and days with waterlogging
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalRainfallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Bar dataKey="monsoonTotalMm" fill="#0284c7" name="Monsoon Rainfall (mm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="floodDays" fill="#ef4444" name="Flood Inundation Days" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Risk Distribution Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Catchment Risk Severity Distribution
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Proportion of 24 monitored administrative sectors by risk tier
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${(name || '').split(' ')[0]} ${(((percent || 0) * 100)).toFixed(0)}%`
                  }
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

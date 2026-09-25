import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { RAINFALL_TIMELINE, KPI_SUMMARY } from '../../data/floodGuardData';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  CloudRain,
  Droplets,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  Compass
} from 'lucide-react';

export const AuthorityRainfallPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'intensity' | 'anomaly'>('forecast');

  const forecastCards = [
    { period: '1 HOUR', amount: KPI_SUMMARY.rainfallOverview.forecast1hMm, desc: 'Accumulation rate: 34 mm/hr', color: 'text-cyan-400' },
    { period: '3 HOURS', amount: KPI_SUMMARY.rainfallOverview.forecast3hMm, desc: 'Ground saturation threshold', color: 'text-amber-400' },
    { period: '6 HOURS', amount: KPI_SUMMARY.rainfallOverview.forecast6hMm, desc: 'Peak runoff convergence', color: 'text-orange-400' },
    { period: '24 HOURS', amount: KPI_SUMMARY.rainfallOverview.forecast24hMm, desc: 'Storm total expected', color: 'text-red-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              METEOROLOGICAL TELEMETRY
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Rainfall Intelligence & Forecasts
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Doppler radar precipitation tracking, precipitation anomaly curves, and NWP hydrological projections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Current Rate</span>
              <span className="text-xl font-black text-white font-mono">
                {KPI_SUMMARY.rainfallOverview.currentRateMmHr} <span className="text-xs text-cyan-400">mm/hr</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Forecast Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastCards.map((card) => (
          <div
            key={card.period}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                {card.period}
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className={`text-3xl font-black font-mono ${card.color}`}>
              {card.amount} <span className="text-sm font-sans text-slate-400">mm</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              Precipitation Hyetograph & Forecast Curve
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Comparison between observed gauge data (T-6h to Now) and AI predicted downpour (Now to T+24h)
            </p>
          </div>

          {/* Chart View Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'forecast'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Observed vs Predicted
            </button>
            <button
              onClick={() => setActiveTab('intensity')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'intensity'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Historical Comparison
            </button>
            <button
              onClick={() => setActiveTab('anomaly')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'anomaly'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rainfall Anomaly
            </button>
          </div>
        </div>

        {/* Tab 1: Observed vs Predicted */}
        {activeTab === 'forecast' && (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RAINFALL_TIMELINE} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" mm" />
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="observedMm"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorObserved)"
                  name="Observed Rainfall (mm)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="predictedMm"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                  name="AI Predicted Curve (mm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 2: Historical Comparison */}
        {activeTab === 'intensity' && (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RAINFALL_TIMELINE} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" mm" />
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Bar dataKey="predictedMm" fill="#06b6d4" name="Forecast Storm Depth (mm)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="historicalAvgMm" fill="#64748b" name="Historical 10-Yr Avg (mm)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 3: Rainfall Anomaly */}
        {activeTab === 'anomaly' && (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RAINFALL_TIMELINE} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" mm" />
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="anomalyMm"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Positive Anomaly Above Baseline (mm)"
                  dot={{ r: 4, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend notes */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800">
          <span>Data Ingestion: Doppler Radar (DWR) + IMD Automatic Weather Station Grid</span>
          <span className="text-cyan-400">Peak Downpour Projected at T+3h (142 mm)</span>
        </div>
      </div>
    </div>
  );
};

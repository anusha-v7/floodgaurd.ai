import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { INITIAL_AREAS, AI_PREDICTION_TIMELINE } from '../../data/floodGuardData';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  BrainCircuit,
  MapPin,
  Clock,
  Gauge,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Server
} from 'lucide-react';

export const AuthorityPredictionsPage: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState(INITIAL_AREAS[0].id);
  const [forecastPeriod, setForecastPeriod] = useState('6h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedArea =
    INITIAL_AREAS.find((a) => a.id === selectedAreaId) || INITIAL_AREAS[0];

  const handleSimulateFastApiFetch = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              NEURAL HYDRO-MODEL INFERENCE
            </span>
            <SimulatedBanner
              label="DEMO MODEL DATA"
              subtext="Connectable to FastAPI GET /prediction"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AI Flood Probability Forecasting
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Temporal deep learning prediction curves estimating flood likelihood over 6-hour and 24-hour lead windows.
          </p>
        </div>

        <button
          onClick={handleSimulateFastApiFetch}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isRefreshing ? 'Querying FastAPI...' : 'Refresh Inference API'}</span>
        </button>
      </div>

      {/* Control Filters: Location & Forecast Period */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400 uppercase">Location:</span>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              {INITIAL_AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.riskLevel.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400 uppercase">Forecast Horizon:</span>
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="6h">Next 6 Hours (High-Confidence)</option>
              <option value="12h">Next 12 Hours</option>
              <option value="24h">Next 24 Hours</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span>Endpoint: <code className="text-cyan-300">GET /prediction?areaId={selectedAreaId}</code></span>
        </div>
      </div>

      {/* Current Prediction Status Card */}
      <div className="bg-linear-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              CURRENT AI INFERENCE PREDICTION
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>HIGH FLOOD RISK</span>
            <RiskBadge level={selectedArea.riskLevel} size="md" />
          </h2>
          <p className="text-slate-400 text-xs max-w-xl">
            Model indicates rapid infiltration capacity depletion. Runoff coefficient estimated at 0.88 for {selectedArea.name}.
          </p>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">AI Model Confidence</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {selectedArea.aiConfidence}%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Lead Time to Crest</span>
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {selectedArea.warningLeadTime}
            </span>
          </div>
        </div>
      </div>

      {/* Probability Progression Timeline Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          Probability Progression Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {AI_PREDICTION_TIMELINE.map((item, idx) => (
            <div
              key={item.timeStep}
              className={`p-4 rounded-2xl border text-center transition ${
                item.probability > 75
                  ? 'bg-red-500/15 border-red-500/40 text-red-300'
                  : item.probability > 50
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                  : item.probability > 25
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {item.timeStep}
              </span>
              <span className="text-2xl font-black font-mono block">
                {item.probability}%
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400 mt-1 block">
                {item.rainfallMm} mm rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Prediction Recharts Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Flood Risk Probability vs Water Level Projection
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Synchronized hydrological curve over next 5 forecast hours
          </p>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AI_PREDICTION_TIMELINE} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeStep" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
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
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="probability"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#probGrad)"
                name="Flood Probability (%)"
              />
              <Area
                type="monotone"
                dataKey="waterLevelM"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#waterGrad)"
                name="Projected Water Level (m)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

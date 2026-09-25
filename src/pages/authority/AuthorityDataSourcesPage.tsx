import React from 'react';
import { DATA_SOURCES } from '../../data/floodGuardData';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  Database,
  Radio,
  Satellite,
  Wifi,
  CloudRain,
  Cpu,
  Layers,
  ArrowDown,
  CheckCircle2,
  Info,
  Server
} from 'lucide-react';

export const AuthorityDataSourcesPage: React.FC = () => {
  const pipelineSteps = [
    {
      stage: '01. Raw Data Ingest',
      items: ['INSAT-3DR Satellite (MOSDAC)', 'Doppler Weather Radar (IMD)', 'Automatic Weather Stations Grid', 'CWC Canal Water Sensors', 'SRTM 30m Digital Elevation Model'],
      icon: Database,
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20'
    },
    {
      stage: '02. Data Processing & Fusion',
      items: ['Georeferencing & Reprojection', 'Spatial Kriging Interpolation', 'Hydrological Basin Masking', 'Soil Moisture Saturation Index (SMI)'],
      icon: Layers,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20'
    },
    {
      stage: '03. AI / ML Predictive Engine',
      items: ['Hydro-ConvLSTM Spatiotemporal Model', 'XGBoost Discharge Estimator', 'Runoff Hydrograph Simulation'],
      icon: Cpu,
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20'
    },
    {
      stage: '04. Prediction & Risk Classification',
      items: ['1h / 3h / 6h Rainfall Forecast Curves', 'Flood Probability Scoring (0–100%)', 'Severity Tiers: Low, Moderate, High, Critical'],
      icon: Radio,
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20'
    },
    {
      stage: '05. Inundation & Micro-Depth Mapping',
      items: ['Depth Tier Polygons (0–0.5m, 0.5–1m, >1m)', 'Critical Infrastructure Exposure Triage', 'Warning Lead Time Calculation'],
      icon: CloudRain,
      color: 'border-orange-500/40 text-orange-400 bg-orange-950/20'
    },
    {
      stage: '06. Early Warning & Emergency Action',
      items: ['Authority Command Dashboard Alerting', 'Public Citizen SMS & Web Bulletins', 'SDRF / NDRF Mobilization Trigger'],
      icon: CheckCircle2,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              INGESTION & PIPELINE TOPOLOGY
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Data Sources & Processing Pipeline
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Operational status of atmospheric feeds, satellite telemetry, telemetric gauges, and neural inference pipeline.
          </p>
        </div>
      </div>

      {/* Sensor Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DATA_SOURCES.map((src) => (
          <div
            key={src.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  {src.type}
                </span>
                <h3 className="text-base font-bold text-white leading-snug mt-0.5">{src.name}</h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Provider:</span>
                <span className="text-slate-200 text-right">{src.provider}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Frequency:</span>
                <span className="text-cyan-300">{src.updateFrequency}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Ingest:</span>
                <span className="text-slate-300">{src.lastSync}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Feed Reliability:</span>
                <span className="text-emerald-400 font-bold">{src.reliability}</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/30 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center justify-between">
              <span>CONNECTION TYPE:</span>
              <span className="font-bold">SIMULATED / DEMO CONNECTION</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Pipeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              End-to-End Early Warning Architecture Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Sequential flow from multi-sensor ingest through AI inference to actionable public response
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stage}
                className={`p-5 rounded-2xl border ${step.color} space-y-3 relative`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold font-mono text-sm text-white">{step.stage}</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  {step.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

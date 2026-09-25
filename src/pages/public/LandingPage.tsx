import React from 'react';
import { Link } from 'react-router-dom';
import {
  Waves,
  CloudRain,
  ShieldAlert,
  Compass,
  ArrowRight,
  Database,
  Cpu,
  Radio,
  Building2,
  CheckCircle,
  MapPin,
  Lock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { KPI_SUMMARY } from '../../data/floodGuardData';

export const LandingPage: React.FC = () => {
  const steps = [
    { num: '01', title: 'Data Sources', desc: 'Satellite, Doppler Radar, AWS, NWP & Ultrasonic sensors' },
    { num: '02', title: 'Data Processing', desc: 'Spatial interpolation, runoff coefficients & basin normalization' },
    { num: '03', title: 'AI / ML Engine', desc: 'Spatio-temporal deep learning & hydrological model inference' },
    { num: '04', title: 'Rainfall Prediction', desc: '1h, 3h, 6h & 24h precipitation forecasting curves' },
    { num: '05', title: 'Flood Risk Scoring', desc: 'Probabilistic severity classification (Low to Critical)' },
    { num: '06', title: 'Inundation Mapping', desc: 'Micro-elevation water accumulation & depth polygons' },
    { num: '07', title: 'Early Warning', desc: 'Immediate automated cell broadcast & public advisory sirens' },
    { num: '08', title: 'Response Coordination', desc: 'SDRF deployment, asset triage & shelter mobilization' },
  ];

  const features = [
    {
      title: 'AI-Based Forecasting',
      desc: 'Machine learning algorithms trained on multi-spectral satellite imagery and terrain slopes calculate high-resolution flood risks hours before ground saturation.',
      icon: Cpu,
    },
    {
      title: 'Risk Mapping',
      desc: 'Live interactive geospatial mapping displaying verified risk corridors, safe evacuation routes, and severity clusters.',
      icon: Compass,
    },
    {
      title: 'Inundation Prediction',
      desc: 'Depth-stratified modeling (0–0.5m, 0.5–1m, >1m) projecting exactly where floodwaters will pool and trap vehicles.',
      icon: Waves,
    },
    {
      title: 'Early Warning Alerts',
      desc: 'Sub-minute alert dissemination connecting district emergency commands with vulnerable citizens directly on their mobile screens.',
      icon: Radio,
    },
    {
      title: 'Critical Asset Monitoring',
      desc: 'Real-time telemetry tracking access routes to hospitals, railway bridges, electrical substations, and disaster shelters.',
      icon: Building2,
    },
    {
      title: 'Authority Decision Support',
      desc: 'A unified dark command center arming disaster managers with quantifiable lead times, population impact stats, and dispatch checklists.',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Animated Abstract Radar/Water background effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-blue-600 blur-3xl opacity-70"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Disaster Management & Climate-Tech Prototype</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              FLOODGUARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">AI</span>
            </h1>

            <p className="text-lg sm:text-2xl font-mono text-cyan-300 tracking-widest font-semibold uppercase">
              “Predict. Warn. Respond.”
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              An intelligent early warning platform that combines rainfall, weather, satellite, radar and environmental data to predict flood risk, identify potential inundation and support faster emergency response.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/public/my-area"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 transition hover:scale-105 flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Check My Area</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/authority/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700/80 shadow-lg hover:border-cyan-400/50 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Authority Command Center</span>
              </Link>
            </div>

            {/* Quick Live stats pill */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/70">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Critical Zones Monitored: <strong className="text-white">{KPI_SUMMARY.criticalAreasCount}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/70">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Active Warning Alerts: <strong className="text-white">{KPI_SUMMARY.activeAlertsCount}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Current Peak Rainfall: <strong className="text-white">{KPI_SUMMARY.rainfallOverview.currentRateMmHr} mm/h</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Feature Cards */}
      <section className="py-20 -mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 hover:shadow-2xl hover:border-blue-300 transition group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-inner">
              <CloudRain className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold block mb-1">
              METEOROLOGICAL INTELLIGENCE
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">RAINFALL PREDICTION</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Predict changing rainfall intensity and trends with radar-satellite fusion models, offering 1h, 3h, 6h, and 24h hyper-local precipitation curves.
            </p>
            <Link
              to="/public/my-area"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore Rainfall Metrics →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 hover:shadow-2xl hover:border-orange-300 transition group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 font-bold block mb-1">
              PROBABILISTIC CLASSIFICATION
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">FLOOD RISK</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Estimate the exact probability and severity of flooding across urban sectors, combining soil saturation, drainage topography, and historical runoff.
            </p>
            <Link
              to="/public/risk-map"
              className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Open Public Risk Map →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 hover:shadow-2xl hover:border-cyan-300 transition group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-inner">
              <Waves className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 font-bold block mb-1">
              HYDROLOGICAL ACCUMULATION
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">INUNDATION PREDICTION</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Identify areas where water accumulation will occur, computing maximum flood depth levels (0–0.5m, 0.5–1m, &gt;1m) and warning lead times.
            </p>
            <Link
              to="/public/safe-zones"
              className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Locate Safe Higher Ground →
            </Link>
          </div>
        </div>
      </section>

      {/* How FloodGuard AI Works: Pipeline */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              END-TO-END SYSTEM PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How FloodGuard AI Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              From continuous atmospheric telemetry ingest to life-saving citizen evacuation warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={s.num}
                className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700 hover:border-cyan-500/50 transition relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-cyan-400">{s.num}</span>
                  {idx < steps.length - 1 && (
                    <span className="hidden lg:block text-slate-600 font-bold text-xs">→</span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FloodGuard AI? Project Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            RESILIENCE ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Why FloodGuard AI?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Traditional flood warnings rely on delayed river gauge thresholds. FloodGuard AI fuses multi-sensor atmospheric predictions before downpours turn into devastating floods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">{f.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dual Portal Showcase CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
              ROLE-BASED COMMAND EXPERIENCE
            </span>
            <h3 className="text-3xl font-extrabold text-white">
              Two Tailored Environments: Public & Authority
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Citizens get simplified, clutter-free safety instructions and risk maps. Authorized disaster officials get a comprehensive real-time command dashboard with ML forecasts and alert dispatch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/public/my-area"
              className="px-6 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-sm text-center shadow-lg hover:bg-blue-50 transition"
            >
              Public Citizen Portal
            </Link>
            <Link
              to="/authority/login"
              className="px-6 py-3.5 rounded-xl bg-slate-950 text-cyan-300 border border-cyan-400/40 font-bold text-sm text-center shadow-lg hover:bg-slate-900 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Authority Officer Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

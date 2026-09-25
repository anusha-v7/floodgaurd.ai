import React from 'react';
import { Link } from 'react-router-dom';
import {
  Waves,
  ShieldAlert,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  Code2,
  Server
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
          MISSION & TECHNICAL ARCHITECTURE
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          About FloodGuard AI
        </h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          An AI-powered flood early warning and micro-inundation prediction platform designed for district disaster management and resilient citizen response.
        </p>
      </div>

      {/* Vision Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Purpose & Motivation</h2>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          Urban flash floods and riverine deluges have intensified across India due to climate volatility and rapid urban imperviousness. Conventional flood warnings depend largely on downstream river water level gauges, providing warning lead times of only 15 to 30 minutes after inundation has already begun.
        </p>
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          <strong>FloodGuard AI</strong> flips the timeline: by fusing satellite cloud dynamics (INSAT-3DR), Doppler Weather Radar reflectivity, telemetric surface weather stations, and high-resolution digital elevation models (DEM), the platform projects water accumulation <strong>2 to 6 hours before streets submerge</strong>.
        </p>
      </div>

      {/* Two Distinct User Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-mono text-sm">
            01
          </div>
          <h3 className="text-xl font-bold text-slate-900">Public Citizen Experience</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Light, mobile-friendly interface designed for rapid public comprehension during crises. Allows citizens to check their local area's flood risk, view active evacuation warnings, locate verified higher ground relief shelters, and follow safety protocols.
          </p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-bold font-mono text-sm">
            02
          </div>
          <h3 className="text-xl font-bold text-white">Authority Command Center</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Dark-theme operations center for SDMA, NDRF, and municipal flood cells. Includes granular risk layers, depth-stratified inundation polygons, critical infrastructure monitoring, response checklists, and single-click broadcast alert dispatch to citizens.
          </p>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Technical Architecture & Extensibility</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-blue-600 font-bold block">Frontend UI</span>
            <p className="text-slate-700 font-medium">React 19 + TypeScript + Vite</p>
            <p className="text-slate-500">Tailwind CSS, Lucide Icons, Recharts, Leaflet & OpenStreetMap</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-cyan-600 font-bold block">Backend Service</span>
            <p className="text-slate-700 font-medium">FastAPI (Python 3.11)</p>
            <p className="text-slate-500">Pydantic validation, CORS headers, REST endpoints in <code>backend/</code></p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-mono text-emerald-600 font-bold block">AI / ML Pipeline</span>
            <p className="text-slate-700 font-medium">Hydro-ConvLSTM / XGBoost</p>
            <p className="text-slate-500">Separated mock simulation service ready for live weight checkpoints</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
          <strong>Clean Separation Principle:</strong> All prediction curves and sensor status flags are centralized through typed domain models (<code>src/types/index.ts</code> and <code>src/data/floodGuardData.ts</code>). Connecting live GIS geoservers or model APIs requires zero UI refactoring.
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-100 rounded-3xl">
        <Link
          to="/public/my-area"
          className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1"
        >
          Check Flood Risk in Bellary →
        </Link>
        <Link
          to="/authority/login"
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Lock className="w-3.5 h-3.5" />
          Access Authority Command Center
        </Link>
      </div>
    </div>
  );
};

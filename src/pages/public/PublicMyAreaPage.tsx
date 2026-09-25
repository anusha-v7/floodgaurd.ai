import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Droplets,
  Gauge,
  Clock,
  Waves,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Compass,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';
import { INITIAL_AREAS } from '../../data/floodGuardData';
import { AreaRisk } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';

export const PublicMyAreaPage: React.FC = () => {
  // Default to Bellary Urban Old Town / Zone A
  const [selectedAreaId, setSelectedAreaId] = useState<string>('bellary-urban-old');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedArea =
    INITIAL_AREAS.find((a) => a.id === selectedAreaId) || INITIAL_AREAS[0];

  const filteredAreas = INITIAL_AREAS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            CITIZEN RISK ASSESSMENT
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Check Flood Risk in Your Area
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time flood likelihood and predicted water levels for your local ward or neighborhood.
          </p>
        </div>

        <SimulatedBanner
          label="DEMO / SIMULATED DATA"
          subtext="Simulated hydrological flood metrics for demonstration"
        />
      </div>

      {/* Area Selector and Search */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by area name or zone code (e.g. Bellary Urban, Zone A, Zone C)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Quick Dropdown select */}
          <div className="w-full sm:w-72">
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="w-full py-3 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              {INITIAL_AREAS.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} ({area.riskLevel.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick pill chips for common areas */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Quick Select:</span>
          {INITIAL_AREAS.slice(0, 5).map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition ${
                selectedAreaId === area.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {area.code.replace('ZONE-', '')}: {area.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area Assessment Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {/* Top Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-mono text-xs text-blue-600 font-bold">{selectedArea.code}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedArea.name}</h2>
            <p className="text-xs text-slate-500">
              Latitude {selectedArea.coordinates[0]}°N, Longitude {selectedArea.coordinates[1]}°E • Updated {selectedArea.lastUpdated}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">ASSESSED RISK</span>
              <RiskBadge level={selectedArea.riskLevel} size="lg" />
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Rainfall */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
                <Droplets className="w-4 h-4" />
                <span>Current Rainfall</span>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {selectedArea.rainfallMmHr} <span className="text-xs font-normal text-slate-500">mm/hr</span>
              </div>
              <p className="text-[11px] text-slate-500">Peak intensity rate</p>
            </div>

            {/* Flood Probability */}
            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
              <div className="flex items-center gap-2 text-orange-700 text-xs font-semibold">
                <Gauge className="w-4 h-4" />
                <span>Flood Probability</span>
              </div>
              <div className="text-3xl font-black text-orange-600 font-mono">
                {selectedArea.floodProbability}%
              </div>
              <p className="text-[11px] text-slate-500">AI confidence: {selectedArea.aiConfidence}%</p>
            </div>

            {/* Expected Risk Time */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
                <Clock className="w-4 h-4" />
                <span>Expected Risk Time</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {selectedArea.warningLeadTime}
              </div>
              <p className="text-[11px] text-slate-500">Warning lead time</p>
            </div>

            {/* Predicted Water Level */}
            <div className="p-5 rounded-2xl bg-red-50/60 border border-red-100 space-y-2">
              <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
                <Waves className="w-4 h-4" />
                <span>Predicted Water Level</span>
              </div>
              <div className="text-3xl font-black text-red-600 font-mono">
                {selectedArea.waterLevelM} <span className="text-xs font-normal text-slate-500">m</span>
              </div>
              <p className="text-[11px] text-slate-500">Street depth: ~{selectedArea.floodDepthM}m</p>
            </div>
          </div>

          {/* Warning Banner Card */}
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>OFFICIAL WEATHER WARNING</span>
            </div>
            <p className="text-sm text-red-800 leading-relaxed font-medium">
              Heavy rainfall may cause flooding in low-lying areas. Water accumulation of up to {selectedArea.floodDepthM}m may disrupt road transport and ground-floor dwellings within {selectedArea.warningLeadTime}.
            </p>
            <p className="text-xs text-red-700/90 pt-1">
              <strong>Recommended Citizen Action:</strong> {selectedArea.recommendedAction}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Simulated prototype telemetry based on Bellary Urban catchment parameters.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                to="/public/safety"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                Safety Instructions
              </Link>

              <Link
                to="/public/safe-zones"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                View Safe Zones
              </Link>

              <Link
                to="/public/risk-map"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition text-center flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                View Risk Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicRiskMapComponent } from '../../components/maps/PublicRiskMapComponent';
import { INITIAL_AREAS } from '../../data/floodGuardData';
import { AreaRisk } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  Compass,
  MapPin,
  Droplets,
  Gauge,
  AlertTriangle,
  ShieldCheck,
  Shield,
  ArrowRight,
  Info
} from 'lucide-react';

export const PublicRiskMapPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<AreaRisk | null>(INITIAL_AREAS[0]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            GEOSPATIAL SITUATION MAP
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Public Flood Risk Map
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Interactive overview of regional flood hazard zones. Click on any color-coded zone to view risk levels and safety warnings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Simplified Citizen View (No sensitive infrastructure feeds)</span>
        </div>
      </div>

      {/* Main Map + Selected Zone details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2">
          <PublicRiskMapComponent
            areas={INITIAL_AREAS}
            selectedArea={selectedArea}
            onSelectArea={(area) => setSelectedArea(area)}
            height="580px"
          />
        </div>

        {/* Selected Zone Details Drawer/Panel */}
        <div className="lg:col-span-1 space-y-4">
          {selectedArea ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs text-blue-600 font-bold">
                  {selectedArea.code}
                </span>
                <RiskBadge level={selectedArea.riskLevel} size="md" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedArea.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Monitored catchment sector • {selectedArea.lastUpdated}
                </p>
              </div>

              {/* Citizen Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <span className="text-slate-500 block mb-1">Current Rainfall</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {selectedArea.rainfallMmHr} <span className="text-xs font-normal">mm/h</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <span className="text-slate-500 block mb-1">Flood Possibility</span>
                  <span className="text-xl font-bold font-mono text-orange-600">
                    {selectedArea.floodProbability}%
                  </span>
                </div>
              </div>

              {/* Public Warning */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Public Safety Advisory</span>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium">
                  {selectedArea.recommendedAction}
                </p>
                <div className="text-[11px] text-amber-800 pt-1 font-mono">
                  Expected Water Rise: {selectedArea.warningLeadTime}
                </div>
              </div>

              {/* Quick Action Navigation */}
              <div className="space-y-2 pt-1">
                <Link
                  to="/public/safe-zones"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Locate Nearest Safe Evacuation Zone
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/public/safety"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Read Heavy Rain Safety Checklist
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center text-slate-400">
              <Compass className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Click on any colored zone on the map to view risk details.</p>
            </div>
          )}

          {/* Quick Zone Picker List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
              Monitored Catchment Sectors
            </h4>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {INITIAL_AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedArea(a)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                    selectedArea?.id === a.id
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{a.name}</span>
                  <RiskBadge level={a.riskLevel} size="sm" showIcon={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

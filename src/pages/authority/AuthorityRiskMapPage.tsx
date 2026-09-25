import React, { useState } from 'react';
import { INITIAL_AREAS, CRITICAL_ASSETS, INUNDATION_ZONES } from '../../data/floodGuardData';
import { AreaRisk } from '../../types';
import { AuthorityRiskMapComponent } from '../../components/maps/AuthorityRiskMapComponent';
import { ZoneDetailsModal } from '../../components/authority/ZoneDetailsModal';
import { RiskBadge } from '../../components/common/RiskBadge';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  Compass,
  Layers,
  Send,
  Droplets,
  Ruler,
  Clock,
  Gauge,
  Cpu,
  ShieldAlert,
  Building2
} from 'lucide-react';

export const AuthorityRiskMapPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<AreaRisk | null>(INITIAL_AREAS[0]);
  const [modalArea, setModalArea] = useState<AreaRisk | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              GEOSPATIAL COMMAND SURFACE
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Operational Risk & Inundation Map
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time layer composition with satellite rain radar, hydrological risk zones, and critical infrastructure telemetry.
          </p>
        </div>

        {selectedArea && (
          <button
            onClick={() => setModalArea(selectedArea)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Issue Alert for {selectedArea.code}</span>
          </button>
        )}
      </div>

      {/* Main Map + Inspection Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Large Map */}
        <div className="lg:col-span-3">
          <AuthorityRiskMapComponent
            areas={INITIAL_AREAS}
            criticalAssets={CRITICAL_ASSETS}
            inundationZones={INUNDATION_ZONES}
            selectedArea={selectedArea}
            onSelectArea={(area) => {
              setSelectedArea(area);
            }}
            height="680px"
            showFiltersBar={true}
          />
        </div>

        {/* Selected Zone Quick Inspection Drawer */}
        <div className="lg:col-span-1 space-y-4">
          {selectedArea ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedArea.code}
                </span>
                <RiskBadge level={selectedArea.riskLevel} size="md" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {selectedArea.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Population: ~{selectedArea.populationAtRisk.toLocaleString()} • Lead: {selectedArea.warningLeadTime}
                </p>
              </div>

              {/* Core Telemetry parameters */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                    <Gauge className="w-3.5 h-3.5 text-orange-400" />
                    Flood Probability
                  </span>
                  <span className="text-base font-bold text-orange-400">{selectedArea.floodProbability}%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    Current Rainfall
                  </span>
                  <span className="text-base font-bold text-white">{selectedArea.rainfallMmHr} mm/h</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    Predicted 6h Rain
                  </span>
                  <span className="text-base font-bold text-cyan-300">{selectedArea.predictedRainfallMm} mm</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Water Level / Depth
                  </span>
                  <span className="text-base font-bold text-amber-400">{selectedArea.waterLevelM}m / {selectedArea.floodDepthM}m</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    AI Confidence
                  </span>
                  <span className="text-base font-bold text-emerald-400">{selectedArea.aiConfidence}%</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
                <span className="font-mono text-cyan-400 font-bold uppercase text-[10px] block mb-1">
                  Recommended Action:
                </span>
                <p className="text-cyan-100 leading-relaxed text-xs">
                  {selectedArea.recommendedAction}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setModalArea(selectedArea)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono uppercase font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>ISSUE ALERT</span>
                </button>

                <button
                  onClick={() => setModalArea(selectedArea)}
                  className="w-full py-2 px-3 rounded-xl font-mono text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Full Telemetry Breakdown
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-slate-500 text-xs">
              Select a zone from the map to inspect telemetry
            </div>
          )}

          {/* Quick Monitored Catchment List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Catchment Sectors ({INITIAL_AREAS.length})
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {INITIAL_AREAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedArea(a)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                    selectedArea?.id === a.id
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <span className="truncate pr-2 font-mono text-[11px]">{a.name}</span>
                  <RiskBadge level={a.riskLevel} size="sm" showIcon={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalArea && (
        <ZoneDetailsModal
          area={modalArea}
          onClose={() => setModalArea(null)}
        />
      )}
    </div>
  );
};

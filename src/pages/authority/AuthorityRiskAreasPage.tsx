import React, { useState } from 'react';
import { INITIAL_AREAS } from '../../data/floodGuardData';
import { AreaRisk, RiskLevel } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ZoneDetailsModal } from '../../components/authority/ZoneDetailsModal';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import {
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
  Send,
  Eye,
  Droplets,
  Gauge,
  Clock
} from 'lucide-react';

export const AuthorityRiskAreasPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | RiskLevel>('all');
  const [selectedArea, setSelectedArea] = useState<AreaRisk | null>(null);

  const filtered = INITIAL_AREAS.filter((area) => {
    const matchesLevel = filterLevel === 'all' || area.riskLevel === filterLevel;
    const matchesSearch =
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.code.toLowerCase().includes(search.toLowerCase()) ||
      area.recommendedAction.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              REGIONAL RISK INVENTORY
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Monitored Risk Areas & Catchments
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Tabular register of all municipal wards and drainage basins with continuous telemetry scoring.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search areas or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <span className="text-slate-500 font-mono text-[11px] uppercase mr-1">Risk:</span>
          {(['all', 'critical', 'high', 'moderate', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition ${
                filterLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-4 px-6">Area & Code</th>
                <th className="py-4 px-4">Risk Severity</th>
                <th className="py-4 px-4">Probability</th>
                <th className="py-4 px-4">Current Rain</th>
                <th className="py-4 px-4">6h Forecast</th>
                <th className="py-4 px-4">Warning Lead Time</th>
                <th className="py-4 px-4">Water Level</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No risk areas match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((area) => (
                  <tr
                    key={area.id}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => setSelectedArea(area)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{area.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{area.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge level={area.riskLevel} size="sm" />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-orange-400 font-mono">
                        {area.floodProbability}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {area.rainfallMmHr} mm/h
                    </td>
                    <td className="py-4 px-4 text-cyan-300">
                      {area.predictedRainfallMm} mm
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-950 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">
                        {area.warningLeadTime}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-amber-400">
                      {area.waterLevelM} m
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedArea(area)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-bold hover:text-white transition flex items-center gap-1.5 ml-auto text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedArea && (
        <ZoneDetailsModal
          area={selectedArea}
          onClose={() => setSelectedArea(null)}
        />
      )}
    </div>
  );
};

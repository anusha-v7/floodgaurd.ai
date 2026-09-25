import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  Radio,
  Users,
  Building,
  School,
  Car,
  Compass,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  Send
} from 'lucide-react';
import { KPI_SUMMARY, INITIAL_AREAS, CRITICAL_ASSETS, INUNDATION_ZONES } from '../../data/floodGuardData';
import { AuthorityRiskMapComponent } from '../../components/maps/AuthorityRiskMapComponent';
import { ZoneDetailsModal } from '../../components/authority/ZoneDetailsModal';
import { AreaRisk, FloodAlert } from '../../types';
import { alertService } from '../../services/alertService';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';

export const AuthorityDashboardPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<AreaRisk | null>(null);
  const [modalArea, setModalArea] = useState<AreaRisk | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<FloodAlert[]>(alertService.getActiveAlerts());

  useEffect(() => {
    const unsub = alertService.subscribe((alerts) => {
      setActiveAlerts(alerts.filter((a) => a.status === 'active'));
    });
    return unsub;
  }, []);

  const situationTimeline = [
    {
      step: 'NOW',
      title: 'Heavy Rainfall Detected',
      desc: 'Radar reflectivity 52 dBZ. Surface gauges recording 86 mm/hr peak at Bellary Old Town basin.',
      status: 'active',
      badgeColor: 'bg-red-500 text-white',
    },
    {
      step: '+1 HOUR',
      title: 'Rainfall Intensifying',
      desc: 'Precipitation expected to crest at 104 mm/hr. Catchment run-off velocity increasing.',
      status: 'imminent',
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      step: '+2 HOURS',
      title: 'Water Accumulation Begins',
      desc: 'Micro-depressions fill. Road dipping at NH-67 and Old Town underpass submerges by ~0.4m.',
      status: 'projected',
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      step: '+3 HOURS',
      title: 'High Flood Risk',
      desc: 'Canal spillover probability rises to 76%. Lowland ground floor dwellings threatened.',
      status: 'projected',
      badgeColor: 'bg-yellow-400 text-slate-950 font-bold',
    },
    {
      step: '+4 HOURS',
      title: 'Critical Zones Expected',
      desc: 'Peak flood depth reaches 1.2m–1.4m across 4 priority zones. Full evacuation suggested.',
      status: 'projected',
      badgeColor: 'bg-red-600 text-white font-bold',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Page Title & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              OPERATIONAL SITUATION ROOM
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Authority Command Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Bellary Urban Basin & Catchment Real-Time Flood Intelligence Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/authority/alerts"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono uppercase font-bold text-xs shadow-lg shadow-red-600/20 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Create Broadcast Alert</span>
          </Link>

          <Link
            to="/authority/risk-map"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Operational Map</span>
          </Link>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical Areas */}
        <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-red-500 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              Critical Areas
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">
            {KPI_SUMMARY.criticalAreasCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Immediate SDRF attention required
          </p>
        </div>

        {/* High Risk */}
        <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-orange-500 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">
              High Risk
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">
            {KPI_SUMMARY.highRiskCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Pre-saturation threshold reached
          </p>
        </div>

        {/* Heavy Rainfall */}
        <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-cyan-500 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Heavy Rainfall
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">
            {KPI_SUMMARY.heavyRainfallZonesCount} <span className="text-sm font-sans text-slate-400">Zones</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Peak rate: {KPI_SUMMARY.rainfallOverview.currentRateMmHr} mm/hr
          </p>
        </div>

        {/* Active Alerts */}
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-red-400 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <Radio className="w-4 h-4 animate-ping" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono">
            {activeAlerts.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Broadcasted to citizens & rescue cells
          </p>
        </div>
      </div>

      {/* Live Flood Risk Overview Map & Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                Live Flood Risk Overview
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Click any zone to inspect AI telemetry and issue high-priority warnings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/authority/risk-map"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>Full Screen Command Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <AuthorityRiskMapComponent
          areas={INITIAL_AREAS}
          criticalAssets={CRITICAL_ASSETS}
          inundationZones={INUNDATION_ZONES}
          selectedArea={selectedArea}
          onSelectArea={(area) => {
            setSelectedArea(area);
            setModalArea(area);
          }}
          height="450px"
          showFiltersBar={true}
        />
      </div>

      {/* Two Column Section: AI Situation Forecast & Predicted Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Situation Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight uppercase">
                AI Situation Forecast
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              LEAD TIME WINDOW: 4 HOURS
            </span>
          </div>

          <div className="space-y-4">
            {situationTimeline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 ${item.badgeColor}`}
                >
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predicted Impact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white tracking-tight uppercase">
                Predicted Vulnerability & Impact
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              SIMULATED BASIN AGGREGATE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-red-400" />
                <span>Population Affected</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.populationAffected.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Across 4 zones</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Car className="w-3.5 h-3.5 text-orange-400" />
                <span>Roads Affected</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.roadsAffected}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Including NH-67 cut</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Bridges at Risk</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.bridgesAtRisk}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Deck clearance &lt;0.5m</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Critical Facilities</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.criticalFacilities}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">2 hospitals on alert</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <School className="w-3.5 h-3.5 text-blue-400" />
                <span>Schools</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.schools}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Suspended & evacuated</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Area Affected</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {KPI_SUMMARY.impact.areaAffectedKm2} <span className="text-xs">km²</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Peak depth 1.4m</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-mono">
              Ready to dispatch emergency alerts to municipal teams?
            </span>
            <Link
              to="/authority/response"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
            >
              Response Center →
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for Zone Details */}
      {modalArea && (
        <ZoneDetailsModal
          area={modalArea}
          onClose={() => setModalArea(null)}
          onAlertCreated={() => {
            setActiveAlerts(alertService.getActiveAlerts());
          }}
        />
      )}
    </div>
  );
};

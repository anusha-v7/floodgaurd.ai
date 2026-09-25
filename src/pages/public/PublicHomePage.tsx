import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  AlertTriangle,
  CloudRain,
  ShieldCheck,
  Compass,
  ArrowRight,
  Droplets,
  Clock,
  Shield,
  PhoneCall
} from 'lucide-react';
import { INITIAL_AREAS, KPI_SUMMARY } from '../../data/floodGuardData';
import { alertService } from '../../services/alertService';
import { FloodAlert } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';

export const PublicHomePage: React.FC = () => {
  const [alerts, setAlerts] = useState<FloodAlert[]>(alertService.getActiveAlerts());

  useEffect(() => {
    const unsub = alertService.subscribe((all) => {
      setAlerts(all.filter((a) => a.status === 'active'));
    });
    return unsub;
  }, []);

  const criticalOrWarningAlert = alerts[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Alert if any */}
      {criticalOrWarningAlert && (
        <div className="rounded-3xl bg-linear-to-r from-red-600 via-red-500 to-orange-600 text-white p-6 sm:p-8 shadow-xl shadow-red-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <AlertTriangle className="w-48 h-48 -mr-12 -mt-12" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-white/20 text-white border border-white/40">
                ACTIVE OFFICIAL WARNING
              </span>
              <span className="text-xs font-mono text-white/80">
                {criticalOrWarningAlert.createdAt} • Issued by {criticalOrWarningAlert.issuedBy}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {criticalOrWarningAlert.severity.toUpperCase()} FLOOD RISK: {criticalOrWarningAlert.area}
            </h2>

            <p className="text-white/95 text-sm sm:text-base max-w-3xl leading-relaxed">
              {criticalOrWarningAlert.message}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
                <Clock className="w-3.5 h-3.5" />
                Expected Time: <strong>{criticalOrWarningAlert.expectedTime}</strong>
              </span>
              <Link
                to="/public/alerts"
                className="underline font-bold text-white hover:text-white/80 flex items-center gap-1"
              >
                View all {alerts.length} active alerts →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Search / Hero Block */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center max-w-4xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
          <MapPin className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            CITIZEN FLOOD RISK CHECKER
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Check Flood Risk in Your Area
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Enter your neighborhood, ward, or select from monitored zones in Bellary Urban to see predicted water level, rainfall intensity, and evacuation guidance.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/public/my-area"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Check My Area</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/public/risk-map"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5 text-slate-500" />
            <span>Explore Public Map</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature/Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weather Card */}
        <Link
          to="/public/my-area"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <CloudRain className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              LIVE MET
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Current Weather</h3>
            <p className="text-xs text-slate-500 mt-1">Severe monsoon downpour</p>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {KPI_SUMMARY.rainfallOverview.currentRateMmHr} <span className="text-xs text-slate-500 font-sans">mm/hr peak</span>
          </div>
          <div className="text-xs text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>Rainfall details</span>
            <span>→</span>
          </div>
        </Link>

        {/* Flood Risk Card */}
        <Link
          to="/public/risk-map"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-red-300 transition space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <RiskBadge level="critical" size="sm" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Flood Risk</h3>
            <p className="text-xs text-slate-500 mt-1">Bellary Urban Lowland</p>
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            84% <span className="text-xs text-slate-500 font-sans">max probability</span>
          </div>
          <div className="text-xs text-red-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>View risk map</span>
            <span>→</span>
          </div>
        </Link>

        {/* Alerts Card */}
        <Link
          to="/public/alerts"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              {alerts.length} Active
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Disaster Alerts</h3>
            <p className="text-xs text-slate-500 mt-1">Official emergency notices</p>
          </div>
          <div className="text-2xl font-black text-orange-600 font-mono">
            {alerts.length} <span className="text-xs text-slate-500 font-sans">bulletins</span>
          </div>
          <div className="text-xs text-orange-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>Read bulletins</span>
            <span>→</span>
          </div>
        </Link>

        {/* Safe Zones Card */}
        <Link
          to="/public/safe-zones"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              OPEN
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Safe Zones</h3>
            <p className="text-xs text-slate-500 mt-1">4 designated relief shelters</p>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            4 <span className="text-xs text-slate-500 font-sans">shelters ready</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>Find nearest shelter</span>
            <span>→</span>
          </div>
        </Link>
      </div>

      {/* Emergency Assistance Footer Box */}
      <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Need Immediate Rescue or Evacuation Assistance?</h4>
            <p className="text-xs text-slate-600">Dial National Disaster Helpline 112 or District Toll-Free 1077.</p>
          </div>
        </div>
        <Link
          to="/public/safety"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shrink-0"
        >
          Read Safety Instructions Guide
        </Link>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import { FloodAlert, AlertSeverity } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  Bell,
  Clock,
  MapPin,
  AlertTriangle,
  Radio,
  Filter,
  ShieldAlert,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const PublicAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<FloodAlert[]>(alertService.getAlerts());
  const [filterSeverity, setFilterSeverity] = useState<'all' | AlertSeverity>('all');
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const unsub = alertService.subscribe((updated) => {
      setAlerts(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    });
    return unsub;
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const filteredAlerts = activeAlerts.filter(
    (a) => filterSeverity === 'all' || a.severity === filterSeverity
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
              PUBLIC BROADCAST STREAM
            </span>
            {justUpdated && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-bounce">
                <Sparkles className="w-3 h-3" /> Live Alert Sync Received!
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Active Flood Alerts & Warnings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Official emergency alerts issued by Disaster Management Authorities for citizen safety and evacuation.
          </p>
        </div>

        {/* Live status pill */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-700 font-medium">REAL-TIME FIRESTORE LISTENER CONNECTED</span>
        </div>
      </div>

      {/* Filter and Summary Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter by Severity:</span>
          {(['all', 'critical', 'warning', 'advisory'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-semibold transition ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredAlerts.length}</strong> of <strong>{activeAlerts.length}</strong> active alerts
        </div>
      </div>

      {/* Alert Cards Stream */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Active Alerts In This Category</h3>
          <p className="text-xs text-slate-500">
            There are currently no active warnings matching your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-md transition relative overflow-hidden ${
                  isCritical
                    ? 'border-red-300/80 hover:border-red-500 shadow-red-500/5'
                    : isWarning
                    ? 'border-orange-300/80 hover:border-orange-400'
                    : 'border-slate-200'
                }`}
              >
                {/* Left accent color bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-2 ${
                    isCritical ? 'bg-red-600' : isWarning ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <RiskBadge level={alert.severity} size="md" />
                      <span className="text-xs font-mono font-medium text-slate-400">
                        • {alert.createdAt}
                      </span>
                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {alert.issuedBy}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{alert.area}</span>
                    </h3>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed pt-1">
                      {alert.message}
                    </p>

                    {/* Metadata tags */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Expected Risk Window: <strong className="text-slate-800 ml-1">{alert.expectedTime}</strong>
                      </span>
                      {alert.floodProbability && (
                        <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl">
                          Flood Probability: <strong className="text-orange-600 ml-1">{alert.floodProbability}%</strong>
                        </span>
                      )}
                      {alert.warningLeadTime && (
                        <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl">
                          Lead Time: <strong className="text-slate-800 ml-1">{alert.warningLeadTime}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

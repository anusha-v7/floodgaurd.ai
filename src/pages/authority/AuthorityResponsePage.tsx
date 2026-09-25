import React, { useState, useEffect } from 'react';
import { responseService } from '../../services/responseService';
import { EmergencyActionItem } from '../../types';
import { INITIAL_AREAS } from '../../data/floodGuardData';
import { SimulatedBanner } from '../../components/common/SimulatedBanner';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  Radio,
  CheckSquare,
  Square,
  Play,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Shield,
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';

export const AuthorityResponsePage: React.FC = () => {
  const [actions, setActions] = useState<EmergencyActionItem[]>(responseService.getActions());
  const [selectedZoneId, setSelectedZoneId] = useState('zone-a');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const unsub = responseService.subscribe((updated) => {
      setActions(updated);
    });
    return unsub;
  }, []);

  const selectedZone =
    INITIAL_AREAS.find((a) => a.id === selectedZoneId) || INITIAL_AREAS[0];

  const zoneActions = actions.filter((act) => act.zoneId === selectedZoneId);
  const completedCount = zoneActions.filter((act) => act.completed).length;
  const isAllStarted = zoneActions.length > 0 && completedCount === zoneActions.length;

  const handleToggle = (id: string) => {
    responseService.toggleAction(id);
  };

  const handleMarkAllStarted = () => {
    responseService.markAllResponseStarted(selectedZoneId);
    setSuccessToast(`Emergency response units successfully mobilized for ${selectedZone.name}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleReset = () => {
    responseService.resetActions();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              TACTICAL INCIDENT DISPATCH
            </span>
            <SimulatedBanner />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Emergency Response Coordination Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Inter-agency emergency response tracking for NDRF, SDRF, municipal drainage brigades, and hospital access squads.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Action Status</span>
        </button>
      </div>

      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Zone Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Select Target Incident Zone:</span>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            {INITIAL_AREAS.filter((a) => a.riskLevel === 'critical' || a.riskLevel === 'high').map((a) => (
              <option key={a.id} value={a.id}>
                {a.code}: {a.name} ({a.riskLevel.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Action Completion: <strong className="text-cyan-400">{completedCount} / {zoneActions.length}</strong>
          </span>
          <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${zoneActions.length ? (completedCount / zoneActions.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Focus Zone Card */}
      <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                CRITICAL TARGET ZONE
              </span>
              <RiskBadge level={selectedZone.riskLevel} size="sm" />
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedZone.name}</h2>
            <p className="text-xs text-slate-400 font-mono">
              Flood Probability: <span className="text-orange-400 font-bold">{selectedZone.floodProbability}%</span> • Lead Time: <span className="text-cyan-400 font-bold">{selectedZone.warningLeadTime}</span> • At Risk: ~{selectedZone.populationAtRisk.toLocaleString()} citizens
            </p>
          </div>

          <button
            onClick={handleMarkAllStarted}
            disabled={isAllStarted}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-mono uppercase font-bold text-xs tracking-wider shadow-lg transition ${
              isAllStarted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 hover:scale-105'
            }`}
          >
            {isAllStarted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>RESPONSE ACTIVE & DISPATCHED</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>MARK RESPONSE STARTED</span>
              </>
            )}
          </button>
        </div>

        {/* Recommended Actions Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Mandatory Standard Operating Procedures (SOP):
          </h3>

          <div className="space-y-2.5">
            {zoneActions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button type="button" className="text-cyan-400">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {item.action}
                    </p>
                    <span className="text-[11px] font-mono text-slate-500">
                      Assigned Unit: <strong className="text-cyan-300">{item.assignedUnit}</strong>
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold border ${
                    item.completed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}
                >
                  {item.completed ? 'Mobilized' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

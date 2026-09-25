import React, { useState } from 'react';
import { AreaRisk, AlertSeverity } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { alertService } from '../../services/alertService';
import {
  X,
  Send,
  AlertTriangle,
  Clock,
  Gauge,
  Droplets,
  Ruler,
  Users,
  Compass,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface ZoneDetailsModalProps {
  area: AreaRisk | null;
  onClose: () => void;
  onAlertCreated?: () => void;
}

export const ZoneDetailsModal: React.FC<ZoneDetailsModalProps> = ({
  area,
  onClose,
  onAlertCreated,
}) => {
  const [isDraftingAlert, setIsDraftingAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [customMessage, setCustomMessage] = useState('');
  const [expectedTime, setExpectedTime] = useState('Next 2–3 hours');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!area) return null;

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const messageText =
      customMessage.trim() ||
      `Heavy rainfall (${area.rainfallMmHr} mm/hr) expected to cause water accumulation reaching ${area.floodDepthM}m in ${area.name}. ${area.recommendedAction}`;

    await alertService.createAlert({
      area: area.name,
      areaId: area.id,
      severity,
      message: messageText,
      expectedTime,
      issuedBy: 'Authority Command Center',
      floodProbability: area.floodProbability,
      warningLeadTime: area.warningLeadTime,
    });

    setSubmitting(false);
    setSuccessNotice(true);
    if (onAlertCreated) onAlertCreated();

    setTimeout(() => {
      setSuccessNotice(false);
      setIsDraftingAlert(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {area.code}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{area.name}</h2>
              <p className="text-xs text-slate-400 font-mono">
                GPS: {area.coordinates[0].toFixed(3)}°N, {area.coordinates[1].toFixed(3)}°E • Updated {area.lastUpdated}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {/* Main Risk Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1">CURRENT RISK STATUS</span>
              <RiskBadge level={area.riskLevel} size="lg" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">AI FLOOD PROBABILITY</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{area.floodProbability}%</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">AI CONFIDENCE</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{area.aiConfidence}%</span>
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Current Rainfall</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{area.rainfallMmHr} <span className="text-xs text-slate-400">mm/h</span></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Predicted 6h Rain</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{area.predictedRainfallMm} <span className="text-xs text-slate-400">mm</span></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span>Water Level</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{area.waterLevelM} <span className="text-xs text-slate-400">m</span></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Warning Lead Time</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{area.warningLeadTime}</div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Flood Inundation Depth</span>
              <span className="font-mono font-bold text-slate-200">{area.floodDepthM} m</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Affected Area</span>
              <span className="font-mono font-bold text-slate-200">{area.affectedAreaKm2} km²</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Population at Risk</span>
              <span className="font-mono font-bold text-slate-200">~{area.populationAtRisk.toLocaleString()}</span>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
            <div className="flex items-center gap-2 font-mono uppercase font-bold text-cyan-400 mb-1.5">
              <Cpu className="w-4 h-4" />
              <span>Recommended Authority Action</span>
            </div>
            <p className="text-cyan-100 leading-relaxed text-sm">{area.recommendedAction}</p>
          </div>

          {/* Inline Alert Creator Form */}
          {isDraftingAlert ? (
            <form onSubmit={handleSendAlert} className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-orange-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Dispatch Emergency Alert to Public & SDRF
                </span>
                <button
                  type="button"
                  onClick={() => setIsDraftingAlert(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {successNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Alert broadcast saved to Firestore and synced to Public Portal in real-time!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">
                    Alert Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="advisory">Advisory (Green / Low)</option>
                    <option value="warning">Warning (Orange / High)</option>
                    <option value="critical">Critical (Red / Emergency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">
                    Expected Risk Timeframe
                  </label>
                  <input
                    type="text"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="e.g. Next 2–3 hours"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">
                  Public Warning Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  placeholder={`Heavy rainfall (${area.rainfallMmHr} mm/hr) may cause flooding. ${area.recommendedAction}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDraftingAlert(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Broadcasting...' : 'Broadcast Public Alert'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Model: Hydrological Hydro-ConvLSTM v2.1
              </span>
              <button
                onClick={() => setIsDraftingAlert(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono uppercase font-bold text-xs tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                ISSUE ALERT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

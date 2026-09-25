import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import { FloodAlert, AlertSeverity } from '../../types';
import { INITIAL_AREAS } from '../../data/floodGuardData';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  BellRing,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Check,
  Radio,
  Filter,
  Eye,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthorityAlertsPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<FloodAlert[]>(alertService.getAlerts());
  const [selectedAreaId, setSelectedAreaId] = useState(INITIAL_AREAS[0].id);
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [message, setMessage] = useState('');
  const [expectedTime, setExpectedTime] = useState('Next 2–3 hours');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    const unsub = alertService.subscribe((updated) => {
      setAlerts(updated);
    });
    return unsub;
  }, []);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aid = e.target.value;
    setSelectedAreaId(aid);
    const area = INITIAL_AREAS.find((a) => a.id === aid);
    if (area) {
      setMessage(
        `Critical flood risk warning for ${area.name}. Current rainfall ${area.rainfallMmHr} mm/hr may cause water accumulation up to ${area.floodDepthM}m. ${area.recommendedAction}`
      );
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const area = INITIAL_AREAS.find((a) => a.id === selectedAreaId) || INITIAL_AREAS[0];

    const created = await alertService.createAlert({
      area: area.name,
      areaId: area.id,
      severity,
      message,
      expectedTime,
      issuedBy: `${user?.name || 'SDMA Commander'} (${user?.department || 'Emergency Operations'})`,
      floodProbability: area.floodProbability,
      warningLeadTime: area.warningLeadTime,
    });

    setSubmitting(false);
    setSuccessNotice(`Alert broadcast successfully dispatched! Public Citizen Portal has been updated in real-time.`);
    setMessage('');

    setTimeout(() => {
      setSuccessNotice(null);
    }, 4500);
  };

  const handleResolveAlert = async (id: string) => {
    await alertService.resolveAlert(id);
  };

  const handleResetDemo = () => {
    alertService.resetDemoAlerts();
  };

  const filteredAlerts = alerts.filter(
    (a) => filterStatus === 'all' || a.status === filterStatus
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              DISASTER BROADCAST SYSTEM
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
              CELL BROADCAST ENABLED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Emergency Alert Dispatch Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Issue verified flood warnings directly into the Public Portal and state emergency response channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/public/alerts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Alerts View</span>
          </a>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition"
            title="Reset default demo alerts"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Create Alert Form + Active Alerts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Alert Form (Left Column) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" />
              <h2 className="text-base font-bold text-white uppercase tracking-tight">
                Create & Broadcast Alert
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">FIRESTORE SYNC</span>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Broadcast Live!</p>
                <p className="text-emerald-300/90 text-[11px] mt-0.5">{successNotice}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Target Zone / Area
              </label>
              <select
                value={selectedAreaId}
                onChange={handleAreaChange}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-cyan-500"
              >
                {INITIAL_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.riskLevel.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['advisory', 'warning', 'critical'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono uppercase font-bold border transition ${
                      severity === lvl
                        ? lvl === 'critical'
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                          : lvl === 'warning'
                          ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/30'
                          : 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Expected Inundation Timeframe
              </label>
              <input
                type="text"
                required
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                placeholder="e.g. Next 2–3 hours"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Public Warning Instructions
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed guidance for citizens (e.g. evacuate ground floors, move vehicles, avoid low bridges)..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono uppercase font-bold text-xs tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Broadcasting Alert...' : 'SEND PUBLIC ALERT'}</span>
            </button>
          </form>
        </div>

        {/* Active Alerts List (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-400 uppercase">Status:</span>
              {(['all', 'active', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono uppercase transition ${
                    filterStatus === st
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Total Bulletins: <strong className="text-white">{filteredAlerts.length}</strong>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition space-y-3 relative overflow-hidden ${
                  alert.status === 'resolved'
                    ? 'border-slate-800/80 opacity-60'
                    : alert.severity === 'critical'
                    ? 'border-red-500/40 hover:border-red-500'
                    : 'border-orange-500/40 hover:border-orange-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <RiskBadge level={alert.severity} size="sm" />
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {alert.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {alert.createdAt} • by {alert.issuedBy}
                    </span>
                    {alert.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>Expected: <strong className="text-white">{alert.expectedTime}</strong></span>
                    {alert.floodProbability && (
                      <span>Probability: <strong className="text-orange-400">{alert.floodProbability}%</strong></span>
                    )}
                    {alert.warningLeadTime && (
                      <span>Lead Time: <strong className="text-white">{alert.warningLeadTime}</strong></span>
                    )}
                  </div>

                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

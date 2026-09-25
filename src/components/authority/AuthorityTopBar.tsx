import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Radio,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';
import { FloodAlert } from '../../types';

interface AuthorityTopBarProps {
  onToggleMobileMenu: () => void;
}

export const AuthorityTopBar: React.FC<AuthorityTopBarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [alerts, setAlerts] = useState<FloodAlert[]>(alertService.getActiveAlerts());
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = alertService.subscribe((allAlerts) => {
      setAlerts(allAlerts.filter((a) => a.status === 'active'));
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/authority/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & System status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider">SYSTEM LIVE</span>
          </div>

          <span className="hidden sm:inline-block text-xs font-mono text-slate-500">|</span>

          <span className="hidden sm:inline-block text-xs font-mono text-cyan-400/90">
            BELLARY COMMAND CELL
          </span>
        </div>
      </div>

      {/* Center: Live Clock */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-mono bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-slate-300">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>{date}</span>
        <span className="text-cyan-400 font-bold">{time} IST</span>
      </div>

      {/* Right: Notifications, Public View, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to public portal */}
        <Link
          to="/public"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
          title="Open Citizen Public Portal"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span>Public Portal</span>
        </Link>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition"
            title="Active Incident Alerts"
            aria-label="View Incident Alerts"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Active Alerts Broadcast</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                    {alerts.length} Active
                  </span>
                </div>
                <Link
                  to="/authority/alerts"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Manage →
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active alerts at this moment</p>
                ) : (
                  alerts.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{a.area}</span>
                        <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-2">{a.message}</p>
                      <div className="mt-1.5 text-[10px] text-slate-500 font-mono">
                        Lead: {a.warningLeadTime} • {a.createdAt}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <Link
            to="/authority/profile"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.name || 'SDMA Commander'}
              </p>
              <p className="text-[10px] font-mono text-cyan-400 leading-tight">
                {user?.role?.toUpperCase()}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            title="Sign out of command center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

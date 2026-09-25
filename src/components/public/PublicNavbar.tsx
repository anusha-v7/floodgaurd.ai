import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Waves,
  Bell,
  Shield,
  MapPin,
  Compass,
  ShieldCheck,
  Menu,
  X,
  Lock,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthority, user, logout } = useAuth();
  const [activeAlertsCount, setActiveAlertsCount] = useState(alertService.getActiveAlerts().length);

  React.useEffect(() => {
    const unsub = alertService.subscribe((alerts) => {
      setActiveAlertsCount(alerts.filter((a) => a.status === 'active').length);
    });
    return unsub;
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/public', label: 'Public Portal' },
    { to: '/public/my-area', label: 'Check My Area', icon: MapPin },
    { to: '/public/risk-map', label: 'Risk Map', icon: Compass },
    {
      to: '/public/alerts',
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
    },
    { to: '/public/safe-zones', label: 'Safe Zones', icon: ShieldCheck },
    { to: '/public/safety', label: 'Safety Guide', icon: Shield },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Emergency banner ticker if alerts exist */}
      {activeAlertsCount > 0 && (
        <div className="bg-red-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              <strong>EMERGENCY ADVISORY:</strong> {activeAlertsCount} active flood alerts issued for Bellary Urban basin.
            </span>
            <Link
              to="/public/alerts"
              className="ml-auto underline font-semibold text-white/90 hover:text-white shrink-0 text-[11px]"
            >
              View Active Warnings →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">FLOODGUARD</span>
                <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Predict. Warn. Respond.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    active
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Authority Portal Action */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthority && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/authority/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 shadow-xs transition"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Command Center ({user.name.split(' ')[0]})</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition"
                  title="Sign Out of Authority Command"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/authority/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-300 transition"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Authority Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to="/authority/login"
              className="p-2 text-slate-600 hover:text-slate-900"
              title="Authority Login"
            >
              <Lock className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {link.icon && <link.icon className="w-4 h-4 text-slate-500" />}
                {link.label}
              </span>
              {link.badge !== null && link.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-200 mt-2 space-y-2">
            {isAuthority && user ? (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">Disaster Authority</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/authority/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-cyan-300 font-bold px-2 py-1 bg-cyan-950 rounded-lg border border-cyan-500/30"
                  >
                    Command
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-400 font-bold px-2 py-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/authority/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-cyan-300"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authority Officer Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Shield, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FloodGuard AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predict. Warn. Respond. An intelligent flood early warning and inundation prediction system built for disaster authorities and citizen resilience.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Prototype Version 1.2.0 • Bellary Pilot Region
            </div>
          </div>

          {/* Public Portal Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Citizen Portal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/public/my-area" className="hover:text-white transition">Check My Area</Link>
              </li>
              <li>
                <Link to="/public/risk-map" className="hover:text-white transition">Public Risk Map</Link>
              </li>
              <li>
                <Link to="/public/alerts" className="hover:text-white transition">Active Alerts</Link>
              </li>
              <li>
                <Link to="/public/safe-zones" className="hover:text-white transition">Safe Evacuation Zones</Link>
              </li>
              <li>
                <Link to="/public/safety" className="hover:text-white transition">Safety Instructions Guide</Link>
              </li>
            </ul>
          </div>

          {/* Authority Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Emergency Authority
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/authority/login" className="hover:text-white transition flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Command Center Login
                </Link>
              </li>
              <li>
                <Link to="/authority/dashboard" className="hover:text-white transition">Operations Dashboard</Link>
              </li>
              <li>
                <Link to="/authority/rainfall" className="hover:text-white transition">Rainfall Intelligence</Link>
              </li>
              <li>
                <Link to="/authority/inundation" className="hover:text-white transition">Inundation Forecasting</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">System Architecture & AI</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              Emergency Hotlines
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[11px]">Disaster Management Toll-Free</span>
                <span className="text-white font-mono font-bold text-sm">1077 / 112</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block text-[11px]">State Flood Control Room</span>
                <span className="text-white font-mono font-bold text-sm">+91 8392 270111</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FloodGuard AI. Built for Smart India Hackathon / Disaster Management Resilience.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Official Disaster Advisory
            </span>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">Privacy & Terms</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">Architecture Spec</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

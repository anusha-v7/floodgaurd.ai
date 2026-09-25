import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  CheckSquare,
  AlertTriangle,
  FileText,
  LifeBuoy,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const PublicSafetyPage: React.FC = () => {
  const duringRainRules = [
    {
      title: 'Avoid Low-Lying Areas & Underpasses',
      desc: 'Never walk, swim, or drive through flooded culverts, road dips, or canal banks. Rapid runoff of even 15 cm can sweep an adult off their feet.',
    },
    {
      title: 'Avoid Flooded Roads & Bridges',
      desc: 'Do not drive into water where the road surface is not visible. Over 60% of flood fatalities occur in motor vehicles stalled in submerged roadways.',
    },
    {
      title: 'Follow Official Warning Advisories',
      desc: 'Tune into official SDMA, police, and FloodGuard AI alert bulletins. Follow localized ward evacuation instructions promptly.',
    },
    {
      title: 'Move Toward Designated Safe Locations',
      desc: 'If water enters your residential compound, immediately disconnect the main electrical breaker and relocate to higher ground or assigned public relief shelters.',
    },
    {
      title: 'Keep Emergency Contacts Accessible',
      desc: 'Keep cell phones charged and maintain battery power banks in waterproof plastic pouches.',
    },
  ];

  const beforeFloodRules = [
    {
      title: 'Monitor Official Early Alerts',
      desc: 'Check the FloodGuard AI Citizen Portal regularly for 1h to 6h rainfall trends and probabilistic warning lead times.',
    },
    {
      title: 'Prepare Emergency Go-Kit Supplies',
      desc: 'Store 3 days of clean drinking water, non-perishable food, prescription medication, first-aid supplies, battery flashlights, and whistles.',
    },
    {
      title: 'Protect Vital Documents & Valuables',
      desc: 'Keep identity cards (Aadhaar, passports, property deeds) in double-sealed waterproof zip bags and keep digital backups on secure cloud storage.',
    },
    {
      title: 'Identify Safe Evacuation Routes',
      desc: 'Familiarize yourself with the nearest higher ground plateau or municipal relief center before floodwaters sever road access.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
          DISASTER PREPAREDNESS PROTOCOL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Citizen Flood Safety Instructions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Crucial guidelines and life-saving checklists to protect yourself and your family before and during extreme rainfall inundation events.
        </p>
      </div>

      {/* Two Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: During Heavy Rain */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
                IMMEDIATE ACTIONS
              </span>
              <h2 className="text-2xl font-bold text-slate-900">During Heavy Rain & Flooding</h2>
            </div>
          </div>

          <div className="space-y-4">
            {duringRainRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Before a Flood */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                PROACTIVE READINESS
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Before a Flood Occurs</h2>
            </div>
          </div>

          <div className="space-y-4">
            {beforeFloodRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Go-Kit Checklist Box */}
      <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                EMERGENCY EVACUATION CHECKLIST
              </span>
              <h3 className="text-2xl font-bold text-white">72-Hour Survival Go-Bag</h3>
            </div>
          </div>
          <Link
            to="/public/safe-zones"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>View Safe Shelters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold block">1. Hydration & Nutrition</span>
            <p className="text-slate-300 leading-relaxed">
              3 liters bottled water per person per day, high-calorie energy bars, dry fruits, and baby food.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold block">2. Medical & First Aid</span>
            <p className="text-slate-300 leading-relaxed">
              Essential prescription medications (7 days), antiseptic wipes, bandages, oral rehydration salts (ORS).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold block">3. Power & Signalling</span>
            <p className="text-slate-300 leading-relaxed">
              High-intensity LED flashlight, battery radio, portable power banks, spare cables, and acoustic whistle.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold block">4. Waterproof Protection</span>
            <p className="text-slate-300 leading-relaxed">
              Waterproof pouch for identity papers, cash, rain poncho, thermal foil emergency blankets.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Row */}
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-red-950">Immediate Emergency Contacts</h4>
            <p className="text-xs text-red-800">Available 24/7 during severe weather alerts</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-white px-4 py-2 rounded-xl border border-red-200 text-slate-800">
            National Disaster Response (NDRF): <strong className="text-red-600 font-bold">112</strong>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-red-200 text-slate-800">
            District Disaster Management: <strong className="text-red-600 font-bold">1077</strong>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-red-200 text-slate-800">
            Ambulance Service: <strong className="text-red-600 font-bold">108</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

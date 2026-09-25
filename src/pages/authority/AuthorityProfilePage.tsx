import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  ShieldCheck,
  Building,
  BadgeAlert,
  LogOut,
  KeyRound,
  CheckCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

export const AuthorityProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/authority/login');
  };

  const permissions = [
    { title: 'Public Cell Broadcast Alerts', granted: true, desc: 'Authorize and transmit real-time alerts to the Citizen Portal' },
    { title: 'Hydrological ML Inferences', granted: true, desc: 'Access 1h–24h precipitation curves and depth predictions' },
    { title: 'Critical Infrastructure Triage', granted: true, desc: 'Monitor access roads to hospitals, bridges, and power grids' },
    { title: 'SDRF / NDRF Incident Mobilization', granted: true, desc: 'Change tactical response status for critical catchment zones' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          SECURITY & ACCESS CONTROL
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Authority Officer Profile
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Role-Based Access Control (RBAC) credential verification and assigned operational privileges.
        </p>
      </div>

      {/* Main Profile Badge Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-600/20">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.name || 'SDMA Authorized Commander'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-1">{user?.department}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-mono text-xs font-bold transition self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">AUTHENTICATED UID</span>
            <span className="text-slate-200 font-bold">{user?.uid || 'auth_officer_001'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">BADGE IDENTIFIER</span>
            <span className="text-cyan-400 font-bold">{user?.badgeId || 'SDMA-EMERG-8492'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">OPERATIONAL JURISDICTION</span>
            <span className="text-slate-200 font-bold">{user?.jurisdiction || 'Bellary District Central Command'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-500 block">AUTHENTICATION PROVIDER</span>
            <span className="text-emerald-400 font-bold">Firebase Auth / Role Engine</span>
          </div>
        </div>

        {/* Authorized Privileges */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Verified RBAC Capabilities
          </h3>

          <div className="space-y-2">
            {permissions.map((perm) => (
              <div
                key={perm.title}
                className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{perm.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{perm.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

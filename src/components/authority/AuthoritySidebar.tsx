import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CloudRain,
  Waves,
  BrainCircuit,
  BellRing,
  MapPin,
  Building2,
  BarChart3,
  Database,
  Radio,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';

interface AuthoritySidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AuthoritySidebar: React.FC<AuthoritySidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAlertsCount, setActiveAlertsCount] = useState(alertService.getActiveAlerts().length);

  React.useEffect(() => {
    const unsub = alertService.subscribe((alerts) => {
      setActiveAlertsCount(alerts.filter((a) => a.status === 'active').length);
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/authority/login');
  };

  const navItems = [
    { to: '/authority/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/authority/risk-map', label: 'Risk Map', icon: Compass },
    { to: '/authority/rainfall', label: 'Rainfall', icon: CloudRain },
    { to: '/authority/inundation', label: 'Inundation', icon: Waves },
    { to: '/authority/predictions', label: 'AI Predictions', icon: BrainCircuit },
    {
      to: '/authority/alerts',
      label: 'Alerts',
      icon: BellRing,
      badge: activeAlertsCount,
    },
    { to: '/authority/risk-areas', label: 'Risk Areas', icon: MapPin },
    { to: '/authority/assets', label: 'Critical Assets', icon: Building2 },
    { to: '/authority/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/authority/data-sources', label: 'Data Sources', icon: Database },
    { to: '/authority/response', label: 'Response Center', icon: Radio },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 h-screen z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5 text-cyan-200" />
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white tracking-tight">FLOODGUARD</span>
                  <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    AUTHORITY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider">COMMAND CENTER</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-slate-800">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
          <div className={`px-2 py-1 text-[10px] font-mono tracking-wider uppercase text-slate-500 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'OPS' : 'Operations'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition group relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 transition group-hover:scale-110" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white ${
                      collapsed ? 'absolute top-1 right-1' : ''
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3">
            <div className={`px-2 py-1 text-[10px] font-mono tracking-wider uppercase text-slate-500 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? 'SYS' : 'System'}
            </div>
            <NavLink
              to="/authority/profile"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? 'Profile & Auth' : undefined}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Officer Profile</span>}
            </NavLink>
          </div>
        </div>

        {/* Public Portal Switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <a
            href="/public"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 p-2 rounded-xl text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Open Public Citizen Portal in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>View Public Portal</span>}
          </a>

          {/* User profile & Logout */}
          <div className={`mt-2 pt-2 border-t border-slate-800/80 flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
            {!collapsed && (
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'SDMA Officer'}</p>
                <p className="text-[10px] text-cyan-400 font-mono truncate">{user?.email || 'authority@floodguard.gov'}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Logout from Authority Command"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

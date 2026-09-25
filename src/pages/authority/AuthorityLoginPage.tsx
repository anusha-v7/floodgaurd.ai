import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  LogIn,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const AuthorityLoginPage: React.FC = () => {
  const [email, setEmail] = useState('authority@floodguard.gov');
  const [password, setPassword] = useState('authority123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginAuthority, demoLoginAuthority } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/authority/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setForgotPasswordMsg(false);
    setLoading(true);

    try {
      const res = await loginAuthority(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify authority credentials.');
        setLoading(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAuthority = async () => {
    await demoLoginAuthority();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Command Center Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-700 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-500/20">
            <ShieldAlert className="w-9 h-9 text-cyan-200" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL DISASTER AUTHORITY</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Authority Command Center
          </h1>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Authorized portal for State Disaster Management (SDMA), NDRF commanders, and municipal flood cells.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Denied</p>
                <p className="text-red-300/90 mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Forgot Password Notice */}
          {forgotPasswordMsg && (
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Password reset instructions dispatched. For immediate demonstration, use the prefilled authority credentials.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Official Authority Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="authority@floodguard.gov"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMsg(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-600/25 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate & Enter Command</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block text-center">
              Quick Prototype Evaluation
            </span>

            <button
              type="button"
              onClick={handleQuickDemoAuthority}
              className="w-full py-2.5 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 font-bold transition flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              1-Click Sign in as Authority Officer
            </button>
          </div>

          {/* Citizen Public Portal Links */}
          <div className="border-t border-slate-800 pt-4 text-center space-y-2 text-xs">
            <div>
              <Link
                to="/public"
                className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold hover:underline text-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                Looking for Public Flood Forecasts & Alerts? Open Public Citizen Portal →
              </Link>
            </div>
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition text-[11px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to FloodGuard AI Landing Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

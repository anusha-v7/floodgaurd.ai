import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm tracking-widest text-cyan-400">VERIFYING CREDENTIALS...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/authority/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

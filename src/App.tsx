import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthorityLayout } from './layouts/AuthorityLayout';
import { AuthorityRoute } from './components/auth/AuthorityRoute';

// Public Pages (Open access - No login required)
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { PublicMyAreaPage } from './pages/public/PublicMyAreaPage';
import { PublicRiskMapPage } from './pages/public/PublicRiskMapPage';
import { PublicAlertsPage } from './pages/public/PublicAlertsPage';
import { PublicSafeZonesPage } from './pages/public/PublicSafeZonesPage';
import { PublicSafetyPage } from './pages/public/PublicSafetyPage';

// Authority Pages (Secured - Authentication required)
import { AuthorityLoginPage } from './pages/authority/AuthorityLoginPage';
import { AuthorityDashboardPage } from './pages/authority/AuthorityDashboardPage';
import { AuthorityRiskMapPage } from './pages/authority/AuthorityRiskMapPage';
import { AuthorityRiskAreasPage } from './pages/authority/AuthorityRiskAreasPage';
import { AuthorityRainfallPage } from './pages/authority/AuthorityRainfallPage';
import { AuthorityPredictionsPage } from './pages/authority/AuthorityPredictionsPage';
import { AuthorityInundationPage } from './pages/authority/AuthorityInundationPage';
import { AuthorityAlertsPage } from './pages/authority/AuthorityAlertsPage';
import { AuthorityAssetsPage } from './pages/authority/AuthorityAssetsPage';
import { AuthorityDataSourcesPage } from './pages/authority/AuthorityDataSourcesPage';
import { AuthorityAnalyticsPage } from './pages/authority/AuthorityAnalyticsPage';
import { AuthorityResponsePage } from './pages/authority/AuthorityResponsePage';
import { AuthorityProfilePage } from './pages/authority/AuthorityProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Citizen Portal (Completely Open - No Authentication Required) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/public" element={<PublicHomePage />} />
            <Route path="/public/my-area" element={<PublicMyAreaPage />} />
            <Route path="/public/risk-map" element={<PublicRiskMapPage />} />
            <Route path="/public/alerts" element={<PublicAlertsPage />} />
            <Route path="/public/safe-zones" element={<PublicSafeZonesPage />} />
            <Route path="/public/safety" element={<PublicSafetyPage />} />
          </Route>

          {/* Quick alias for official login */}
          <Route path="/login" element={<Navigate to="/authority/login" replace />} />

          {/* Authority Authentication (Disaster Management Officials Only) */}
          <Route path="/authority/login" element={<AuthorityLoginPage />} />

          {/* Redirect /authority root to /authority/dashboard */}
          <Route path="/authority" element={<Navigate to="/authority/dashboard" replace />} />

          {/* Authority Command Center Routes (Guarded by AuthorityRoute with Dark Theme) */}
          <Route
            element={
              <AuthorityRoute>
                <AuthorityLayout />
              </AuthorityRoute>
            }
          >
            <Route path="/authority/dashboard" element={<AuthorityDashboardPage />} />
            <Route path="/authority/risk-map" element={<AuthorityRiskMapPage />} />
            <Route path="/authority/risk-areas" element={<AuthorityRiskAreasPage />} />
            <Route path="/authority/rainfall" element={<AuthorityRainfallPage />} />
            <Route path="/authority/predictions" element={<AuthorityPredictionsPage />} />
            <Route path="/authority/inundation" element={<AuthorityInundationPage />} />
            <Route path="/authority/alerts" element={<AuthorityAlertsPage />} />
            <Route path="/authority/assets" element={<AuthorityAssetsPage />} />
            <Route path="/authority/data-sources" element={<AuthorityDataSourcesPage />} />
            <Route path="/authority/analytics" element={<AuthorityAnalyticsPage />} />
            <Route path="/authority/response" element={<AuthorityResponsePage />} />
            <Route path="/authority/profile" element={<AuthorityProfilePage />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

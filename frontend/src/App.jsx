import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrialsProvider } from './context/TrialsContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TrialsPage from './pages/TrialsPage';
import TrialDetailPage from './pages/TrialDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import SitesPage from './pages/SitesPage';
import MilestonesPage from './pages/MilestonesPage';
import PharmacovigilancePage from './pages/PharmacovigilancePage';
import RegulatoryEthicsPage from './pages/RegulatoryEthicsPage';
import DataQualityPage from './pages/DataQualityPage';
import RiskAlertsPage from './pages/RiskAlertsPage';
import ReportsExportsPage from './pages/ReportsExportsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import InteroperabilityPage from './pages/InteroperabilityPage';
import SecurityCompliancePage from './pages/SecurityCompliancePage';
import UsersRolesPage from './pages/UsersRolesPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TrialsProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Enterprise CTMS Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="trials" element={<TrialsPage />} />
              <Route path="trials/:id" element={<TrialDetailPage />} />
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="sites" element={<SitesPage />} />
              <Route path="milestones" element={<MilestonesPage />} />
              <Route path="pharmacovigilance" element={<PharmacovigilancePage />} />
              <Route path="regulatory-ethics" element={<RegulatoryEthicsPage />} />
              <Route path="data-quality" element={<DataQualityPage />} />
              <Route path="risk-alerts" element={<RiskAlertsPage />} />
              <Route path="reports-exports" element={<ReportsExportsPage />} />
              <Route path="audit-trail" element={<AuditTrailPage />} />
              <Route path="interoperability" element={<InteroperabilityPage />} />
              <Route path="security-compliance" element={<SecurityCompliancePage />} />
              <Route path="users-roles" element={<UsersRolesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TrialsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

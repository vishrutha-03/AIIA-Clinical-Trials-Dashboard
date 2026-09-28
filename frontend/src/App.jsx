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

function ModuleRoute({ moduleId, children }) {
  const { canAccessModule } = useAuth();
  return canAccessModule(moduleId) ? children : <Navigate to="/" replace />;
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
              <Route index element={<ModuleRoute moduleId="dashboard"><DashboardPage /></ModuleRoute>} />
              <Route path="trials" element={<ModuleRoute moduleId="trials"><TrialsPage /></ModuleRoute>} />
              <Route path="trials/:id" element={<ModuleRoute moduleId="trials"><TrialDetailPage /></ModuleRoute>} />
              <Route path="participants" element={<ModuleRoute moduleId="participants"><ParticipantsPage /></ModuleRoute>} />
              <Route path="sites" element={<ModuleRoute moduleId="sites"><SitesPage /></ModuleRoute>} />
              <Route path="milestones" element={<ModuleRoute moduleId="milestones"><MilestonesPage /></ModuleRoute>} />
              <Route path="pharmacovigilance" element={<ModuleRoute moduleId="pv"><PharmacovigilancePage /></ModuleRoute>} />
              <Route path="regulatory-ethics" element={<ModuleRoute moduleId="regulatory"><RegulatoryEthicsPage /></ModuleRoute>} />
              <Route path="data-quality" element={<ModuleRoute moduleId="dataQuality"><DataQualityPage /></ModuleRoute>} />
              <Route path="risk-alerts" element={<ModuleRoute moduleId="riskAlerts"><RiskAlertsPage /></ModuleRoute>} />
              <Route path="reports-exports" element={<ModuleRoute moduleId="reports"><ReportsExportsPage /></ModuleRoute>} />
              <Route path="audit-trail" element={<ModuleRoute moduleId="auditTrail"><AuditTrailPage /></ModuleRoute>} />
              <Route path="interoperability" element={<ModuleRoute moduleId="interoperability"><InteroperabilityPage /></ModuleRoute>} />
              <Route path="security-compliance" element={<ModuleRoute moduleId="security"><SecurityCompliancePage /></ModuleRoute>} />
              <Route path="users-roles" element={<ModuleRoute moduleId="users"><UsersRolesPage /></ModuleRoute>} />
              <Route path="settings" element={<ModuleRoute moduleId="settings"><SettingsPage /></ModuleRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TrialsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

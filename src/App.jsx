import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ActionHubPage } from './pages/ActionHubPage';
import { RecyclingMapPage } from './pages/RecyclingMapPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { RewardsPage } from './pages/RewardsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Dashboard Application Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/actions" element={<ActionHubPage />} />
              <Route path="/map" element={<RecyclingMapPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

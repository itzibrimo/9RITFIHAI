import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthCallback } from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { NotesPage } from './pages/NotesPage';
import { AssistantPage } from './pages/AssistantPage';
import { PdfPage } from './pages/PdfPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { PlannerPage } from './pages/PlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CommunityPage } from './pages/CommunityPage';
import { SettingsPage } from './pages/SettingsPage';
import { PricingPage } from './pages/PricingPage';

export default function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/app/*" element={
          <AppLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="pdf" element={<PdfPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="*" element={<Navigate to="/app/dashboard" />} />
            </Routes>
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
}

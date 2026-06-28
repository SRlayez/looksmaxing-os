import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './app-context';
import { AppShell } from './components/AppShell';
import { LibraryPage } from './pages/LibraryPage';
import { ModulePage } from './pages/ModulePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Onboarding } from './pages/Onboarding';
import { ProgressPage } from './pages/ProgressPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { SafetyPage } from './pages/SafetyPage';
import { SettingsPage } from './pages/SettingsPage';
import { TodayPage } from './pages/TodayPage';

export default function App() {
  const { settings } = useApp();
  if (!settings.onboardingCompleted) return <Onboarding />;
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/roadmap/:slug" element={<ModulePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

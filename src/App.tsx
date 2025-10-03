import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AuthCallback } from './pages/AuthCallback';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LessonViewerPage } from './pages/LessonViewerPage';
import { CoursesPage } from './pages/CoursesPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { BadgesPage } from './pages/BadgesPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/student-dashboard" element={<StudentDashboardPage />} />
            <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/lesson/:lessonId" element={<LessonViewerPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ChatPage from './pages/dashboard/ChatPage';
import ResumePage from './pages/dashboard/ResumePage';
import MockInterviewPage from './pages/dashboard/MockInterviewPage';
import InterviewCoachPage from './pages/dashboard/InterviewCoachPage';
import JobsPage from './pages/dashboard/JobsPage';
import GoalsPage from './pages/dashboard/GoalsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="interview-coach" element={<InterviewCoachPage />} />
        <Route path="mock-interview" element={<MockInterviewPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="goals" element={<GoalsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          }} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

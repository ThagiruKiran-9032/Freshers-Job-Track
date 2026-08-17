import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Auth Components & Pages
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { WelcomeOnboardingModal } from './components/auth/WelcomeOnboardingModal';

// Application Pages
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Jobs } from './pages/Jobs/Jobs';
import { JobDetails } from './pages/Jobs/JobDetails';
import { SavedJobs } from './pages/SavedJobs/SavedJobs';
import { Applications } from './pages/Applications/Applications';
import { Interviews } from './pages/Interviews/Interviews';
import { CalendarView } from './pages/Calendar/CalendarView';
import { Analytics } from './pages/Analytics/Analytics';
import { Profile } from './pages/Profile/Profile';
import { Resources } from './pages/Resources/Resources';
import { Settings } from './pages/Settings/Settings';
import { ResumeCenterPage } from './pages/Resumes/ResumeCenterPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { InterviewProvider } from './context/InterviewContext';
import { ResumeProvider } from './context/ResumeContext';

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ResumeProvider>
          <SavedJobsProvider>
            <ApplicationProvider>
              <InterviewProvider>
                <BrowserRouter>
                  <WelcomeOnboardingModal />
                  <Routes>
                    {/* Public Authentication Routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />

                    {/* Protected JobTrack Application Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppShell />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="jobs" element={<Jobs />} />
                      <Route path="jobs/:id" element={<JobDetails />} />
                      <Route path="saved-jobs" element={<SavedJobs />} />
                      <Route path="applications" element={<Applications />} />
                      <Route path="interviews" element={<Interviews />} />
                      <Route path="calendar" element={<CalendarView />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="resumes" element={<ResumeCenterPage />} />
                      <Route path="resources" element={<Resources />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </InterviewProvider>
            </ApplicationProvider>
          </SavedJobsProvider>
        </ResumeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home/Home';
import { Jobs } from './pages/Jobs/Jobs';
import { JobDetails } from './pages/JobDetails/JobDetails';
import { Resume } from './pages/Resume/Resume';
import { Profile } from './pages/Profile/Profile';
import { SavedJobs } from './pages/SavedJobs/SavedJobs';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { NotFound } from './pages/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <SavedJobsProvider>
          <ApplicationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Public Unprotected Routes */}
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />

                  {/* Protected Private Routes */}
                  <Route
                    path="jobs"
                    element={
                      <ProtectedRoute>
                        <Jobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="jobs/:id"
                    element={
                      <ProtectedRoute>
                        <JobDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="saved-jobs"
                    element={
                      <ProtectedRoute>
                        <SavedJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="resume"
                    element={
                      <ProtectedRoute>
                        <Resume />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ApplicationProvider>
        </SavedJobsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;

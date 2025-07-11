import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { EditModeProvider } from './contexts/EditModeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import PublicView from './pages/PublicView';
import PublicCollectionsPage from './pages/PublicCollectionsPage';
import UserPublicPage from './pages/UserPublicPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <EditModeProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/u/:username" element={<UserPublicPage />} />
                  <Route path="/public/:collectionId" element={<PublicView />} />
                  <Route
                    path="/public"
                    element={
                      <ProtectedRoute>
                        <PublicCollectionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings/*"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    className: 'dark:bg-gray-800 dark:text-white',
                  }}
                />
              </div>
            </Router>
          </EditModeProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
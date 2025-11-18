import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { LoginPage } from './pages/LoginPage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AddVideoPage } from './pages/admin/AddVideoPage';
import { ManageVideosPage } from './pages/admin/ManageVideosPage';
import { MessagesPage } from './pages/admin/MessagesPage';
import { UsersPage } from './pages/admin/UsersPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdsPage } from './pages/admin/AdsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PartnerPage } from './pages/PartnerPage';
import { initializeStorage } from './lib/mongodb-storage';
import ErrorBoundary from './components/ErrorBoundary';

// Use shared ErrorBoundary component imported above

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPlayerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="videos" element={<ManageVideosPage />} />
            <Route path="add-video" element={<AddVideoPage />} />
            <Route path="edit-video/:id" element={<AddVideoPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="ads" element={<AdsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <Toaster
          theme={theme === 'dark' ? 'dark' : 'light'}
          position="top-right"
          toastOptions={{
            style: theme === 'dark' ? {
              background: '#1A1A1D',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            } : {
              background: '#FFFFFF',
              color: '#0E0E10',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
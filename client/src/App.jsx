import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Spinner } from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Extras from './components/Extras';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
   
  
  if (!authChecked || loading) {
    return <Spinner fullScreen />;
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage isLogin />} />
      <Route path="/register" element={<AuthPage isLogin={false} />} />

      {/* Protected layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-grid">
              <header className="header"><Header /></header>
              <aside className="sidebar"><Sidebar /></aside>
              <main className="feed">
                <Routes>
                  <Route path="feed" element={<FeedPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="profile/:userId" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="feed" replace />} />
                </Routes>
              </main>
              <aside className="extras"><Extras /></aside>
              <footer className="footer"><Footer /></footer>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? '/feed' : '/'} replace state={{ from: location.pathname }} />}
      />
    </Routes>
  );
}

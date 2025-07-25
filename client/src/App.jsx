import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/feed" replace /> : <AuthPage />}
      />

      <Route
        path="/feed"
        element={user ? <FeedPage /> : <Navigate to="/" replace />}
      />

      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/" replace />}
      />

      {/* catch‑all: redirect to feed if logged in, otherwise back to auth */}
      <Route
        path="*"
        element={<Navigate to={user ? "/feed" : "/"} replace />}
      />
    </Routes>
  );
}

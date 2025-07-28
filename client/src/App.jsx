




import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Extras from "./components/Extras";
import Footer from "./components/Footer";

import "./App.css";

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-grid">
      <header className="header"><Header /></header>
      <aside className="sidebar"><Sidebar /></aside>
      <main className="feed">
        <Routes>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </main>
      <aside className="extras"><Extras /></aside>
      <footer className="footer"><Footer /></footer>
    </div>
  );
}

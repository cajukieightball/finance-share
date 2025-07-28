import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check session via Token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/feed');
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/feed');
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
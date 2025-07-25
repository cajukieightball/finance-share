import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check session
  useEffect(() => {
    api
      .get('/auth/me', { withCredentials: true })
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const register = async (username, email, password) => {
    await api.post(
      '/auth/register',
      { username, email, password },
      { withCredentials: true }
    );
    return login(email, password);
  };

  const login = async (email, password) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(data.user);
    navigate('/feed');
  };

  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  return useContext(AuthContext);
}

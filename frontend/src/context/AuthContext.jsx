import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On page load there's no access token in memory yet (it's never persisted
    // to storage), so attempt a silent refresh using the httpOnly cookie
    async function restoreSession() {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        setUser({ id: data.id, name: data.name, email: data.email });
      } catch {
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser({ id: data.id, name: data.name, email: data.email });
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser({ id: data.id, name: data.name, email: data.email });
    // registration issues a fresh session too, so log straight in rather than
    // forcing a second round trip
    await login(email, password);
  }

  async function logout() {
    await api.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
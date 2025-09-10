import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { id: string; name: string; email: string } | null;

interface AuthContextValue {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } catch (_) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const t = await res.text();
      try {
        const j = JSON.parse(t);
        throw new Error(j.error || 'Login failed');
      } catch (_) {
        throw new Error('Login failed');
      }
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const t = await res.text();
      try {
        const j = JSON.parse(t);
        throw new Error(j.error || 'Registration failed');
      } catch (_) {
        throw new Error('Registration failed');
      }
    }
    // Do NOT auto-login after registration. Require explicit login.
    // We still parse to ensure JSON body can be consumed by callers if needed.
    await res.json();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout, loading }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



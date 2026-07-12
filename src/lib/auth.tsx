'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './api';
import type { User } from './types';

interface AuthContextType { user: User | null; loading: boolean; login: (username: string, password: string) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('yaghout_token');
    if (token) { authAPI.verify().then((d) => setUser(d.user)).catch(() => localStorage.removeItem('yaghout_token')).finally(() => setLoading(false)); }
    else setLoading(false);
  }, []);
  const login = useCallback(async (username: string, password: string) => { const d = await authAPI.login(username, password); localStorage.setItem('yaghout_token', d.token); setUser(d.user); }, []);
  const logout = useCallback(() => { localStorage.removeItem('yaghout_token'); setUser(null); window.location.href = '/'; }, []);
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be used within AuthProvider'); return c; }

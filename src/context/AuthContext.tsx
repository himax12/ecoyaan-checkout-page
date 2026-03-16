'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MockUser = {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
};

type AuthContextValue = {
  user: MockUser | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const MOCK_USER: MockUser = {
  id: 'mock-user-001',
  name: 'Himanshu Gupta',
  email: 'himanshu.gupta@ecoyaan.com',
  avatarInitials: 'PS',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start as logged in for the mock demo
  const [user, setUser] = useState<MockUser | null>(MOCK_USER);

  const login = () => setUser(MOCK_USER);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

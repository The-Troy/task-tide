"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { auth, getToken, removeToken, type ApiUser, type Role } from '@/lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = 'student' | 'class_rep' | 'lecturer';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AppContextType {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toAppUser(user: ApiUser): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // start true — restoring session

  const isAuthenticated = currentUser !== null;

  // Restore session from localStorage token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    auth.me()
      .then(({ user }) => setCurrentUser(toAppUser(user)))
      .catch(() => removeToken()) // token expired or invalid
      .finally(() => setIsLoading(false));
  }, []);

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user } = await auth.login(email, password);
      setCurrentUser(toAppUser(user));
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Register
  // ------------------------------------------------------------------
  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await auth.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      setCurrentUser(toAppUser(user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------
  const logout = useCallback(async (): Promise<void> => {
    try {
      await auth.logout();
    } finally {
      setCurrentUser(null);
    }
  }, []);

  // ------------------------------------------------------------------
  // Refresh user (e.g. after role change)
  // ------------------------------------------------------------------
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const { user } = await auth.me();
      setCurrentUser(toAppUser(user));
    } catch {
      setCurrentUser(null);
      removeToken();
    }
  }, []);

  // ------------------------------------------------------------------
  // Update profile name
  // ------------------------------------------------------------------
  const updateProfile = useCallback(async (name: string): Promise<void> => {
    const { user } = await auth.updateProfile(name);
    setCurrentUser(toAppUser(user));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};
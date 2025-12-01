"use client";

import type { User, UserRole, Semester } from '@/lib/types';
import { addNotification, addGroup as addGroupData, joinGroup as joinGroupData, semesters as staticSemesters, assignmentGroups } from '@/lib/data';
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AssignmentGroup } from '@/lib/types';
import { useAuth } from './AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { createUserProfile } from '@/lib/firestore';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; role: UserRole }) => Promise<boolean>;
  logout: () => void;
  createNotification: (title: string, description: string, link?: string) => void;
  createGroup: (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>) => AssignmentGroup | null;
  joinGroup: (groupId: string) => boolean;
  semesters: Semester[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, userProfile, loading: authLoading, logout: authLogout } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>(staticSemesters);

  // Use userProfile from AuthContext as the source of truth for currentUser
  const currentUser = userProfile;
  // Use Firebase user for authentication check to avoid redirect loop if profile is missing/loading
  const isAuthenticated = !!user;
  const role = currentUser?.role || 'student';
  const isLoading = authLoading;

  // This is now mostly a read-only setter or for local optimistic updates if needed, 
  // but ideally role should come from Firestore.
  const setRole = useCallback((newRole: UserRole) => {
    console.warn("setRole called but role is now managed via Firestore/AuthContext");
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string; role: UserRole }): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // Create user profile in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarUrl: 'https://placehold.co/100x100.png', // Default avatar
      };

      await createUserProfile(newUser);

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error; // Throw error so UI can handle it
    }
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
  }, [authLogout]);

  const refreshSemesters = useCallback(() => {
    setSemesters([...staticSemesters]);
  }, []);

  useEffect(() => {
    refreshSemesters();
  }, [refreshSemesters]);

  const createNotification = (title: string, description: string, link?: string) => {
    addNotification(title, description, link);
  };

  const createGroup = (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>): AssignmentGroup | null => {
    if (!currentUser || currentUser.role !== 'class_representative') {
      console.error("Only class representatives can create groups.");
      return null;
    }
    const newGroup = addGroupData(groupDetails, currentUser);
    createNotification("New Group Created", `Group "${newGroup.assignmentName}" is now available.`, `/rooms/${newGroup.semesterId}/${newGroup.unitId}`);
    return newGroup;
  };

  const joinGroup = (groupId: string): boolean => {
    if (!currentUser || currentUser.role !== 'student') {
      console.error("Only students can join groups.");
      return false;
    }
    const success = joinGroupData(groupId, currentUser);
    if (success) {
      const joinedGroup = assignmentGroups.find(g => g.id === groupId);
      if (joinedGroup) {
        createNotification("Joined Group", `You have successfully joined the group: ${joinedGroup.assignmentName}.`, `/rooms/${joinedGroup.semesterId}/${joinedGroup.unitId}`);
      }
    }
    return success;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      role,
      setRole,
      login,
      register,
      logout,
      createNotification,
      createGroup,
      joinGroup,
      semesters,
    }}>
      {children}
    </AppContext.Provider>
  );
};
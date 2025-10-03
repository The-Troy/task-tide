
"use client";

import type { User, UserRole, Semester } from '@/lib/types';
import { addNotification, addGroup as addGroupData, joinGroup as joinGroupData, semesters as staticSemesters, assignmentGroups } from '@/lib/data';
import { createAccount, signInWithEmail, signOutUser, onAuthStateChange } from '@/lib/auth';
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AssignmentGroup } from '@/lib/types';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (email: string, password: string) => boolean;
  register: (userData: { name: string; email: string; password: string; role: UserRole }) => boolean;
  logout: () => void;
  createNotification: (title: string, description: string, link?: string) => void;
  createGroup: (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>) => AssignmentGroup | null;
  joinGroup: (groupId: string) => boolean;
  semesters: Semester[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [semesters, setSemesters] = useState<Semester[]>(staticSemesters); 

  const isAuthenticated = currentUser !== null;
  const role = currentUser?.role || 'student';

  // Set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmail(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string; role: UserRole }): Promise<boolean> => {
    try {
      await createAccount(userData.email, userData.password, userData.name, userData.role);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

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
      if(joinedGroup) {
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

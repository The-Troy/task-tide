"use client";

import type { User, UserRole, Semester } from '@/lib/types';
import { addNotification, addGroup as addGroupData, joinGroup as joinGroupData, semesters as staticSemesters, assignmentGroups, getUserByEmail, addUser } from '@/lib/data';
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AssignmentGroup } from '@/lib/types';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [semesters, setSemesters] = useState<Semester[]>(staticSemesters); 

  const isAuthenticated = currentUser !== null;
  const role = currentUser?.role || 'student';

  const setRole = useCallback((newRole: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  }, [currentUser]);
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = getUserByEmail(email);
    if (user && password === 'demo123') {
      setCurrentUser(user);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string; role: UserRole }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = addUser({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    
    setCurrentUser(newUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
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
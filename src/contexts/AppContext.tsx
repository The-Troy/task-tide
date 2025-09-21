
"use client";

import type { User, UserRole, Semester } from '@/lib/types';
import { mockUserStudent, mockUserClassRep, addNotification, addGroup as addGroupData, joinGroup as joinGroupData, semesters as staticSemesters, assignmentGroups, addUser, getUserByEmail } from '@/lib/data';
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AssignmentGroup } from '@/lib/types';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
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
  const [semesters, setSemesters] = useState<Semester[]>(staticSemesters); 

  const isAuthenticated = currentUser !== null;
  const role = currentUser?.role || 'student';

  const setRole = useCallback((newRole: UserRole) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return prevUser;
      if (newRole === 'student') return mockUserStudent;
      if (newRole === 'class_representative') return mockUserClassRep;
      return prevUser; // Should not happen
    });
  }, []);
  
  const login = useCallback((email: string, password: string): boolean => {
    // Demo login logic - in a real app, this would validate against a backend
    const demoCredentials = [
      { email: "alex.student@example.com", password: "demo123", user: mockUserStudent },
      { email: "casey.rep@example.com", password: "demo123", user: mockUserClassRep },
    ];
    
    const credential = demoCredentials.find(cred => cred.email === email && cred.password === password);
    if (credential) {
      setCurrentUser(credential.user);
      return true;
    }
    
    // Check if user exists in our data store
    const user = getUserByEmail(email);
    if (user && password === "demo123") { // Simplified password check for demo
      setCurrentUser(user);
      return true;
    }
    
    return false;
  }, []);

  const register = useCallback((userData: { name: string; email: string; password: string; role: UserRole }): boolean => {
    // Check if user already exists
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      return false;
    }
    
    // Create new user
    const newUser = addUser({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    
    // Auto-login after registration
    setCurrentUser(newUser);
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

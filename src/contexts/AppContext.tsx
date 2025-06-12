
"use client";

import type { User, UserRole } from '@/lib/types';
import { mockUserStudent, mockUserClassRep, addNotification, addGroup as addGroupData, joinGroup as joinGroupData } from '@/lib/data';
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { AssignmentGroup } from '@/lib/types';

interface AppContextType {
  currentUser: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  createNotification: (title: string, description: string, link?: string) => void;
  createGroup: (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>) => AssignmentGroup | null;
  joinGroup: (groupId: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUserStudent);

  const setRole = useCallback((newRole: UserRole) => {
    setCurrentUser(prevUser => {
      if (newRole === 'student') return mockUserStudent;
      if (newRole === 'class_representative') return mockUserClassRep;
      return prevUser; // Should not happen
    });
  }, []);

  const createNotification = (title: string, description: string, link?: string) => {
    addNotification(title, description, link);
    // In a real app, you might want to trigger a re-fetch or update a local state of notifications
  };
  
  const createGroup = (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>): AssignmentGroup | null => {
    if (currentUser.role !== 'class_representative') {
      console.error("Only class representatives can create groups.");
      return null;
    }
    const newGroup = addGroupData(groupDetails, currentUser);
    createNotification("New Group Created", `Group "${newGroup.assignmentName}" is now available.`, "/groups");
    return newGroup;
  };

  const joinGroup = (groupId: string): boolean => {
    if (currentUser.role !== 'student') {
      console.error("Only students can join groups.");
      return false;
    }
    const success = joinGroupData(groupId, currentUser);
    if (success) {
      createNotification("Joined Group", `You have successfully joined a group.`, "/groups");
    }
    return success;
  };


  return (
    <AppContext.Provider value={{ currentUser, role: currentUser.role, setRole, createNotification, createGroup, joinGroup }}>
      {children}
    </AppContext.Provider>
  );
};

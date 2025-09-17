
"use client";

import type { User, UserRole, Semester } from '@/lib/types';
import { mockUserStudent, mockUserClassRep, addNotification, addGroup as addGroupData, joinGroup as joinGroupData, semesters as staticSemesters, assignmentGroups } from '@/lib/data';
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { AssignmentGroup } from '@/lib/types';

interface AppContextType {
  currentUser: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  createNotification: (title: string, description: string, link?: string) => void;
  createGroup: (groupDetails: Omit<AssignmentGroup, 'id' | 'members' | 'createdBy'>) => AssignmentGroup | null;
  joinGroup: (groupId: string) => boolean;
  semesters: Semester[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUserStudent);
  const [semesters, setSemesters] = useState<Semester[]>(staticSemesters); 

  const setRole = useCallback((newRole: UserRole) => {
    setCurrentUser(prevUser => {
      if (newRole === 'student') return mockUserStudent;
      if (newRole === 'class_representative') return mockUserClassRep;
      return prevUser; // Should not happen
    });
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
    if (currentUser.role !== 'class_representative') {
      console.error("Only class representatives can create groups.");
      return null;
    }
    const newGroup = addGroupData(groupDetails, currentUser);
    createNotification("New Group Created", `Group "${newGroup.assignmentName}" is now available.`, `/rooms/${newGroup.semesterId}/${newGroup.unitId}`);
    return newGroup;
  };

  const joinGroup = (groupId: string): boolean => {
    if (currentUser.role !== 'student') {
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
        role: currentUser.role, 
        setRole, 
        createNotification, 
        createGroup, 
        joinGroup,
        semesters,
    }}>
      {children}
    </AppContext.Provider>
  );
};

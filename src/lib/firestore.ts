// Mock Firestore utilities for classroom management (demo purposes)
import type { CourseServer } from './types';

// Mock data for demo purposes
const mockServers: CourseServer[] = [
  {
    id: 'server1',
    name: 'BSc Computer Science',
    year: '2025',
    semester: 'Spring',
    joinCode: 'BSC25-ABC',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/BSC25-ABC`,
    createdBy: 'user_classrep_01',
    members: ['user_student_01'],
    createdAt: new Date().toISOString(),
    maxGroupsPerUnit: 50,
  },
  {
    id: 'server2',
    name: 'Computer Science Fundamentals',
    year: '2025',
    semester: 'Fall',
    joinCode: 'CSF25-XYZ',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/CSF25-XYZ`,
    createdBy: 'user_classrep_01',
    members: ['user_classrep_01'],
    createdAt: new Date().toISOString(),
    maxGroupsPerUnit: 50,
  }
];

const generateJoinCode = (courseName: string, year: string): string => {
  const coursePrefix = courseName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const yearSuffix = year.substring(2);
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${coursePrefix}${yearSuffix}-${randomSuffix}`;
};

export const createCourseServer = async (serverData: Omit<CourseServer, 'id' | 'createdAt' | 'joinCode' | 'joinLink'>): Promise<CourseServer> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const joinCode = generateJoinCode(serverData.name, serverData.year);
  const joinLink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/${joinCode}`;
  
  const newServer: CourseServer = {
    ...serverData,
    id: `server_${Date.now()}`,
    joinCode,
    joinLink,
    createdAt: new Date().toISOString(),
  };
  
  mockServers.push(newServer);
  return newServer;
};

export const findServerByJoinCode = async (joinCode: string): Promise<CourseServer | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockServers.find(server => server.joinCode === joinCode) || null;
};

export const addStudentToServer = async (serverId: string, studentId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const server = mockServers.find(s => s.id === serverId);
  if (server && !server.members.includes(studentId)) {
    server.members.push(studentId);
  }
};

export const getUserServers = async (userId: string): Promise<CourseServer[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockServers.filter(server => 
    server.members.includes(userId) || server.createdBy === userId
  );
};

// Legacy functions for backward compatibility
export const createClassroom = createCourseServer;
export const findClassroomByJoinCode = findServerByJoinCode;
export const addStudentToClassroom = addStudentToServer;
export const getUserClassrooms = getUserServers;

export const addClassroomToStudent = async (studentId: string, serverId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the user's document in Firestore
  // For demo purposes, we'll just simulate the operation
  console.log(`Added server ${serverId} to student ${studentId}`);
};
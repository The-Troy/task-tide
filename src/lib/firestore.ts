// Mock Firestore utilities for classroom management (demo purposes)
import type { Classroom } from './types';

// Mock data for demo purposes
const mockClassrooms: Classroom[] = [
  {
    id: 'classroom1',
    name: 'Bachelor of Information Technology',
    year: '2025',
    semester: 'Spring',
    joinCode: 'BIT25-ABC',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/BIT25-ABC`,
    createdBy: 'user_classrep_01',
    members: ['user_student_01'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'classroom2',
    name: 'Computer Science Fundamentals',
    year: '2025',
    semester: 'Fall',
    joinCode: 'CSF25-XYZ',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/CSF25-XYZ`,
    createdBy: 'user_classrep_01',
    members: [],
    createdAt: new Date().toISOString(),
  }
];

export const createClassroom = async (classroomData: Omit<Classroom, 'id' | 'createdAt'>): Promise<Classroom> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newClassroom: Classroom = {
    ...classroomData,
    id: `classroom_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  mockClassrooms.push(newClassroom);
  return newClassroom;
};

export const findClassroomByJoinCode = async (joinCode: string): Promise<Classroom | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockClassrooms.find(classroom => classroom.joinCode === joinCode) || null;
};

export const addStudentToClassroom = async (classroomId: string, studentId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const classroom = mockClassrooms.find(c => c.id === classroomId);
  if (classroom && !classroom.members.includes(studentId)) {
    classroom.members.push(studentId);
  }
};

export const addClassroomToStudent = async (studentId: string, classroomId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the user's document in Firestore
  // For demo purposes, we'll just simulate the operation
  console.log(`Added classroom ${classroomId} to student ${studentId}`);
};

export const getUserClassrooms = async (userId: string): Promise<Classroom[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockClassrooms.filter(classroom => 
    classroom.members.includes(userId) || classroom.createdBy === userId
  );
};
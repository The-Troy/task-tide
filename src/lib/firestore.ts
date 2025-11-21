// Mock Firestore utilities for classroom management (demo purposes)
import type { Course, Unit, DocumentFile, AssignmentGroup } from './types';

// Mock data for demo purposes
const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'BSc Computer Science',
    year: '2025',
    semester: 'Spring',
    joinCode: 'BSC25-ABC',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/BSC25-ABC`,
    createdBy: 'user_classrep_01',
    members: ['user_student_01'],
    createdAt: new Date().toISOString(),
    units: [
      { id: 'unit1', name: 'Introduction to Programming', semesterId: 'course1' },
      { id: 'unit2', name: 'Data Structures and Algorithms', semesterId: 'course1' },
    ],
  },
  {
    id: 'course2',
    name: 'Computer Science Fundamentals',
    year: '2025',
    semester: 'Fall',
    joinCode: 'CSF25-XYZ',
    joinLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/CSF25-XYZ`,
    createdBy: 'user_classrep_01',
    members: ['user_classrep_01'],
    createdAt: new Date().toISOString(),
    units: [
      { id: 'unit3', name: 'Web Development', semesterId: 'course2' },
      { id: 'unit4', name: 'Database Systems', semesterId: 'course2' },
    ],
  }
];

const mockDocuments: { [unitId: string]: DocumentFile[] } = {
  unit1: [
    { id: 'doc1', name: 'Syllabus', type: 'pdf', url: '/', uploadedAt: new Date().toISOString(), semesterId: 'course1', unitId: 'unit1' },
    { id: 'doc2', name: 'Lecture 1 Slides', type: 'pdf', url: '/', uploadedAt: new Date().toISOString(), semesterId: 'course1', unitId: 'unit1' },
  ],
  unit2: [
    { id: 'doc3', name: 'Assignment 1', type: 'docx', url: '/', uploadedAt: new Date().toISOString(), semesterId: 'course1', unitId: 'unit2' },
  ],
};

const mockGroups: { [unitId: string]: AssignmentGroup[] } = {
  unit1: [
    { id: 'group1', assignmentName: 'Project 1', maxSize: 4, members: [], createdBy: { id: 'user_classrep_01', name: 'Class Rep' }, unitId: 'unit1', semesterId: 'course1' },
  ],
};

const generateJoinCode = (courseName: string, year: string): string => {
  const coursePrefix = courseName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const yearSuffix = year.substring(2);
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${coursePrefix}${yearSuffix}-${randomSuffix}`;
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'joinCode' | 'joinLink' | 'units'>): Promise<Course> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const joinCode = generateJoinCode(courseData.name, courseData.year);
  const joinLink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/${joinCode}`;
  
  const newCourse: Course = {
    ...courseData,
    id: `course_${Date.now()}`,
    joinCode,
    joinLink,
    createdAt: new Date().toISOString(),
    units: [],
  };
  
  mockCourses.push(newCourse);
  return newCourse;
};

export const findCourseByJoinCode = async (joinCode: string): Promise<Course | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCourses.find(course => course.joinCode === joinCode) || null;
};

export const addStudentToCourse = async (courseId: string, studentId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const course = mockCourses.find(c => c.id === courseId);
  if (course && !course.members.includes(studentId)) {
    course.members.push(studentId);
  }
};

export const getUserCourses = async (userId: string): Promise<Course[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCourses.filter(course => 
    course.members.includes(userId) || course.createdBy === userId
  );
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCourses.find(course => course.id === courseId) || null;
};

export const getUnitsForCourse = async (courseId: string): Promise<Unit[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const course = mockCourses.find(c => c.id === courseId);
  return course ? course.units : [];
};

export const getDocumentsForUnit = async (unitId: string): Promise<DocumentFile[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockDocuments[unitId] || [];
};

export const getGroupsForUnit = async (unitId: string): Promise<AssignmentGroup[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockGroups[unitId] || [];
};

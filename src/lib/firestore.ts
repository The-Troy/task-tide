/**
 * @deprecated This file is kept for backward compatibility only.
 * All data access should now go through @/lib/api.ts (Express + Supabase backend).
 * These stubs satisfy legacy imports that haven't been migrated yet.
 */

import type { Course, Unit, DocumentFile, AssignmentGroup } from './types';
import type { User } from './types';

export const createCourse = async (_data: unknown): Promise<Course> => {
  throw new Error('createCourse is deprecated. Use courseServers.create() from @/lib/api.');
};

export const findCourseByJoinCode = async (_joinCode: string): Promise<Course | null> => {
  return null;
};

export const addStudentToCourse = async (_courseId: string, _studentId: string): Promise<void> => {
  // no-op stub
};

export const getUserCourses = async (_userId: string): Promise<Course[]> => {
  return [];
};

export const getCourse = async (_courseId: string): Promise<Course | null> => {
  return null;
};

export const getUnitsForCourse = async (_courseId: string): Promise<Unit[]> => {
  return [];
};

export const getDocumentsForUnit = async (_unitId: string): Promise<DocumentFile[]> => {
  return [];
};

export const getGroupsForUnit = async (_unitId: string): Promise<AssignmentGroup[]> => {
  return [];
};

export const createCourseServer = async (_data: unknown): Promise<Course> => {
  throw new Error('createCourseServer is deprecated. Use courseServers.create() from @/lib/api.');
};

export const createClassroom = async (_data: unknown): Promise<Course> => {
  throw new Error('createClassroom is deprecated. Use courseServers.create() from @/lib/api.');
};

export const findClassroomByJoinCode = async (_code: string): Promise<Course | null> => null;
export const addStudentToClassroom = async (_id: string, _uid: string): Promise<void> => undefined;
export const addClassroomToStudent = async (_uid: string, _id: string): Promise<void> => undefined;

// Legacy aliases
export const findServerByJoinCode = findCourseByJoinCode;
export const addStudentToServer = addStudentToCourse;

export const createUserProfile = async (_user: User): Promise<void> => undefined;
export const getUserProfile = async (_userId: string): Promise<User | null> => null;

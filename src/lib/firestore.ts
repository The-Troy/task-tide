// Firestore utilities for classroom management
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

import type { Classroom } from './types';

export const createClassroom = async (classroomData: Omit<Classroom, 'id' | 'createdAt'>): Promise<Classroom> => {
  try {
    const docRef = await addDoc(collection(db, 'classrooms'), {
      ...classroomData,
      createdAt: new Date().toISOString()
    });
    
    return {
      ...classroomData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating classroom:', error);
    throw new Error('Failed to create classroom');
  }
};

export const findClassroomByJoinCode = async (joinCode: string): Promise<Classroom | null> => {
  try {
    const q = query(
      collection(db, 'classrooms'),
      where('joinCode', '==', joinCode)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Classroom;
  } catch (error) {
    console.error('Error finding classroom:', error);
    throw new Error('Failed to find classroom');
  }
};

export const addStudentToClassroom = async (classroomId: string, studentId: string): Promise<void> => {
  try {
    const classroomRef = doc(db, 'classrooms', classroomId);
    await updateDoc(classroomRef, {
      members: arrayUnion(studentId)
    });
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    throw new Error('Failed to join classroom');
  }
};

export const addClassroomToStudent = async (studentId: string, classroomId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', studentId);
    await updateDoc(userRef, {
      joinedClassrooms: arrayUnion(classroomId)
    });
  } catch (error) {
    console.error('Error adding classroom to student:', error);
    throw new Error('Failed to update student record');
  }
};

export const getUserClassrooms = async (userId: string): Promise<Classroom[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const joinedClassrooms = userDoc.data()?.joinedClassrooms || [];
    
    if (joinedClassrooms.length === 0) {
      return [];
    }
    
    const classroomPromises = joinedClassrooms.map((id: string) => 
      getDoc(doc(db, 'classrooms', id))
    );
    const classroomDocs = await Promise.all(classroomPromises);
    
    return classroomDocs
      .filter(doc => doc.exists())
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Classroom));
  } catch (error) {
    console.error('Error getting user classrooms:', error);
    return [];
  }
};
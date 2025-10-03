// Authentication utilities
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User, UserRole } from './types';

// Create a new user account
export const createAccount = async (
  email: string, 
  password: string, 
  name: string, 
  role: UserRole
): Promise<User> => {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: name
    });

    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      name,
      email,
      role,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=673AB7&color=fff`,
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: new Date().toISOString(),
      joinedClassrooms: []
    });

    return userData;
  } catch (error: any) {
    console.error('Error creating account:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data() as User;
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      role: userData.role,
      avatarUrl: userData.avatarUrl || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=673AB7&color=fff`,
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Get current user data
export const getCurrentUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data() as User;
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      role: userData.role,
      avatarUrl: userData.avatarUrl || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=673AB7&color=fff`,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userData = await getCurrentUserData(firebaseUser);
      callback(userData);
    } else {
      callback(null);
    }
  });
};
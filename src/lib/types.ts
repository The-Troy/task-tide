
export type UserRole = 'student' | 'class_representative';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface DocumentFile {
  id: string;
  name:string;
  type: 'pdf' | 'docx' | 'video' | 'link';
  url: string; // Path to the document or external URL
  uploadedAt: string; // ISO date string
  semesterId: string;
  unitId: string;
  size?: string; // e.g., "2.5 MB"
}

export interface Unit {
  id: string;
  name: string;
  semesterId: string;
  description?: string; // Optional description for unit cards
}

export interface Semester {
  id: string;
  name: string; // e.g., "Semester 1", "Advanced Studies Server"
  isPublic: boolean;
  createdBy: Pick<User, 'id' | 'name'>;
  // accessCode?: string; // For future private semester access
}

export interface AssignmentGroup {
  id: string;
  assignmentName: string;
  maxSize: number;
  members: Pick<User, 'id' | 'name'>[];
  createdBy: Pick<User, 'id' | 'name'>;
  courseId?: string; // Optional: if groups are per course/unit
  unitId?: string;
  semesterId?: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  read: boolean;
  link?: string; // Optional link to the relevant item
}

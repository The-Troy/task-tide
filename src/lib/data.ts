
import type { Semester, Unit, DocumentFile, User, UserRole, AssignmentGroup, NotificationMessage } from './types';

export const mockUserStudent: User = {
  id: 'user_student_01',
  name: 'Alex Student',
  email: 'alex.student@example.com',
  role: 'student',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export const mockUserClassRep: User = {
  id: 'user_classrep_01',
  name: 'Casey ClassRep',
  email: 'casey.rep@example.com',
  role: 'class_representative',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export const semesters: Semester[] = [
  { id: 'sem1', name: 'Semester 1' },
  { id: 'sem2', name: 'Semester 2' },
  { id: 'sem3', name: 'Semester 3' },
];

export const units: Unit[] = [
  { id: 'unit101', name: 'Introduction to Programming', semesterId: 'sem1' },
  { id: 'unit102', name: 'Calculus I', semesterId: 'sem1' },
  { id: 'unit201', name: 'Data Structures', semesterId: 'sem2' },
  { id: 'unit202', name: 'Linear Algebra', semesterId: 'sem2' },
  { id: 'unit301', name: 'Algorithms', semesterId: 'sem3' },
];

export const documents: DocumentFile[] = [
  { id: 'doc001', name: 'Syllabus.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2023-09-01T10:00:00Z').toISOString(), semesterId: 'sem1', unitId: 'unit101', size: '1.2MB' },
  { id: 'doc002', name: 'Lecture 1 Notes.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2023-09-05T14:30:00Z').toISOString(), semesterId: 'sem1', unitId: 'unit101', size: '2.5MB' },
  { id: 'doc003', name: 'Assignment 1.docx', type: 'docx', url: '#', uploadedAt: new Date('2023-09-10T10:00:00Z').toISOString(), semesterId: 'sem1', unitId: 'unit101', size: '0.5MB' },
  { id: 'doc004', name: 'Calculus Basics.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2023-09-02T11:00:00Z').toISOString(), semesterId: 'sem1', unitId: 'unit102', size: '3.1MB' },
  { id: 'doc005', name: 'Advanced Data Structures.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2024-01-15T09:00:00Z').toISOString(), semesterId: 'sem2', unitId: 'unit201', size: '4.0MB' },
  { id: 'doc006', name: 'Introductory Video.mp4', type: 'video', url: '#', uploadedAt: new Date('2023-09-01T10:00:00Z').toISOString(), semesterId: 'sem1', unitId: 'unit101', size: '50.2MB' },
];

export const assignmentGroups: AssignmentGroup[] = [
  { id: 'group001', assignmentName: 'Project Alpha - Programming', maxSize: 4, members: [{id: 'user_student_01', name: 'Alex Student'}], createdBy: {id: 'user_classrep_01', name: 'Casey ClassRep'}, unitId: 'unit101', semesterId: 'sem1'},
  { id: 'group002', assignmentName: 'Calculus Problem Set 1', maxSize: 3, members: [], createdBy: {id: 'user_classrep_01', name: 'Casey ClassRep'}, unitId: 'unit102', semesterId: 'sem1'},
  { id: 'group003', assignmentName: 'Data Structures Lab 2', maxSize: 2, members: [], createdBy: {id: 'user_classrep_01', name: 'Casey ClassRep'}, unitId: 'unit201', semesterId: 'sem2'},
];

export const notifications: NotificationMessage[] = [
  { id: 'notif001', title: 'New Document Uploaded', description: 'Syllabus.pdf was added to Introduction to Programming.', timestamp: new Date('2023-09-01T10:05:00Z').toISOString(), read: false, link: '/documents/sem1/unit101' },
  { id: 'notif002', title: 'Group Created', description: 'A new group for Project Alpha has been created.', timestamp: new Date('2023-09-02T15:00:00Z').toISOString(), read: true, link: '/groups' },
  { id: 'notif003', title: 'Assignment Reminder', description: 'Assignment 1 for Introduction to Programming is due soon.', timestamp: new Date('2023-09-15T09:00:00Z').toISOString(), read: false },
];

// Helper functions
export const getSemesters = (): Semester[] => semesters;
export const getUnitsBySemester = (semesterId: string): Unit[] => units.filter(u => u.semesterId === semesterId);
export const getDocumentsByUnit = (semesterId: string, unitId: string): DocumentFile[] => 
  documents.filter(d => d.semesterId === semesterId && d.unitId === unitId);
export const getDocumentById = (docId: string): DocumentFile | undefined => documents.find(d => d.id === docId);
export const getSemesterById = (semesterId: string): Semester | undefined => semesters.find(s => s.id === semesterId);
export const getUnitById = (unitId: string): Unit | undefined => units.find(u => u.id === unitId);

export const getGroups = (): AssignmentGroup[] => assignmentGroups;
export const addGroup = (group: Omit<AssignmentGroup, 'id' | 'members'>, creator: User): AssignmentGroup => {
  const newGroup: AssignmentGroup = {
    ...group,
    id: `group${Date.now()}`,
    members: [],
    createdBy: {id: creator.id, name: creator.name},
  };
  assignmentGroups.push(newGroup);
  return newGroup;
};
export const joinGroup = (groupId: string, user: User): boolean => {
  const group = assignmentGroups.find(g => g.id === groupId);
  if (group && group.members.length < group.maxSize && !group.members.find(m => m.id === user.id)) {
    group.members.push({id: user.id, name: user.name});
    return true;
  }
  return false;
}

export const getNotifications = (): NotificationMessage[] => notifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
export const markNotificationAsRead = (notificationId: string): void => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};
export const addNotification = (title: string, description: string, link?: string): void => {
  notifications.unshift({
    id: `notif${Date.now()}`,
    title,
    description,
    link,
    timestamp: new Date().toISOString(),
    read: false,
  });
};


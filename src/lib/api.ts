/**
 * TaskTide API Service
 * Central layer for all communication with the Laravel backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001/api';
const TOKEN_KEY = 'tasktide_token';

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {},
  formData = false,
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData — browser sets it with the boundary
  if (!formData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // No content responses (e.g. 204)
  if (response.status === 204) return {} as T;

  const data = await response.json();

  if (!response.ok) {
    // Surface Laravel validation errors as a single message
    const message =
      data?.message ??
      Object.values(data?.errors ?? {}).flat().join(' ') ??
      'Something went wrong';
    throw new Error(message);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Types (matching backend responses)
// ---------------------------------------------------------------------------

export type Role = 'student' | 'class_rep' | 'lecturer';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  course_servers?: ApiCourseServer[];
  units?: ApiUnit[];
  teaching_units?: ApiUnit[];
}

export interface ApiCourseServer {
  id: number;
  name: string;
  description: string | null;
  code: string;
  is_active: boolean;
  class_rep_id: number;
  class_rep?: ApiUser;
  units?: ApiUnit[];
  members_count?: number;
  created_at: string;
}

export interface ApiUnit {
  id: number;
  course_server_id: number;
  name: string;
  unit_code: string;
  description: string | null;
  credits: number | null;
  course_server?: ApiCourseServer;
  lecturers?: ApiUser[];
  students_count?: number;
  documents_count?: number;
  messages_count?: number;
  created_at: string;
}

export interface ApiDocument {
  id: number;
  unit_id: number;
  uploaded_by: number;
  title: string;
  document_type: 'lecture_notes' | 'past_papers' | 'revision_materials' | 'exam_timetable' | 'lecture_timetable' | 'other';
  file_name: string;
  file_size: number;
  mime_type: string;
  uploader?: ApiUser;
  created_at: string;
}

export interface ApiMessage {
  id: number;
  unit_id: number;
  user_id: number;
  message: string;
  is_edited: boolean;
  user?: ApiUser;
  created_at: string;
  updated_at: string;
}

export interface ApiInvitation {
  id: number;
  unit_id: number;
  email: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
  unit?: ApiUnit;
  inviter?: ApiUser;
  created_at: string;
}

export interface ApiGroup {
  id: number;
  unit_id: number;
  name: string;
  max_size: number;
  is_full?: boolean;
  members?: ApiUser[];
  members_count?: number;
  created_at: string;
}

export interface PaginatedMessages {
  data: ApiMessage[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const auth = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: ApiUser; token: string }> {
    const data = await request<{ user: ApiUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string): Promise<{ user: ApiUser; token: string }> {
    const data = await request<{ user: ApiUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async logout(): Promise<void> {
    await request('/auth/logout', { method: 'POST' });
    removeToken();
  },

  async me(): Promise<{ user: ApiUser }> {
    return request<{ user: ApiUser }>('/auth/me');
  },

  async updateProfile(name: string): Promise<{ user: ApiUser }> {
    return request<{ user: ApiUser }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },
};

// ---------------------------------------------------------------------------
// Course Servers
// ---------------------------------------------------------------------------

export const courseServers = {
  list(): Promise<{ course_servers: ApiCourseServer[] }> {
    return request('/course-servers');
  },

  create(payload: { name: string; description?: string }): Promise<{ course_server: ApiCourseServer }> {
    return request('/course-servers', { method: 'POST', body: JSON.stringify(payload) });
  },

  get(id: number): Promise<{ course_server: ApiCourseServer }> {
    return request(`/course-servers/${id}`);
  },

  update(id: number, payload: { name?: string; description?: string; is_active?: boolean }): Promise<{ course_server: ApiCourseServer }> {
    return request(`/course-servers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  join(code: string): Promise<{ course_server: ApiCourseServer }> {
    return request('/course-servers/join', { method: 'POST', body: JSON.stringify({ code }) });
  },

  leave(id: number): Promise<{ message: string }> {
    return request(`/course-servers/${id}/leave`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

export const units = {
  list(): Promise<{ units: ApiUnit[] }> {
    return request('/units');
  },

  create(courseServerId: number, payload: {
    name: string;
    unit_code: string;
    description?: string;
    credits?: number;
  }): Promise<{ unit: ApiUnit }> {
    return request(`/course-servers/${courseServerId}/units`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  get(id: number): Promise<{ unit: ApiUnit }> {
    return request(`/units/${id}`);
  },

  update(id: number, payload: {
    name?: string;
    unit_code?: string;
    description?: string;
    credits?: number;
  }): Promise<{ unit: ApiUnit }> {
    return request(`/units/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  delete(id: number): Promise<{ message: string }> {
    return request(`/units/${id}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const documents = {
  list(unitId: number): Promise<{ documents: ApiDocument[] }> {
    return request(`/units/${unitId}/documents`);
  },

  upload(unitId: number, formData: FormData): Promise<{ document: ApiDocument }> {
    return request(`/units/${unitId}/documents`, { method: 'POST', body: formData }, true);
  },

  download(documentId: number): string {
    // Returns URL for direct download — include token as query param for auth
    const token = getToken();
    return `${API_BASE}/documents/${documentId}?token=${token}`;
  },

  delete(documentId: number): Promise<{ message: string }> {
    return request(`/documents/${documentId}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export const messages = {
  list(unitId: number, page = 1): Promise<PaginatedMessages> {
    return request(`/units/${unitId}/messages?page=${page}`);
  },

  send(unitId: number, message: string): Promise<{ data: ApiMessage }> {
    return request(`/units/${unitId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  update(messageId: number, message: string): Promise<{ data: ApiMessage }> {
    return request(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ message }),
    });
  },

  delete(messageId: number): Promise<{ message: string }> {
    return request(`/messages/${messageId}`, { method: 'DELETE' });
  },
};

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export const invitations = {
  list(): Promise<{ invitations: ApiInvitation[] }> {
    return request('/invitations');
  },

  invite(unitId: number, email: string): Promise<{ invitation: ApiInvitation }> {
    return request(`/units/${unitId}/invitations`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  get(token: string): Promise<{ invitation: ApiInvitation }> {
    return request(`/invitations/${token}`);
  },

  accept(token: string): Promise<{ unit: ApiUnit }> {
    return request(`/invitations/${token}/accept`, { method: 'POST' });
  },

  reject(token: string): Promise<{ message: string }> {
    return request(`/invitations/${token}/reject`, { method: 'POST' });
  },
};

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export const groups = {
  list(unitId: number): Promise<{ groups: ApiGroup[] }> {
    return request(`/units/${unitId}/groups`);
  },

  autoSetup(unitId: number, groupSize: number): Promise<{ groups: ApiGroup[] }> {
    return request(`/units/${unitId}/groups/auto-setup`, {
      method: 'POST',
      body: JSON.stringify({ group_size: groupSize }),
    });
  },

  get(groupId: number): Promise<{ group: ApiGroup }> {
    return request(`/groups/${groupId}`);
  },

  update(groupId: number, payload: { name?: string; max_size?: number }): Promise<{ group: ApiGroup }> {
    return request(`/groups/${groupId}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  join(groupId: number): Promise<{ group: ApiGroup }> {
    return request(`/groups/${groupId}/join`, { method: 'POST' });
  },

  leave(groupId: number): Promise<{ message: string }> {
    return request(`/groups/${groupId}/leave`, { method: 'DELETE' });
  },

  deleteAll(unitId: number): Promise<{ message: string }> {
    return request(`/units/${unitId}/groups`, { method: 'DELETE' });
  },
};

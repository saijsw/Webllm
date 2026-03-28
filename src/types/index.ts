export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface File {
  id: string;
  projectId: string;
  name: string;
  content: string;
  language: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPro: boolean;
  credits: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIModel {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  description: string;
  size?: string;
}

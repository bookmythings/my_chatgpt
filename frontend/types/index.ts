export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  language: string;
  template: string;
  owner: User;
  collaborators: User[];
  files: ProjectFile[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
  isFolder: boolean;
  children?: ProjectFile[];
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  code: number;
  signal?: string;
  language: string;
  version: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export type Language = 'javascript' | 'python' | 'html' | 'cpp' | 'java' | 'typescript';
export type Template = 'blank' | 'node' | 'react' | 'python' | 'html' | 'cpp' | 'java';
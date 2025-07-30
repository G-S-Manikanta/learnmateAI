export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  enrolledCourses: string[];
  progress: { [courseId: string]: number };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  timezone: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserStats {
  totalCourses: number;
  completedCourses: number;
  totalStudyTime: number;
  averageScore: number;
  streak: number;
  achievements: string[];
}

// Helper functions
export function getFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

export function isTeacher(user: User): boolean {
  return user.role === UserRole.TEACHER;
}

export function isStudent(user: User): boolean {
  return user.role === UserRole.STUDENT;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
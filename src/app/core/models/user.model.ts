export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  domain?: string;
  logo?: string;
  isActive: boolean;
  settings: CompanySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
}

export interface Session {
  user: User;
  company: Company;
  token: string;
  expiresAt: Date;
  permissions: string[];
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer',
}

export interface LoginCredentials {
  username: string;
  password: string;
  companyId: string;
}

export interface LoginResponse {
  success: boolean;
  session?: Session;
  error?: string;
  message?: string;
}

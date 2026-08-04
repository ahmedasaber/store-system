import api from './api.js';
import { ApiResponse } from '../types/index.js';

export interface AssignedBranchInfo {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface UserAuthProfile {
  id: string;
  fullName: string;
  email: string;
  userType: 'ADMIN' | 'EMPLOYEE';
  isActive: boolean;
  assignedBranches: AssignedBranchInfo[];
}

export interface LoginResponseData {
  accessToken: string;
  user: UserAuthProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', credentials);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  async getCurrentUser(): Promise<UserAuthProfile> {
    const response = await api.get<ApiResponse<UserAuthProfile>>('/auth/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};

export default authService;

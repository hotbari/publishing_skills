import { apiClient } from './api';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  AuthUser,
} from '../types';

// Mock data for development
const MOCK_USER: AuthUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'USER',
};

const MOCK_ADMIN: AuthUser = {
  id: '2',
  username: 'admin',
  email: 'admin@example.com',
  role: 'ADMIN',
};

const MOCK_TOKEN = 'mock-jwt-token-12345';

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAdmin = credentials.email.includes('admin');
        const user = isAdmin ? MOCK_ADMIN : MOCK_USER;

        apiClient.setAuthToken(MOCK_TOKEN);

        resolve({
          success: true,
          data: {
            user,
            token: MOCK_TOKEN,
          },
        });
      }, 500);
    });
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<void>('/auth/logout');

    // Mock implementation
    apiClient.clearAuthToken();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<AuthUser>('/auth/me');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
          resolve({
            success: false,
            error: 'Not authenticated',
          });
          return;
        }

        resolve({
          success: true,
          data: MOCK_USER,
        });
      }, 300);
    });
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<{ token: string }>('/auth/refresh');

    // Mock implementation
    return {
      success: true,
      data: {
        token: MOCK_TOKEN,
      },
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
export default authService;

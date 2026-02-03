// @ts-expect-error - apiClient will be used when real API calls are implemented
import { apiClient } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  User,
  UserRole,
  SystemPolicies,
  Job,
  JobFilters,
  AuditLog,
  AuditLogFilters,
} from '../types';

// Mock data for development
const MOCK_USERS: User[] = [
  {
    _id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    isActive: true,
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    _id: '2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
    updatedAt: new Date(Date.now() - 5184000000).toISOString(),
  },
  {
    _id: '3',
    username: 'john.doe',
    email: 'john.doe@example.com',
    role: 'USER',
    isActive: true,
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    updatedAt: new Date(Date.now() - 1296000000).toISOString(),
  },
];

const MOCK_POLICIES: SystemPolicies = {
  upload: {
    allowedExtensions: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'],
    maxSizeBytes: 52428800, // 50MB
    maxUploadCount: 100,
  },
  presign: {
    ttlSeconds: 3600,
  },
  ocr: {
    language: ['eng', 'kor'],
    dpi: 300,
    qualityOptions: {
      enhancement: true,
      deskew: true,
    },
  },
  imageExtraction: {
    mode: 'both',
    renderDpi: 300,
  },
  retry: {
    maxRetries: 3,
    backoffSeconds: 60,
    timeoutSeconds: 300,
  },
};

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    _id: 'audit1',
    actorId: '1',
    role: 'USER',
    action: 'upload',
    targetType: 'file',
    targetId: '1',
    result: 'success',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    _id: 'audit2',
    actorId: '1',
    role: 'USER',
    action: 'run_ocr',
    targetType: 'job',
    targetId: 'job1',
    result: 'success',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  },
  {
    _id: 'audit3',
    actorId: '2',
    role: 'ADMIN',
    action: 'change_policy',
    targetType: 'file',
    targetId: 'system',
    result: 'success',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    ip: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  },
];

class AdminService {
  // ==================== User Management ====================

  /**
   * List all users (Admin only)
   */
  async listUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: { role?: UserRole; isActive?: boolean; search?: string }
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    // TODO: Replace with real API call
    // const params = { page, pageSize, ...filters };
    // const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredUsers = [...MOCK_USERS];

        if (filters?.role) {
          filteredUsers = filteredUsers.filter((u) => u.role === filters.role);
        }

        if (filters?.isActive !== undefined) {
          filteredUsers = filteredUsers.filter((u) => u.isActive === filters.isActive);
        }

        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (u) =>
              u.username.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search)
          );
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedUsers = filteredUsers.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedUsers,
            total: filteredUsers.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredUsers.length / pageSize),
          },
        });
      }, 500);
    });
  }

  /**
   * Get user by ID (Admin only)
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<User>(`/admin/users/${userId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u._id === userId);

        if (!user) {
          resolve({
            success: false,
            error: 'User not found',
          });
          return;
        }

        resolve({
          success: true,
          data: user,
        });
      }, 300);
    });
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<ApiResponse<User>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<User>('/admin/users', userData);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          _id: `user-${Date.now()}`,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        resolve({
          success: true,
          data: newUser,
          message: 'User created successfully',
        });
      }, 500);
    });
  }

  /**
   * Update user (Admin only)
   */
  async updateUser(
    userId: string,
    updates: Partial<{ username: string; email: string; role: UserRole; isActive: boolean }>
  ): Promise<ApiResponse<User>> {
    // TODO: Replace with real API call
    // const response = await apiClient.put<User>(`/admin/users/${userId}`, updates);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u._id === userId);

        if (!user) {
          resolve({
            success: false,
            error: 'User not found',
          });
          return;
        }

        const updatedUser: User = {
          ...user,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        resolve({
          success: true,
          data: updatedUser,
          message: 'User updated successfully',
        });
      }, 500);
    });
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(_userId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with real API call
    // const response = await apiClient.delete<void>(`/admin/users/${userId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'User deleted successfully',
        });
      }, 500);
    });
  }

  // ==================== Policy Management ====================

  /**
   * Get system policies (Admin only)
   */
  async getPolicies(): Promise<ApiResponse<SystemPolicies>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<SystemPolicies>('/admin/policies');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: MOCK_POLICIES,
        });
      }, 300);
    });
  }

  /**
   * Update system policies (Admin only)
   */
  async updatePolicies(policies: Partial<SystemPolicies>): Promise<ApiResponse<SystemPolicies>> {
    // TODO: Replace with real API call
    // const response = await apiClient.put<SystemPolicies>('/admin/policies', policies);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedPolicies: SystemPolicies = {
          ...MOCK_POLICIES,
          ...policies,
        };

        resolve({
          success: true,
          data: updatedPolicies,
          message: 'Policies updated successfully',
        });
      }, 500);
    });
  }

  // ==================== Job Management (Admin View) ====================

  /**
   * List all jobs across all users (Admin only)
   */
  async listAllJobs(
    page: number = 1,
    pageSize: number = 10,
    _filters?: JobFilters
  ): Promise<ApiResponse<PaginatedResponse<Job>>> {
    // TODO: Replace with real API call
    // const params = { page, pageSize, ...filters };
    // const response = await apiClient.get<PaginatedResponse<Job>>('/admin/jobs', { params });

    // Mock implementation - reuse jobService mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            items: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0,
          },
        });
      }, 500);
    });
  }

  /**
   * Force retry job (Admin only)
   */
  async forceRetryJob(_jobId: string): Promise<ApiResponse<Job>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<Job>(`/admin/jobs/${jobId}/force-retry`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Job force retry initiated',
        } as ApiResponse<Job>);
      }, 500);
    });
  }

  /**
   * Cancel any job (Admin only)
   */
  async cancelAnyJob(_jobId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<void>(`/admin/jobs/${jobId}/cancel`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Job cancelled successfully',
        });
      }, 500);
    });
  }

  // ==================== Audit Logs ====================

  /**
   * List audit logs (Admin only)
   */
  async listAuditLogs(
    page: number = 1,
    pageSize: number = 20,
    filters?: AuditLogFilters
  ): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
    // TODO: Replace with real API call
    // const params = { page, pageSize, ...filters };
    // const response = await apiClient.get<PaginatedResponse<AuditLog>>('/admin/audit-logs', { params });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredLogs = [...MOCK_AUDIT_LOGS];

        if (filters?.action) {
          filteredLogs = filteredLogs.filter((log) => log.action === filters.action);
        }

        if (filters?.userId) {
          filteredLogs = filteredLogs.filter((log) => log.actorId === filters.userId);
        }

        if (filters?.targetType) {
          filteredLogs = filteredLogs.filter((log) => log.targetType === filters.targetType);
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedLogs = filteredLogs.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedLogs,
            total: filteredLogs.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredLogs.length / pageSize),
          },
        });
      }, 500);
    });
  }

  /**
   * Get audit log by ID (Admin only)
   */
  async getAuditLog(logId: string): Promise<ApiResponse<AuditLog>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<AuditLog>(`/admin/audit-logs/${logId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const log = MOCK_AUDIT_LOGS.find((l) => l._id === logId);

        if (!log) {
          resolve({
            success: false,
            error: 'Audit log not found',
          });
          return;
        }

        resolve({
          success: true,
          data: log,
        });
      }, 300);
    });
  }

  // ==================== System Statistics ====================

  /**
   * Get system statistics (Admin only)
   */
  async getSystemStats(): Promise<
    ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      totalFiles: number;
      totalJobs: number;
      jobsByStatus: Record<string, number>;
      storageUsed: number;
    }>
  > {
    // TODO: Replace with real API call
    // const response = await apiClient.get('/admin/stats');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalUsers: MOCK_USERS.length,
            activeUsers: MOCK_USERS.filter((u) => u.isActive).length,
            totalFiles: 156,
            totalJobs: 342,
            jobsByStatus: {
              QUEUED: 5,
              RUNNING: 12,
              SUCCEEDED: 298,
              FAILED: 23,
              PARTIAL: 4,
            },
            storageUsed: 5368709120, // ~5GB in bytes
          },
        });
      }, 500);
    });
  }
}

export const adminService = new AdminService();
export default adminService;

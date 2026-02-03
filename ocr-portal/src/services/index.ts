// Export all services
export { apiClient, default as api } from './api';
export { authService, default as auth } from './authService';
export { fileService, default as file } from './fileService';
export { jobService, default as job } from './jobService';
export { ocrService, default as ocr } from './ocrService';
export { imageService, default as image } from './imageService';
export { adminService, default as admin } from './adminService';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  AuthUser,
  UploadRequest,
  UploadUrlResponse,
  CreateJobRequest,
  PresignedUrlResponse,
  FileFilters,
  JobFilters,
  AuditLogFilters,
} from '../types';

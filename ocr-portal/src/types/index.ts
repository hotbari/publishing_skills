// Core Types based on PRD Section 13

export type UserRole = 'USER' | 'ADMIN';

export type FileStatus = 'STORED' | 'DELETED';

export type JobType = 'OCR_TEXT' | 'IMAGE_EXTRACT';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'PARTIAL';

export type TextGranularity = 'DOCUMENT' | 'PAGE';

export type ImageType = 'EMBEDDED' | 'RENDERED';

export interface MinIOReference {
  bucket: string;
  objectKey: string;
  etag?: string;
}

export interface FileMetadata {
  title: string;
  tags: string[];
  description?: string;
}

// Section 13.1: files
export interface File {
  _id: string;
  ownerId: string;
  status: FileStatus;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  minio: MinIOReference;
  metadata: FileMetadata;
  latestOcrJobId?: string;
  latestImageJobId?: string;
  createdAt: string;
  updatedAt: string;
}

// Section 13.2: jobs
export interface JobStep {
  name: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface Job {
  _id: string;
  fileId: string;
  ownerId: string;
  jobType: JobType;
  status: JobStatus;
  steps: JobStep[];
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  lockedBy?: string;
  heartbeatAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Section 13.3: extracted_texts
export interface ExtractedText {
  _id: string;
  fileId: string;
  jobId: string;
  version: number;
  granularity: TextGranularity;
  pageNo?: number;
  text: string;
  preview: string;
  textLength: number;
  createdAt: string;
}

// Section 13.4: extracted_images
export interface ExtractedImage {
  _id: string;
  fileId: string;
  jobId: string;
  imageType: ImageType;
  pageNo?: number;
  indexInPage?: number;
  minio: MinIOReference;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  sha256: string;
  createdAt: string;
}

// Section 13.5: audit_logs
export type AuditAction =
  | 'upload'
  | 'run_ocr'
  | 'run_image_extract'
  | 'view_text'
  | 'download_text'
  | 'view_image'
  | 'download_image'
  | 'delete_file'
  | 'change_policy';

export type AuditTargetType = 'file' | 'job' | 'image' | 'text';

export interface AuditLog {
  _id: string;
  actorId: string;
  role: UserRole;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string;
  result: string;
  createdAt: string;
  ip?: string;
  userAgent?: string;
}

// User Management
export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Policy Settings
export interface UploadPolicy {
  allowedExtensions: string[];
  maxSizeBytes: number;
  maxUploadCount: number;
}

export interface PresignPolicy {
  ttlSeconds: number;
}

export interface OcrPolicy {
  language: string[];
  dpi?: number;
  qualityOptions?: Record<string, any>;
}

export interface ImageExtractionPolicy {
  mode: 'embedded' | 'rendered' | 'both';
  renderDpi?: number;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffSeconds: number;
  timeoutSeconds: number;
}

export interface SystemPolicies {
  upload: UploadPolicy;
  presign: PresignPolicy;
  ocr: OcrPolicy;
  imageExtraction: ImageExtractionPolicy;
  retry: RetryPolicy;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PresignedUrlResponse {
  url: string;
  expiresAt: string;
}

// Auth
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// File Upload
export interface UploadRequest {
  metadata: FileMetadata;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
}

// Job Creation
export interface CreateJobRequest {
  fileId: string;
  jobType: JobType;
}

// Filters and Search
export interface FileFilters {
  search?: string;
  status?: FileStatus;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface JobFilters {
  status?: JobStatus;
  jobType?: JobType;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogFilters {
  action?: AuditAction;
  userId?: string;
  targetType?: AuditTargetType;
  startDate?: string;
  endDate?: string;
}

// @ts-expect-error - apiClient will be used when real API calls are implemented
import { apiClient } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  File,
  FileFilters,
  UploadUrlResponse,
  FileMetadata,
  PresignedUrlResponse,
} from '../types';

// Mock data for development
const MOCK_FILES: File[] = [
  {
    _id: '1',
    ownerId: '1',
    status: 'STORED',
    originalFileName: 'sample-document.pdf',
    contentType: 'application/pdf',
    sizeBytes: 1048576,
    sha256: 'abc123def456',
    minio: {
      bucket: 'uploads',
      objectKey: 'files/1/sample-document.pdf',
      etag: 'etag123',
    },
    metadata: {
      title: 'Sample Document',
      tags: ['research', 'important'],
      description: 'A sample PDF document',
    },
    latestOcrJobId: 'job1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '2',
    ownerId: '1',
    status: 'STORED',
    originalFileName: 'invoice-2024.pdf',
    contentType: 'application/pdf',
    sizeBytes: 524288,
    sha256: 'xyz789uvw012',
    minio: {
      bucket: 'uploads',
      objectKey: 'files/2/invoice-2024.pdf',
      etag: 'etag456',
    },
    metadata: {
      title: 'Invoice 2024',
      tags: ['finance', 'invoice'],
      description: 'Company invoice for 2024',
    },
    latestOcrJobId: 'job2',
    latestImageJobId: 'job3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

class FileService {
  /**
   * List all files with pagination and filters
   */
  async listFiles(
    page: number = 1,
    pageSize: number = 10,
    filters?: FileFilters
  ): Promise<ApiResponse<PaginatedResponse<File>>> {
    // TODO: Replace with real API call
    // const params = { page, pageSize, ...filters };
    // const response = await apiClient.get<PaginatedResponse<File>>('/files', { params });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredFiles = [...MOCK_FILES];

        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filteredFiles = filteredFiles.filter(
            (f) =>
              f.originalFileName.toLowerCase().includes(search) ||
              f.metadata.title.toLowerCase().includes(search)
          );
        }

        if (filters?.status) {
          filteredFiles = filteredFiles.filter((f) => f.status === filters.status);
        }

        if (filters?.tags && filters.tags.length > 0) {
          filteredFiles = filteredFiles.filter((f) =>
            filters.tags!.some((tag) => f.metadata.tags.includes(tag))
          );
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedFiles = filteredFiles.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedFiles,
            total: filteredFiles.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredFiles.length / pageSize),
          },
        });
      }, 500);
    });
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<ApiResponse<File>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<File>(`/files/${fileId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const file = MOCK_FILES.find((f) => f._id === fileId);

        if (!file) {
          resolve({
            success: false,
            error: 'File not found',
          });
          return;
        }

        resolve({
          success: true,
          data: file,
        });
      }, 300);
    });
  }

  /**
   * Request upload URL for file upload
   */
  async requestUploadUrl(_metadata: FileMetadata): Promise<ApiResponse<UploadUrlResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<UploadUrlResponse>('/files/upload-url', { metadata });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            uploadUrl: 'https://mock-presigned-url.s3.amazonaws.com/upload',
            fileId: `file-${Date.now()}`,
          },
        });
      }, 300);
    });
  }

  /**
   * Upload file using presigned URL
   */
  async uploadFile(_uploadUrl: string, _file: File): Promise<ApiResponse<void>> {
    // TODO: Replace with real implementation using fetch or axios
    // const response = await fetch(uploadUrl, {
    //   method: 'PUT',
    //   body: file,
    //   headers: { 'Content-Type': file.type },
    // });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'File uploaded successfully',
        });
      }, 1000);
    });
  }

  /**
   * Confirm file upload after successful upload to presigned URL
   */
  async confirmUpload(_fileId: string): Promise<ApiResponse<File>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<File>(`/files/${fileId}/confirm`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: MOCK_FILES[0],
        });
      }, 300);
    });
  }

  /**
   * Delete file
   */
  async deleteFile(_fileId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with real API call
    // const response = await apiClient.delete<void>(`/files/${fileId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'File deleted successfully',
        });
      }, 500);
    });
  }

  /**
   * Get presigned download URL for file
   */
  async getPresignedUrl(fileId: string): Promise<ApiResponse<PresignedUrlResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<PresignedUrlResponse>(`/files/${fileId}/download-url`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            url: `https://mock-presigned-url.s3.amazonaws.com/download/${fileId}`,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        });
      }, 300);
    });
  }

  /**
   * Update file metadata
   */
  async updateMetadata(fileId: string, metadata: Partial<FileMetadata>): Promise<ApiResponse<File>> {
    // TODO: Replace with real API call
    // const response = await apiClient.put<File>(`/files/${fileId}/metadata`, metadata);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const file = MOCK_FILES.find((f) => f._id === fileId);

        if (!file) {
          resolve({
            success: false,
            error: 'File not found',
          });
          return;
        }

        resolve({
          success: true,
          data: {
            ...file,
            metadata: {
              ...file.metadata,
              ...metadata,
            },
          },
        });
      }, 300);
    });
  }
}

export const fileService = new FileService();
export default fileService;

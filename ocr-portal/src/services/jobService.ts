// @ts-expect-error - apiClient will be used when real API calls are implemented
import { apiClient } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  Job,
  JobFilters,
  CreateJobRequest,
  JobType,
  JobStatus,
} from '../types';

// Mock data for development
const MOCK_JOBS: Job[] = [
  {
    _id: 'job1',
    fileId: '1',
    ownerId: '1',
    jobType: 'OCR_TEXT',
    status: 'SUCCEEDED',
    steps: [
      {
        name: 'download',
        status: 'completed',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        endedAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        name: 'ocr',
        status: 'completed',
        startedAt: new Date(Date.now() - 3500000).toISOString(),
        endedAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        name: 'upload',
        status: 'completed',
        startedAt: new Date(Date.now() - 3000000).toISOString(),
        endedAt: new Date(Date.now() - 2900000).toISOString(),
      },
    ],
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2900000).toISOString(),
  },
  {
    _id: 'job2',
    fileId: '2',
    ownerId: '1',
    jobType: 'OCR_TEXT',
    status: 'RUNNING',
    steps: [
      {
        name: 'download',
        status: 'completed',
        startedAt: new Date(Date.now() - 600000).toISOString(),
        endedAt: new Date(Date.now() - 500000).toISOString(),
      },
      {
        name: 'ocr',
        status: 'running',
        startedAt: new Date(Date.now() - 500000).toISOString(),
      },
    ],
    retryCount: 0,
    maxRetries: 3,
    lockedBy: 'worker-1',
    heartbeatAt: new Date(Date.now() - 10000).toISOString(),
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 10000).toISOString(),
  },
  {
    _id: 'job3',
    fileId: '2',
    ownerId: '1',
    jobType: 'IMAGE_EXTRACT',
    status: 'FAILED',
    steps: [
      {
        name: 'download',
        status: 'completed',
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        endedAt: new Date(Date.now() - 7100000).toISOString(),
      },
      {
        name: 'extract',
        status: 'failed',
        startedAt: new Date(Date.now() - 7100000).toISOString(),
        endedAt: new Date(Date.now() - 7000000).toISOString(),
        errorCode: 'EXTRACT_ERROR',
        errorMessage: 'Failed to extract images from PDF',
      },
    ],
    retryCount: 1,
    maxRetries: 3,
    nextRetryAt: new Date(Date.now() + 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7000000).toISOString(),
  },
];

class JobService {
  /**
   * Create a new job (OCR or Image Extraction)
   */
  async createJob(request: CreateJobRequest): Promise<ApiResponse<Job>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<Job>('/jobs', request);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newJob: Job = {
          _id: `job-${Date.now()}`,
          fileId: request.fileId,
          ownerId: '1',
          jobType: request.jobType,
          status: 'QUEUED',
          steps: [],
          retryCount: 0,
          maxRetries: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        resolve({
          success: true,
          data: newJob,
          message: 'Job created successfully',
        });
      }, 500);
    });
  }

  /**
   * List all jobs with pagination and filters
   */
  async listJobs(
    page: number = 1,
    pageSize: number = 10,
    filters?: JobFilters
  ): Promise<ApiResponse<PaginatedResponse<Job>>> {
    // TODO: Replace with real API call
    // const params = { page, pageSize, ...filters };
    // const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', { params });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredJobs = [...MOCK_JOBS];

        if (filters?.status) {
          filteredJobs = filteredJobs.filter((j) => j.status === filters.status);
        }

        if (filters?.jobType) {
          filteredJobs = filteredJobs.filter((j) => j.jobType === filters.jobType);
        }

        if (filters?.userId) {
          filteredJobs = filteredJobs.filter((j) => j.ownerId === filters.userId);
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedJobs = filteredJobs.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedJobs,
            total: filteredJobs.length,
            page,
            pageSize,
            totalPages: Math.ceil(filteredJobs.length / pageSize),
          },
        });
      }, 500);
    });
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string): Promise<ApiResponse<Job>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<Job>(`/jobs/${jobId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = MOCK_JOBS.find((j) => j._id === jobId);

        if (!job) {
          resolve({
            success: false,
            error: 'Job not found',
          });
          return;
        }

        resolve({
          success: true,
          data: job,
        });
      }, 300);
    });
  }

  /**
   * Retry a failed job
   */
  async retryJob(jobId: string): Promise<ApiResponse<Job>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<Job>(`/jobs/${jobId}/retry`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = MOCK_JOBS.find((j) => j._id === jobId);

        if (!job) {
          resolve({
            success: false,
            error: 'Job not found',
          });
          return;
        }

        if (job.status !== 'FAILED') {
          resolve({
            success: false,
            error: 'Only failed jobs can be retried',
          });
          return;
        }

        const retriedJob: Job = {
          ...job,
          status: 'QUEUED',
          retryCount: job.retryCount + 1,
          nextRetryAt: undefined,
          updatedAt: new Date().toISOString(),
        };

        resolve({
          success: true,
          data: retriedJob,
          message: 'Job retry initiated',
        });
      }, 500);
    });
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<void>(`/jobs/${jobId}/cancel`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = MOCK_JOBS.find((j) => j._id === jobId);

        if (!job) {
          resolve({
            success: false,
            error: 'Job not found',
          });
          return;
        }

        if (job.status !== 'RUNNING' && job.status !== 'QUEUED') {
          resolve({
            success: false,
            error: 'Only running or queued jobs can be cancelled',
          });
          return;
        }

        resolve({
          success: true,
          message: 'Job cancelled successfully',
        });
      }, 500);
    });
  }

  /**
   * Get jobs by file ID
   */
  async getJobsByFileId(fileId: string): Promise<ApiResponse<Job[]>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<Job[]>(`/files/${fileId}/jobs`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = MOCK_JOBS.filter((j) => j.fileId === fileId);

        resolve({
          success: true,
          data: jobs,
        });
      }, 300);
    });
  }

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<
    ApiResponse<{
      total: number;
      byStatus: Record<JobStatus, number>;
      byType: Record<JobType, number>;
    }>
  > {
    // TODO: Replace with real API call
    // const response = await apiClient.get('/jobs/stats');

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const byStatus: Record<JobStatus, number> = {
          QUEUED: 0,
          RUNNING: 0,
          SUCCEEDED: 0,
          FAILED: 0,
          PARTIAL: 0,
        };

        const byType: Record<JobType, number> = {
          OCR_TEXT: 0,
          IMAGE_EXTRACT: 0,
        };

        MOCK_JOBS.forEach((job) => {
          byStatus[job.status]++;
          byType[job.jobType]++;
        });

        resolve({
          success: true,
          data: {
            total: MOCK_JOBS.length,
            byStatus,
            byType,
          },
        });
      }, 300);
    });
  }
}

export const jobService = new JobService();
export default jobService;

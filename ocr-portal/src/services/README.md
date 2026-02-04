# API Service Layer

This directory contains all API service modules for the OCR Portal application.

## Service Modules

### 1. api.ts - Base API Client
- Axios instance with auth token handling
- Request/response interceptors
- Error handling and token management
- Generic HTTP methods (GET, POST, PUT, DELETE)
- File upload support

**Key Features:**
- Automatic JWT token injection from localStorage
- Consistent error handling across all requests
- ApiResponse<T> wrapper for all responses

### 2. authService.ts - Authentication
- `login(credentials)` - User login with email/password
- `logout()` - Clear auth token and logout
- `getCurrentUser()` - Get current authenticated user
- `refreshToken()` - Refresh JWT token
- `isAuthenticated()` - Check authentication status
- `getToken()` - Get stored auth token

**Mock Data:**
- MOCK_USER (USER role)
- MOCK_ADMIN (ADMIN role)
- MOCK_TOKEN

### 3. fileService.ts - File Management
- `listFiles(page, pageSize, filters)` - List files with pagination and filters
- `getFile(fileId)` - Get file by ID
- `requestUploadUrl(metadata)` - Get presigned upload URL
- `uploadFile(uploadUrl, file)` - Upload file to presigned URL
- `confirmUpload(fileId)` - Confirm upload completion
- `deleteFile(fileId)` - Delete file
- `getPresignedUrl(fileId)` - Get download URL
- `updateMetadata(fileId, metadata)` - Update file metadata

**Mock Data:**
- 2 sample PDF files with metadata, tags, and OCR/image job references

### 4. jobService.ts - Job Management
- `createJob(request)` - Create OCR or Image Extraction job
- `listJobs(page, pageSize, filters)` - List jobs with pagination
- `getJob(jobId)` - Get job by ID
- `retryJob(jobId)` - Retry failed job
- `cancelJob(jobId)` - Cancel running/queued job
- `getJobsByFileId(fileId)` - Get all jobs for a file
- `getJobStats()` - Get job statistics

**Mock Data:**
- 3 sample jobs (SUCCEEDED, RUNNING, FAILED) with job steps

### 5. ocrService.ts - OCR Text Management
- `getExtractedTexts(fileId, granularity, page, pageSize)` - List extracted texts
- `getExtractedText(textId)` - Get text by ID
- `getDocumentText(fileId)` - Get document-level text
- `getPageTexts(fileId)` - Get all page-level texts
- `getPageText(fileId, pageNo)` - Get specific page text
- `downloadText(textId, format)` - Download text as .txt or .json
- `searchTexts(fileId, query)` - Search within texts
- `getTextStats(fileId)` - Get text statistics

**Mock Data:**
- Document-level and page-level extracted texts

### 6. imageService.ts - Image Management
- `listExtractedImages(fileId, imageType, page, pageSize)` - List extracted images
- `getExtractedImage(imageId)` - Get image by ID
- `getPageImages(fileId, pageNo)` - Get images from specific page
- `getEmbeddedImages(fileId)` - Get embedded images only
- `getRenderedImages(fileId)` - Get rendered page images only
- `getImagePresignedUrl(imageId)` - Get presigned URL for image
- `downloadImage(imageId)` - Download image as blob
- `getImageStats(fileId)` - Get image statistics
- `downloadImagesZip(fileId)` - Download all images as ZIP

**Mock Data:**
- EMBEDDED and RENDERED images with dimensions and format info

### 7. adminService.ts - Admin Operations

#### User Management
- `listUsers(page, pageSize, filters)` - List all users
- `getUser(userId)` - Get user by ID
- `createUser(userData)` - Create new user
- `updateUser(userId, updates)` - Update user
- `deleteUser(userId)` - Delete user

#### Policy Management
- `getPolicies()` - Get system policies
- `updatePolicies(policies)` - Update system policies

#### Job Management (Admin)
- `listAllJobs(page, pageSize, filters)` - List all jobs across users
- `forceRetryJob(jobId)` - Force retry any job
- `cancelAnyJob(jobId)` - Cancel any job

#### Audit Logs
- `listAuditLogs(page, pageSize, filters)` - List audit logs
- `getAuditLog(logId)` - Get audit log by ID

#### System Statistics
- `getSystemStats()` - Get system-wide statistics

**Mock Data:**
- 3 sample users (2 USER, 1 ADMIN)
- Complete SystemPolicies configuration
- Audit logs with various actions

## Usage Examples

```typescript
import { authService, fileService, jobService } from './services';

// Login
const loginResponse = await authService.login({
  email: 'test@example.com',
  password: 'password123',
});

if (loginResponse.success) {
  console.log('User:', loginResponse.data?.user);
}

// List files
const filesResponse = await fileService.listFiles(1, 10, {
  search: 'invoice',
  tags: ['finance'],
});

if (filesResponse.success) {
  console.log('Files:', filesResponse.data?.items);
}

// Create OCR job
const jobResponse = await jobService.createJob({
  fileId: 'file123',
  jobType: 'OCR_TEXT',
});
```

## Response Types

All services use consistent response types from `src/types/index.ts`:

- `ApiResponse<T>` - Single item response
- `PaginatedResponse<T>` - Paginated list response
- `PresignedUrlResponse` - Presigned URL with expiration

## Error Handling

All services handle errors consistently:
- Network errors return `{ success: false, error: 'message' }`
- Server errors are extracted from response data
- Timeout errors are caught and reported

## Mock Data vs Real API

All services currently use mock data with setTimeout delays to simulate API calls. Real API integration points are marked with:

```typescript
// TODO: Replace with real API call
// const response = await apiClient.get<T>('/endpoint');
```

Replace these commented sections with actual API calls when backend is ready.

## TypeScript Types

All services are fully typed using types from `src/types/index.ts`:
- File, Job, ExtractedText, ExtractedImage
- User, AuditLog, SystemPolicies
- Filter types for list operations
- Request/response types for operations

## Token Management

The base `apiClient` handles authentication tokens automatically:
- Tokens stored in localStorage as 'authToken'
- Auto-injected in Authorization header for all requests
- `authService` manages token lifecycle (login/logout/refresh)

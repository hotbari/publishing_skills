import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout, Button, Tabs } from '../components/common';
import { fileService } from '../services/fileService';
import { jobService } from '../services/jobService';
import { File, Job } from '../types';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Download,
  Image as ImageIcon,
  Play,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

/**
 * FileDetailPage Component
 *
 * Displays detailed information about a file with tabs for:
 * - Original File Info
 * - OCR Text
 * - Images
 * - Job History
 *
 * Following PRD FR-081, Section 12 (UI-004)
 */
export default function FileDetailPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // OCR states
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrText] = useState<string>('');

  // Image extraction states
  const [imagesRunning, setImagesRunning] = useState(false);

  useEffect(() => {
    loadFileData();
  }, [fileId]);

  const loadFileData = async () => {
    if (!fileId) return;

    try {
      setLoading(true);
      setError('');

      const [fileResponse, jobsResponse] = await Promise.all([
        fileService.getFile(fileId),
        jobService.getJobsByFileId(fileId),
      ]);

      if (!fileResponse.success || !fileResponse.data) {
        setError(fileResponse.error || 'Failed to load file');
        return;
      }

      setFile(fileResponse.data);

      if (jobsResponse.success && jobsResponse.data) {
        setJobs(jobsResponse.data);
      }
    } catch (err) {
      setError('An error occurred while loading file data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunOcr = async () => {
    if (!fileId) return;

    try {
      setOcrRunning(true);
      const response = await jobService.createJob({
        fileId,
        jobType: 'OCR_TEXT',
      });

      if (response.success) {
        // Reload jobs to show new job
        const jobsResponse = await jobService.getJobsByFileId(fileId);
        if (jobsResponse.success && jobsResponse.data) {
          setJobs(jobsResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to run OCR', err);
    } finally {
      setOcrRunning(false);
    }
  };

  const handleExtractImages = async () => {
    if (!fileId) return;

    try {
      setImagesRunning(true);
      const response = await jobService.createJob({
        fileId,
        jobType: 'IMAGE_EXTRACT',
      });

      if (response.success) {
        // Reload jobs to show new job
        const jobsResponse = await jobService.getJobsByFileId(fileId);
        if (jobsResponse.success && jobsResponse.data) {
          setJobs(jobsResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to extract images', err);
    } finally {
      setImagesRunning(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await jobService.retryJob(jobId);
      // Reload jobs
      loadFileData();
    } catch (err) {
      console.error('Failed to retry job', err);
    }
  };

  const handleDelete = async () => {
    if (!fileId || !window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fileService.deleteFile(fileId);
      if (response.success) {
        navigate('/files');
      }
    } catch (err) {
      console.error('Failed to delete file', err);
    }
  };

  const handleDownload = async () => {
    if (!fileId) return;

    try {
      const response = await fileService.getPresignedUrl(fileId);
      if (response.success && response.data) {
        window.open(response.data.url, '_blank');
      }
    } catch (err) {
      console.error('Failed to download file', err);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  if (error || !file) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/files')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Files
          </Button>
          <div className="border rounded-lg p-8 bg-card text-center">
            <p className="text-destructive">{error || 'File not found'}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'RUNNING':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const ocrJobs = jobs.filter((j) => j.jobType === 'OCR_TEXT');
  const imageJobs = jobs.filter((j) => j.jobType === 'IMAGE_EXTRACT');
  const latestOcrJob = ocrJobs.find((j) => j.status === 'SUCCEEDED');

  const tabs = [
    {
      id: 'info',
      label: 'Original File Info',
      content: (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="text-lg font-semibold">File Metadata</h2>
            </div>
            <dl className="grid grid-cols-2 gap-6 p-6">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Title
                </dt>
                <dd className="text-sm">{file.metadata.title}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  File Name
                </dt>
                <dd className="text-sm font-mono text-xs">{file.originalFileName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Content Type
                </dt>
                <dd className="text-sm">{file.contentType}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Size
                </dt>
                <dd className="text-sm">{formatBytes(file.sizeBytes)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Uploaded
                </dt>
                <dd className="text-sm">{formatDate(file.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Status
                </dt>
                <dd className="text-sm">
                  <span
                    className={
                      file.status === 'STORED'
                        ? 'text-green-600 font-medium'
                        : 'text-muted-foreground'
                    }
                  >
                    {file.status}
                  </span>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Tags
                </dt>
                <dd className="flex gap-2 flex-wrap mt-2">
                  {file.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
              {file.metadata.description && (
                <div className="col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </dt>
                  <dd className="text-sm">{file.metadata.description}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Original File
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'ocr',
      label: 'OCR Text',
      content: (
        <div className="space-y-6">
          {/* Run OCR Button */}
          {!latestOcrJob && (
            <div className="border rounded-lg p-8 bg-card text-center space-y-4">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No OCR Results Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Run OCR to extract text from this document
                </p>
              </div>
              <Button onClick={handleRunOcr} disabled={ocrRunning}>
                {ocrRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running OCR...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run OCR
                  </>
                )}
              </Button>
            </div>
          )}

          {/* OCR Results */}
          {latestOcrJob && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>OCR completed on {formatDate(latestOcrJob.updatedAt)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRunOcr} disabled={ocrRunning}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-run OCR
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Text
                  </Button>
                </div>
              </div>

              {/* Text Viewer */}
              <div className="border rounded-lg bg-card overflow-hidden">
                <div className="border-b bg-muted/30 px-6 py-4">
                  <h3 className="text-sm font-semibold">Extracted Text</h3>
                </div>
                <div className="p-6">
                  <div className="bg-muted/20 rounded-md p-4 font-mono text-sm max-h-96 overflow-y-auto">
                    {ocrText || 'This is sample OCR text extracted from the document. In a real implementation, this would show the actual extracted text content.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'images',
      label: 'Images',
      content: (
        <div className="space-y-6">
          {imageJobs.length === 0 && (
            <div className="border rounded-lg p-8 bg-card text-center space-y-4">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Images Extracted Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Extract images from this document
                </p>
              </div>
              <Button onClick={handleExtractImages} disabled={imagesRunning}>
                {imagesRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Extract Images
                  </>
                )}
              </Button>
            </div>
          )}

          {imageJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Image extraction jobs have been created. Check Job History tab for status.
                </div>
                <Button variant="outline" size="sm" onClick={handleExtractImages} disabled={imagesRunning}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-extract
                </Button>
              </div>

              {/* Image Gallery Placeholder */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square border rounded-lg bg-muted/20 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'history',
      label: 'Job History',
      content: (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="border rounded-lg p-8 bg-card text-center">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No jobs yet</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="border rounded-lg bg-card overflow-hidden shadow-sm">
                {/* Job Header */}
                <div className="border-b bg-muted/30 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getJobStatusIcon(job.status)}
                    <div>
                      <h3 className="text-sm font-semibold">
                        {job.jobType === 'OCR_TEXT' ? 'OCR Text Extraction' : 'Image Extraction'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'SUCCEEDED'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : job.status === 'FAILED'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : job.status === 'RUNNING'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}
                    >
                      {job.status}
                    </span>
                    {job.status === 'FAILED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryJob(job._id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                {/* Job Steps */}
                {job.steps.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Steps
                    </h4>
                    <div className="space-y-3">
                      {job.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium capitalize">{step.name}</span>
                              {step.status === 'completed' && (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              )}
                              {step.status === 'failed' && (
                                <XCircle className="w-3 h-3 text-red-600" />
                              )}
                              {step.status === 'running' && (
                                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                              )}
                            </div>
                            {step.errorMessage && (
                              <p className="text-xs text-red-600 mt-1">{step.errorMessage}</p>
                            )}
                            {step.startedAt && (
                              <p className="text-xs text-muted-foreground">
                                Started: {formatDate(step.startedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/files')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Files
        </Button>

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{file.metadata.title}</h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              {file.originalFileName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/files/${fileId}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Metadata
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="info" />
      </div>
    </PageLayout>
  );
}

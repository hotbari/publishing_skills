/**
 * Job Monitoring Page
 *
 * Admin page for monitoring and managing OCR processing jobs.
 * Implements FR-102 requirement from PRD.
 *
 * Features:
 * - Job list table with ID, File, Type, Status, User, Created, Actions
 * - Filters: status, type, user, date range
 * - Click job row opens modal with execution steps and error details
 * - Retry/Cancel actions for jobs
 * - Status badges with semantic colors
 * - Real-time job status tracking
 *
 * Uses ListPage template patterns:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed structure (header → search/filters → table → pagination)
 * - Components: Only from components/common
 */

import { useState } from 'react'
import {
  Button,
  Input,
  PageLayout,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from '@/components/common'
import { Search, RefreshCw, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react'

interface JobStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime?: string
  endTime?: string
  error?: string
}

interface Job {
  id: string
  fileId: string
  fileName: string
  type: 'OCR_TEXT' | 'IMAGE_EXTRACTION'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  userId: string
  userName: string
  createdAt: string
  completedAt?: string
  progress: number
  steps: JobStep[]
  error?: string
}

export default function JobMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Job['status']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | Job['type']>('all')
  const [userFilter, setUserFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Mock data
  const allJobs: Job[] = [
    {
      id: 'JOB-001',
      fileId: 'FILE-001',
      fileName: 'document_scan.pdf',
      type: 'OCR_TEXT',
      status: 'completed',
      userId: 'USER-001',
      userName: 'john_doe',
      createdAt: '2026-02-03 10:30:00',
      completedAt: '2026-02-03 10:35:22',
      progress: 100,
      steps: [
        {
          id: 'STEP-1',
          name: 'File Validation',
          status: 'completed',
          startTime: '10:30:00',
          endTime: '10:30:05',
        },
        {
          id: 'STEP-2',
          name: 'OCR Processing',
          status: 'completed',
          startTime: '10:30:05',
          endTime: '10:35:15',
        },
        {
          id: 'STEP-3',
          name: 'Text Extraction',
          status: 'completed',
          startTime: '10:35:15',
          endTime: '10:35:22',
        },
      ],
    },
    {
      id: 'JOB-002',
      fileId: 'FILE-002',
      fileName: 'invoice.pdf',
      type: 'IMAGE_EXTRACTION',
      status: 'processing',
      userId: 'USER-002',
      userName: 'jane_smith',
      createdAt: '2026-02-03 11:15:00',
      progress: 65,
      steps: [
        {
          id: 'STEP-1',
          name: 'File Validation',
          status: 'completed',
          startTime: '11:15:00',
          endTime: '11:15:03',
        },
        {
          id: 'STEP-2',
          name: 'Image Detection',
          status: 'running',
          startTime: '11:15:03',
        },
        {
          id: 'STEP-3',
          name: 'Image Extraction',
          status: 'pending',
        },
      ],
    },
    {
      id: 'JOB-003',
      fileId: 'FILE-003',
      fileName: 'report.pdf',
      type: 'OCR_TEXT',
      status: 'failed',
      userId: 'USER-001',
      userName: 'john_doe',
      createdAt: '2026-02-03 09:45:00',
      progress: 30,
      steps: [
        {
          id: 'STEP-1',
          name: 'File Validation',
          status: 'completed',
          startTime: '09:45:00',
          endTime: '09:45:02',
        },
        {
          id: 'STEP-2',
          name: 'OCR Processing',
          status: 'failed',
          startTime: '09:45:02',
          endTime: '09:55:30',
          error: 'OCR engine timeout after 10 minutes. File may be corrupted or contain unsupported format.',
        },
      ],
      error: 'OCR engine timeout after 10 minutes. File may be corrupted or contain unsupported format.',
    },
    {
      id: 'JOB-004',
      fileId: 'FILE-004',
      fileName: 'contract.pdf',
      type: 'OCR_TEXT',
      status: 'pending',
      userId: 'USER-003',
      userName: 'bob_wilson',
      createdAt: '2026-02-03 11:50:00',
      progress: 0,
      steps: [
        {
          id: 'STEP-1',
          name: 'File Validation',
          status: 'pending',
        },
        {
          id: 'STEP-2',
          name: 'OCR Processing',
          status: 'pending',
        },
        {
          id: 'STEP-3',
          name: 'Text Extraction',
          status: 'pending',
        },
      ],
    },
    {
      id: 'JOB-005',
      fileId: 'FILE-005',
      fileName: 'form.pdf',
      type: 'IMAGE_EXTRACTION',
      status: 'completed',
      userId: 'USER-002',
      userName: 'jane_smith',
      createdAt: '2026-02-03 08:20:00',
      completedAt: '2026-02-03 08:25:45',
      progress: 100,
      steps: [
        {
          id: 'STEP-1',
          name: 'File Validation',
          status: 'completed',
          startTime: '08:20:00',
          endTime: '08:20:03',
        },
        {
          id: 'STEP-2',
          name: 'Image Detection',
          status: 'completed',
          startTime: '08:20:03',
          endTime: '08:25:30',
        },
        {
          id: 'STEP-3',
          name: 'Image Extraction',
          status: 'completed',
          startTime: '08:25:30',
          endTime: '08:25:45',
        },
      ],
    },
  ]

  // Filter jobs
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    const matchesType = typeFilter === 'all' || job.type === typeFilter
    const matchesUser = userFilter === '' || job.userName.toLowerCase().includes(userFilter.toLowerCase())
    return matchesSearch && matchesStatus && matchesType && matchesUser
  })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedJob(null)
  }

  const handleRetryJob = (jobId: string) => {
    // TODO: Implement API call to retry job
    console.log('Retrying job:', jobId)
    handleCloseModal()
  }

  const handleCancelJob = (jobId: string) => {
    // TODO: Implement API call to cancel job
    console.log('Canceling job:', jobId)
    handleCloseModal()
  }

  // Status badge styling
  const getStatusBadgeClasses = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success'
      case 'processing':
        return 'bg-info/20 text-info'
      case 'pending':
        return 'bg-warning/20 text-warning'
      case 'failed':
        return 'bg-destructive/20 text-destructive'
      default:
        return 'bg-muted/20 text-muted-foreground'
    }
  }

  // Status icon
  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <Loader className="w-4 h-4 animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStepStatusIcon = (status: JobStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'running':
        return <Loader className="w-4 h-4 text-info animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Job Monitoring</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage OCR processing jobs
            </p>
          </div>
        </div>

        {/* Search and Filters - FIXED STRUCTURE */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by job ID or file name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | Job['status'])
                setCurrentPage(1)
              }}
              className="px-4 h-10 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as 'all' | Job['type'])
                setCurrentPage(1)
              }}
              className="px-4 h-10 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">All Types</option>
              <option value="OCR_TEXT">OCR Text</option>
              <option value="IMAGE_EXTRACTION">Image Extraction</option>
            </select>

            <div className="flex-1 min-w-[200px] relative">
              <Input
                placeholder="Filter by user..."
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </div>

        {/* Table - FIXED STRUCTURE */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Job ID</th>
                <th className="text-left p-4 font-medium">File</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <td className="p-4 font-mono text-sm font-medium">{job.id}</td>
                    <td className="p-4 text-muted-foreground text-sm">{job.fileName}</td>
                    <td className="p-4 text-sm">
                      <span className="bg-muted/50 px-2 py-1 rounded text-xs font-medium">
                        {job.type === 'OCR_TEXT' ? 'OCR Text' : 'Image Extraction'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getStatusBadgeClasses(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                        </div>
                        {job.status === 'processing' && (
                          <span className="text-xs text-muted-foreground">{job.progress}%</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{job.userName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{job.createdAt}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleJobClick(job)
                          }}
                        >
                          Details
                        </Button>
                        {job.status === 'failed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRetryJob(job.id)
                            }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of{' '}
            {filteredJobs.length} jobs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        {selectedJob && (
          <>
            <ModalHeader>
              <ModalTitle>Job Details - {selectedJob.id}</ModalTitle>
              <ModalClose onClose={handleCloseModal} />
            </ModalHeader>

            <ModalBody>
              {/* Job Summary */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">File</p>
                  <p className="font-medium text-sm">{selectedJob.fileName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium text-sm">
                    {selectedJob.type === 'OCR_TEXT' ? 'OCR Text' : 'Image Extraction'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">User</p>
                  <p className="font-medium text-sm">{selectedJob.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClasses(selectedJob.status)}`}>
                    {getStatusIcon(selectedJob.status)}
                    <span className="capitalize">{selectedJob.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium text-sm">{selectedJob.createdAt}</p>
                </div>
                {selectedJob.completedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-medium text-sm">{selectedJob.completedAt}</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {selectedJob.status === 'processing' && (
                <div className="py-4 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Progress</p>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${selectedJob.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{selectedJob.progress}% complete</p>
                </div>
              )}

              {/* Execution Steps */}
              <div className="py-4 border-b border-border">
                <h3 className="font-semibold text-sm mb-4">Execution Steps</h3>
                <div className="space-y-3">
                  {selectedJob.steps.map((step) => (
                    <div key={step.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.startTime && (
                            <>
                              {step.startTime}
                              {step.endTime && ` - ${step.endTime}`}
                            </>
                          )}
                        </p>
                        {step.error && (
                          <p className="text-xs text-destructive mt-1">{step.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Details */}
              {selectedJob.error && (
                <div className="py-4 bg-destructive/10 p-4 rounded-md border border-destructive/20">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-destructive mb-1">Error</h4>
                      <p className="text-sm text-destructive/90">{selectedJob.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
              {selectedJob.status === 'failed' && (
                <Button
                  variant="primary"
                  onClick={() => handleRetryJob(selectedJob.id)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Job
                </Button>
              )}
              {(selectedJob.status === 'pending' || selectedJob.status === 'processing') && (
                <Button
                  variant="destructive"
                  onClick={() => handleCancelJob(selectedJob.id)}
                >
                  Cancel Job
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </Modal>
    </PageLayout>
  )
}

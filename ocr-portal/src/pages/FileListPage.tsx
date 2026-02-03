import { useState, useEffect } from 'react'
import { PageLayout, Button, Input } from '@/components/common'
import { File as FileRecord, FileFilters, PaginatedResponse } from '@/types'
import { apiClient } from '@/services/api'
import { cn } from '@/lib/utils'

/**
 * FileListPage Component
 *
 * Implements FR-010 to FR-016:
 * - List all user files with pagination
 * - Upload file with metadata
 * - Search and filter files
 * - View, download, and delete actions
 * - Status badges for job states
 */

// Composite status type combining file and job statuses
type FileDisplayStatus =
  | 'STORED'
  | 'OCR_DONE'
  | 'IMG_DONE'
  | 'OCR_FAIL'
  | 'IMG_FAIL'
  | 'PROCESSING'

interface FileWithStatus extends FileRecord {
  displayStatus: FileDisplayStatus
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Step 1: Request upload URL
      const metadata = {
        title: title.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        description: description.trim() || undefined
      }

      const urlResponse = await apiClient.post<{ uploadUrl: string; fileId: string }>(
        '/files/upload/request',
        { metadata, contentType: selectedFile.type, sizeBytes: selectedFile.size }
      )

      if (!urlResponse.success || !urlResponse.data) {
        throw new Error(urlResponse.error || 'Failed to get upload URL')
      }

      const { uploadUrl, fileId } = urlResponse.data

      // Step 2: Upload file to presigned URL
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type
        }
      })

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file')
      }

      // Step 3: Confirm upload
      await apiClient.post(`/files/${fileId}/upload/confirm`)

      // Success
      onUploadSuccess()
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setTitle('')
    setTags('')
    setDescription('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-semibold">Upload File</h2>
          <p className="text-muted-foreground mt-2">
            Upload a PDF file for OCR and image extraction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">
              File <span className="text-destructive">*</span>
            </label>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                selectedFile && 'border-primary bg-primary/5'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf"
                disabled={uploading}
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-lg font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <p className="text-lg font-medium">Drop file here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">PDF files only</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter file title"
              disabled={uploading}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Example: invoice, 2024, client-abc
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description (optional)"
              disabled={uploading}
              className={cn(
                'flex min-h-[80px] w-full rounded-md border border-input bg-background px-4 py-2',
                'text-sm ring-offset-background resize-none',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onClose()
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: FileDisplayStatus }) {
  const variants = {
    STORED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    OCR_DONE: 'bg-green-500/10 text-green-500 border-green-500/20',
    IMG_DONE: 'bg-green-500/10 text-green-500 border-green-500/20',
    OCR_FAIL: 'bg-red-500/10 text-red-500 border-red-500/20',
    IMG_FAIL: 'bg-red-500/10 text-red-500 border-red-500/20',
    PROCESSING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
  }

  const labels = {
    STORED: 'Stored',
    OCR_DONE: 'OCR Complete',
    IMG_DONE: 'Images Extracted',
    OCR_FAIL: 'OCR Failed',
    IMG_FAIL: 'Image Extraction Failed',
    PROCESSING: 'Processing'
  }

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
      variants[status]
    )}>
      {labels[status]}
    </span>
  )
}

function FileListPage() {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true)
    try {
      const filters: FileFilters = {
        search: searchQuery || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      }

      if (statusFilter !== 'all') {
        filters.status = statusFilter as any
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        )
      })

      const response = await apiClient.get<PaginatedResponse<FileRecord>>(
        `/files?${queryParams.toString()}`
      )

      if (response.success && response.data) {
        // Map files to include display status
        const filesWithStatus: FileWithStatus[] = response.data.items.map(file => ({
          ...file,
          displayStatus: determineDisplayStatus(file)
        }))

        setFiles(filesWithStatus)
        setTotal(response.data.total)
        setTotalPages(response.data.totalPages)
      }
    } catch (err) {
      console.error('Failed to fetch files:', err)
    } finally {
      setLoading(false)
    }
  }

  // Determine display status from file and job states
  const determineDisplayStatus = (_file: FileRecord): FileDisplayStatus => {
    // This is a simplified version - in production, you'd check job statuses
    // For now, just return STORED
    return 'STORED'
  }

  useEffect(() => {
    fetchFiles()
  }, [page, searchQuery, statusFilter, startDate, endDate])

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return
    }

    try {
      const response = await apiClient.delete(`/files/${fileId}`)
      if (response.success) {
        fetchFiles()
      }
    } catch (err) {
      console.error('Failed to delete file:', err)
    }
  }

  const handleDownload = async (file: FileWithStatus) => {
    try {
      const response = await apiClient.get<{ url: string }>(
        `/files/${file._id}/download`
      )

      if (response.success && response.data) {
        window.open(response.data.url, '_blank')
      }
    } catch (err) {
      console.error('Failed to download file:', err)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">My Files</h1>
            <p className="text-muted-foreground mt-2">
              Manage your uploaded documents and view processing status
            </p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)}>
            Upload File
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <Input
              placeholder="Search files by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'h-10 rounded-md border border-input bg-background px-4 py-2',
              'text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value="all">All Status</option>
            <option value="STORED">Stored</option>
            <option value="OCR_DONE">OCR Complete</option>
            <option value="IMG_DONE">Images Extracted</option>
            <option value="OCR_FAIL">OCR Failed</option>
            <option value="IMG_FAIL">Image Extraction Failed</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={cn(
              'h-10 rounded-md border border-input bg-background px-4 py-2',
              'text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            placeholder="Start date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={cn(
              'h-10 rounded-md border border-input bg-background px-4 py-2',
              'text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            placeholder="End date"
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">No files yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first file to get started with OCR and image extraction
              </p>
              <Button onClick={() => setUploadModalOpen(true)}>
                Upload File
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Upload Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file._id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{file.metadata.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {file.originalFileName}
                          </div>
                          {file.metadata.tags.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {file.metadata.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={file.displayStatus} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatBytes(file.sizeBytes)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Navigate to file detail page
                              window.location.href = `/files/${file._id}`
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && files.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 text-sm">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={() => {
          fetchFiles()
        }}
      />
    </PageLayout>
  )
}

export default FileListPage

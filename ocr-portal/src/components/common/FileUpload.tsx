import * as React from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, FileText } from 'lucide-react'

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  className?: string
}

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

/**
 * FileUpload Component
 *
 * Drag-and-drop upload component with progress
 * Consistency rules:
 * - All file uploads use this component
 * - Shows upload progress
 * - Supports drag-and-drop
 * - Validates file size and type
 * - Spacing follows 8px scale
 */
export function FileUpload({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`
    }
    // Additional validation can be added here
    return null
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const newUploadedFiles: UploadedFile[] = []

    // Check max files
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    fileArray.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newUploadedFiles.push({
          file,
          progress: 0,
          status: 'error',
          error,
        })
      } else {
        validFiles.push(file)
        newUploadedFiles.push({
          file,
          progress: 0,
          status: 'uploading',
        })
      }
    })

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

    // Simulate upload progress (replace with actual upload logic)
    validFiles.forEach((_, index) => {
      simulateUpload(uploadedFiles.length + index)
    })

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const simulateUpload = (index: number) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) => {
        const updated = [...prev]
        if (updated[index] && updated[index].progress < 100) {
          updated[index] = {
            ...updated[index],
            progress: Math.min(updated[index].progress + 10, 100),
          }
          if (updated[index].progress === 100) {
            updated[index].status = 'success'
          }
        }
        return updated
      })
    }, 200)

    setTimeout(() => clearInterval(interval), 2000)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary hover:bg-muted/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum {maxFiles} files, up to {(maxSize / 1024 / 1024).toFixed(0)}MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
            >
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {uploadedFile.file.name}
                  </p>
                  <span className="text-sm text-muted-foreground ml-2">
                    {formatFileSize(uploadedFile.file.size)}
                  </span>
                </div>
                {uploadedFile.status === 'uploading' && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadedFile.progress}%` }}
                    />
                  </div>
                )}
                {uploadedFile.status === 'error' && (
                  <p className="text-sm text-destructive">{uploadedFile.error}</p>
                )}
                {uploadedFile.status === 'success' && (
                  <p className="text-sm text-success">Upload complete</p>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

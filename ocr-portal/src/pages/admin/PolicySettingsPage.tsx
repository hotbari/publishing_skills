import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, PageLayout } from '@/components/common'

/**
 * PolicySettingsPage - PR-101
 *
 * Manages OCR portal policy configurations:
 * - Upload Policies (extensions, max size, max count)
 * - Presigned URL TTL settings
 * - OCR Policies (languages, DPI, quality)
 * - Image Extraction (mode, render DPI)
 * - Retry Policies (max retries, timeout)
 *
 * Form sections match FR-101 requirements.
 */

// Validation Schema - Zod
const policySettingsSchema = z.object({
  // Upload Policies
  uploadAllowedExtensions: z.string().min(1, 'At least one extension is required'),
  uploadMaxSizeMb: z.coerce
    .number()
    .positive('Must be greater than 0')
    .max(5000, 'Max size cannot exceed 5000 MB'),
  uploadMaxCount: z.coerce
    .number()
    .int('Must be an integer')
    .positive('Must be greater than 0')
    .max(1000, 'Max count cannot exceed 1000'),

  // Presigned URL
  presignedUrlTtlSeconds: z.coerce
    .number()
    .int('Must be an integer')
    .min(60, 'TTL must be at least 60 seconds')
    .max(86400, 'TTL cannot exceed 24 hours (86400 seconds)'),

  // OCR Policies
  ocrLanguages: z.string().min(1, 'At least one language is required'),
  ocrDpi: z.coerce
    .number()
    .int('DPI must be an integer')
    .min(100, 'DPI must be at least 100')
    .max(600, 'DPI cannot exceed 600'),
  ocrQuality: z.coerce
    .number()
    .min(0.1, 'Quality must be at least 0.1')
    .max(1, 'Quality cannot exceed 1'),

  // Image Extraction
  imageExtractionMode: z.enum(['native', 'rendered'], {
    required_error: 'Extraction mode is required',
  }),
  imageRenderDpi: z.coerce
    .number()
    .int('DPI must be an integer')
    .min(72, 'Render DPI must be at least 72')
    .max(600, 'Render DPI cannot exceed 600'),

  // Retry Policies
  retryMaxAttempts: z.coerce
    .number()
    .int('Must be an integer')
    .min(1, 'Must have at least 1 attempt')
    .max(10, 'Max attempts cannot exceed 10'),
  retryTimeoutSeconds: z.coerce
    .number()
    .int('Must be an integer')
    .min(10, 'Timeout must be at least 10 seconds')
    .max(3600, 'Timeout cannot exceed 1 hour'),
})

type PolicySettingsFormData = z.infer<typeof policySettingsSchema>

// Default values matching common policy settings
const DEFAULT_VALUES: PolicySettingsFormData = {
  uploadAllowedExtensions: 'pdf, jpg, jpeg, png, tiff',
  uploadMaxSizeMb: 100,
  uploadMaxCount: 50,
  presignedUrlTtlSeconds: 3600,
  ocrLanguages: 'eng, deu, fra, spa',
  ocrDpi: 300,
  ocrQuality: 0.85,
  imageExtractionMode: 'rendered',
  imageRenderDpi: 150,
  retryMaxAttempts: 3,
  retryTimeoutSeconds: 300,
}

export function PolicySettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PolicySettingsFormData>({
    resolver: zodResolver(policySettingsSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (data: PolicySettingsFormData) => {
    try {
      // Simulate API call to save policies
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Policies saved:', data)
      // In real app: call API endpoint to persist settings
    } catch (error) {
      console.error('Failed to save policies:', error)
    }
  }

  const handleReset = () => {
    reset(DEFAULT_VALUES)
  }

  return (
    <PageLayout>
      <div className="max-w-4xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">Policy Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure OCR portal policies and system limits (FR-101)
          </p>
        </div>

        {/* Form Card */}
        <div className="border rounded-lg p-6 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Upload Policies */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                Upload Policies
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Allowed File Extensions{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('uploadAllowedExtensions')}
                    placeholder="e.g., pdf, jpg, png, tiff (comma-separated)"
                    error={errors.uploadAllowedExtensions?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated list of allowed file extensions
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max File Size (MB){' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('uploadMaxSizeMb')}
                      type="number"
                      placeholder="100"
                      error={errors.uploadMaxSizeMb?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max File Count{' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('uploadMaxCount')}
                      type="number"
                      placeholder="50"
                      error={errors.uploadMaxCount?.message}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Presigned URL */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                Presigned URL Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TTL (Time To Live) in Seconds{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('presignedUrlTtlSeconds')}
                    type="number"
                    placeholder="3600"
                    error={errors.presignedUrlTtlSeconds?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How long presigned URLs remain valid (60 - 86400 seconds)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: OCR Policies */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                OCR Policies
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supported Languages{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('ocrLanguages')}
                    placeholder="e.g., eng, deu, fra, spa (comma-separated ISO codes)"
                    error={errors.ocrLanguages?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ISO 639-1 language codes, comma-separated
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      OCR DPI <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('ocrDpi')}
                      type="number"
                      placeholder="300"
                      error={errors.ocrDpi?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      100-600 DPI for OCR processing
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      OCR Quality (0-1){' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('ocrQuality')}
                      type="number"
                      step="0.01"
                      placeholder="0.85"
                      error={errors.ocrQuality?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Quality threshold (0.1 - 1.0)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Image Extraction */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                Image Extraction Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Extraction Mode{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('imageExtractionMode')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                  >
                    <option value="">Select extraction mode</option>
                    <option value="native">Native</option>
                    <option value="rendered">Rendered</option>
                  </select>
                  {errors.imageExtractionMode && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.imageExtractionMode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Render DPI <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('imageRenderDpi')}
                    type="number"
                    placeholder="150"
                    error={errors.imageRenderDpi?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    DPI for rendered images (72-600)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Retry Policies */}
            <div className="pb-8">
              <h2 className="text-lg font-semibold mb-4">
                Retry Policies
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max Retry Attempts{' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('retryMaxAttempts')}
                      type="number"
                      placeholder="3"
                      error={errors.retryMaxAttempts?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum number of retry attempts (1-10)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Timeout (Seconds){' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('retryTimeoutSeconds')}
                      type="number"
                      placeholder="300"
                      error={errors.retryTimeoutSeconds?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Timeout per retry attempt (10-3600 seconds)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? 'Saving...' : 'Save Policies'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty}
              >
                Reset to Defaults
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 text-sm text-blue-900">
          <p className="font-medium">Policy Implementation Notes</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Changes apply to new jobs immediately</li>
            <li>In-progress jobs use previously configured policies</li>
            <li>All values are validated server-side</li>
            <li>Audit logs track all policy configuration changes</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default PolicySettingsPage

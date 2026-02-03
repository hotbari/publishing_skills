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
  uploadAllowedExtensions: z.string().min(1, '최소 하나의 확장자가 필요합니다'),
  uploadMaxSizeMb: z.coerce
    .number()
    .positive('0보다 커야 합니다')
    .max(5000, '최대 크기는 5000 MB를 초과할 수 없습니다'),
  uploadMaxCount: z.coerce
    .number()
    .int('정수여야 합니다')
    .positive('0보다 커야 합니다')
    .max(1000, '최대 개수는 1000을 초과할 수 없습니다'),

  // Presigned URL
  presignedUrlTtlSeconds: z.coerce
    .number()
    .int('정수여야 합니다')
    .min(60, 'TTL은 최소 60초 이상이어야 합니다')
    .max(86400, 'TTL은 24시간(86400초)을 초과할 수 없습니다'),

  // OCR Policies
  ocrLanguages: z.string().min(1, '최소 하나의 언어가 필요합니다'),
  ocrDpi: z.coerce
    .number()
    .int('DPI는 정수여야 합니다')
    .min(100, 'DPI는 최소 100 이상이어야 합니다')
    .max(600, 'DPI는 600을 초과할 수 없습니다'),
  ocrQuality: z.coerce
    .number()
    .min(0.1, '품질은 최소 0.1 이상이어야 합니다')
    .max(1, '품질은 1을 초과할 수 없습니다'),

  // Image Extraction
  imageExtractionMode: z.enum(['native', 'rendered'], {
    required_error: '추출 모드가 필요합니다',
  }),
  imageRenderDpi: z.coerce
    .number()
    .int('DPI는 정수여야 합니다')
    .min(72, '렌더링 DPI는 최소 72 이상이어야 합니다')
    .max(600, '렌더링 DPI는 600을 초과할 수 없습니다'),

  // Retry Policies
  retryMaxAttempts: z.coerce
    .number()
    .int('정수여야 합니다')
    .min(1, '최소 1회 이상 시도해야 합니다')
    .max(10, '최대 시도 횟수는 10을 초과할 수 없습니다'),
  retryTimeoutSeconds: z.coerce
    .number()
    .int('정수여야 합니다')
    .min(10, '타임아웃은 최소 10초 이상이어야 합니다')
    .max(3600, '타임아웃은 1시간을 초과할 수 없습니다'),
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
          <h1 className="text-3xl font-semibold">정책 설정</h1>
          <p className="text-muted-foreground mt-2">
            OCR 포털 정책 및 시스템 제한 구성 (FR-101)
          </p>
        </div>

        {/* Form Card */}
        <div className="border rounded-lg p-6 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Upload Policies */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                업로드 정책
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    허용된 파일 확장자{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('uploadAllowedExtensions')}
                    placeholder="예: pdf, jpg, png, tiff (쉼표로 구분)"
                    error={errors.uploadAllowedExtensions?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    허용된 파일 확장자를 쉼표로 구분하여 입력
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      최대 파일 크기 (MB){' '}
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
                      최대 파일 개수{' '}
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
                Presigned URL 설정
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TTL (유효 시간) 초 단위{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('presignedUrlTtlSeconds')}
                    type="number"
                    placeholder="3600"
                    error={errors.presignedUrlTtlSeconds?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Presigned URL이 유효한 시간 (60 - 86400초)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: OCR Policies */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                OCR 정책
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    지원 언어{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('ocrLanguages')}
                    placeholder="예: eng, deu, fra, spa (쉼표로 구분된 ISO 코드)"
                    error={errors.ocrLanguages?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ISO 639-1 언어 코드, 쉼표로 구분
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
                      OCR 처리를 위한 100-600 DPI
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      OCR 품질 (0-1){' '}
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
                      품질 임계값 (0.1 - 1.0)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Image Extraction */}
            <div className="border-b pb-8">
              <h2 className="text-lg font-semibold mb-4">
                이미지 추출 설정
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    추출 모드{' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('imageExtractionMode')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm"
                  >
                    <option value="">추출 모드 선택</option>
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
                    렌더링 DPI <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('imageRenderDpi')}
                    type="number"
                    placeholder="150"
                    error={errors.imageRenderDpi?.message}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    렌더링된 이미지를 위한 DPI (72-600)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Retry Policies */}
            <div className="pb-8">
              <h2 className="text-lg font-semibold mb-4">
                재시도 정책
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      최대 재시도 횟수{' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('retryMaxAttempts')}
                      type="number"
                      placeholder="3"
                      error={errors.retryMaxAttempts?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      최대 재시도 횟수 (1-10)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      타임아웃 (초){' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('retryTimeoutSeconds')}
                      type="number"
                      placeholder="300"
                      error={errors.retryTimeoutSeconds?.message}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      재시도당 타임아웃 (10-3600초)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? '저장 중...' : '정책 저장'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty}
              >
                기본값으로 초기화
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 text-sm text-blue-900">
          <p className="font-medium">정책 구현 참고사항</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>변경사항은 새로운 작업에 즉시 적용됩니다</li>
            <li>진행 중인 작업은 이전에 구성된 정책을 사용합니다</li>
            <li>모든 값은 서버 측에서 검증됩니다</li>
            <li>감사 로그는 모든 정책 구성 변경사항을 추적합니다</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default PolicySettingsPage

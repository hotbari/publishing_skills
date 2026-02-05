import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { PageLayout, Button, Input, Select, Card } from '@/components/common'
import type { TripFormData, TransportMode } from '@/types'

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  countryId: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  preferredTransport: z.enum(['walking', 'driving', 'transit', 'cycling']),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
})

const countryOptions = [
  { value: '', label: 'Select a country' },
  { value: 'kr', label: 'South Korea' },
  { value: 'jp', label: 'Japan' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
]

const transportOptions = [
  { value: 'walking', label: 'Walking' },
  { value: 'driving', label: 'Driving' },
  { value: 'transit', label: 'Public Transit' },
  { value: 'cycling', label: 'Cycling' },
]

export function TripFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: '',
      countryId: '',
      startDate: '',
      endDate: '',
      preferredTransport: 'walking',
    },
  })

  const onSubmit = async (data: TripFormData) => {
    try {
      // TODO: API call to create trip
      console.log('Creating trip:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate('/trips')
    } catch (error) {
      console.error('Error creating trip:', error)
    }
  }

  return (
    <PageLayout maxWidth="md">
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/trips')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">{t('trip.createNew')}</h1>
          <p className="text-muted-foreground mt-2">
            Plan your next adventure by creating a new trip
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label={t('trip.name')}
                placeholder="Enter trip name"
                {...register('name')}
                error={errors.name?.message}
                required
              />

              <Select
                label={t('trip.country')}
                options={countryOptions}
                {...register('countryId')}
                error={errors.countryId?.message}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('trip.startDate')}
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                  required
                />

                <Input
                  label={t('trip.endDate')}
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                  required
                />
              </div>

              <Select
                label={t('trip.transport')}
                options={transportOptions}
                {...register('preferredTransport')}
                error={errors.preferredTransport?.message}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/trips')}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  )
}

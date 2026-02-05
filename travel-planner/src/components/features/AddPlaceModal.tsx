import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Input, Select, Textarea } from '@/components/common'
import { useUIStore } from '@/store/uiStore'
import { useTripStore } from '@/store/tripStore'
import type { PlaceFormData, PlaceCategory } from '@/types'

const placeSchema = z.object({
  name: z.string().min(1, 'Place name is required'),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  category: z.enum([
    'restaurant',
    'museum',
    'attraction',
    'shopping',
    'nature',
    'accommodation',
    'transport',
    'other',
  ]),
  businessHours: z
    .object({
      open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    })
    .optional(),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  estimatedCost: z.number().optional(),
  saveAsTemplate: z.boolean().optional(),
  templateName: z.string().optional(),
})

const categoryOptions = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'museum', label: 'Museum' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'nature', label: 'Nature' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
]

export function AddPlaceModal() {
  const { t } = useTranslation()
  const isOpen = useUIStore((state) => state.addPlaceModalOpen)
  const setAddPlaceModalOpen = useUIStore((state) => state.setAddPlaceModalOpen)
  const addPlace = useTripStore((state) => state.addPlace)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: 37.5665,
      longitude: 126.978,
      category: 'attraction',
      estimatedDuration: 60,
      saveAsTemplate: false,
    },
  })

  const showBusinessHours = ['restaurant', 'museum', 'attraction', 'shopping'].includes(
    watch('category')
  )
  const saveAsTemplate = watch('saveAsTemplate')

  const onSubmit = async (data: PlaceFormData) => {
    try {
      // TODO: API call to create place
      const newPlace = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        tags: [],
        isTemplate: data.saveAsTemplate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addPlace(newPlace)
      setAddPlaceModalOpen(false)
      reset()
    } catch (error) {
      console.error('Error creating place:', error)
    }
  }

  const handleClose = () => {
    setAddPlaceModalOpen(false)
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('place.addPlace')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label={t('place.placeName')}
            placeholder="Enter place name"
            {...register('name')}
            error={errors.name?.message}
            required
          />

          <Textarea
            label={t('place.description')}
            placeholder="Optional description"
            {...register('description')}
            error={errors.description?.message}
          />

          <Select
            label={t('place.category')}
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
            required
          />
        </div>

        {/* Location */}
        <div>
          <h3 className="text-sm font-medium mb-4">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="0.000001"
              {...register('latitude', { valueAsNumber: true })}
              error={errors.latitude?.message}
              required
            />

            <Input
              label="Longitude"
              type="number"
              step="0.000001"
              {...register('longitude', { valueAsNumber: true })}
              error={errors.longitude?.message}
              required
            />
          </div>
        </div>

        {/* Business Hours */}
        {showBusinessHours && (
          <div>
            <h3 className="text-sm font-medium mb-4">{t('place.businessHours')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('place.open')}
                type="time"
                {...register('businessHours.open')}
                error={errors.businessHours?.open?.message}
              />

              <Input
                label={t('place.close')}
                type="time"
                {...register('businessHours.close')}
                error={errors.businessHours?.close?.message}
              />
            </div>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={`${t('place.duration')} (minutes)`}
            type="number"
            {...register('estimatedDuration', { valueAsNumber: true })}
            error={errors.estimatedDuration?.message}
            required
          />

          <Input
            label={t('place.cost')}
            type="number"
            step="0.01"
            {...register('estimatedCost', { valueAsNumber: true })}
            error={errors.estimatedCost?.message}
          />
        </div>

        {/* Template */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="saveAsTemplate"
            {...register('saveAsTemplate')}
            className="rounded border-input"
          />
          <label htmlFor="saveAsTemplate" className="text-sm">
            {t('place.saveAsTemplate')}
          </label>
        </div>

        {saveAsTemplate && (
          <Input
            label="Template Name"
            placeholder="e.g., Lunch Break, Museum Visit"
            {...register('templateName')}
            error={errors.templateName?.message}
          />
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('common.add')}
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

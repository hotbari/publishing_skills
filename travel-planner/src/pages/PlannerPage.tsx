import { useState, useEffect } from 'react'
import { Plus, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTripStore } from '@/store/tripStore'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/common'
import { TravelMap } from '@/components/features/TravelMap'
import { ItineraryTimeline } from '@/components/features/ItineraryTimeline'
import { formatDate } from '@/lib/utils'

export function PlannerPage() {
  const { t } = useTranslation()
  const currentTrip = useTripStore((state) => state.currentTrip)
  const currentDay = useUIStore((state) => state.currentDay)
  const setCurrentDay = useUIStore((state) => state.setCurrentDay)
  const setAddPlaceModalOpen = useUIStore((state) => state.setAddPlaceModalOpen)
  const setAiPreviewOpen = useUIStore((state) => state.setAiPreviewOpen)

  const [totalDays, setTotalDays] = useState(1)

  useEffect(() => {
    if (currentTrip) {
      const start = new Date(currentTrip.startDate)
      const end = new Date(currentTrip.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      setTotalDays(days)
    }
  }, [currentTrip])

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1)
    }
  }

  const handleNextDay = () => {
    if (currentDay < totalDays) {
      setCurrentDay(currentDay + 1)
    }
  }

  const getCurrentDayDate = () => {
    if (!currentTrip) return ''
    const start = new Date(currentTrip.startDate)
    const current = new Date(start)
    current.setDate(start.getDate() + currentDay - 1)
    return formatDate(current)
  }

  const handleMapClick = (lat: number, lng: number) => {
    // Open place modal with coordinates pre-filled
    console.log('Map clicked:', lat, lng)
    setAddPlaceModalOpen(true)
  }

  if (!currentTrip) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t('trip.title')}</h2>
          <p className="text-muted-foreground mb-6">{t('trip.subtitle')}</p>
          <Button onClick={() => window.location.href = '/trips'}>
            {t('trip.createNew')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{currentTrip.name}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setAddPlaceModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('place.addPlace')}
            </Button>
            <Button onClick={() => setAiPreviewOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              {t('ai.optimize')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Timeline */}
        <div className="w-1/2 border-r border-border overflow-hidden flex flex-col">
          {/* Day Tabs */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {t('itinerary.day', { number: currentDay })}
              </h2>
              <span className="text-sm text-muted-foreground">{getCurrentDayDate()}</span>
            </div>

            {/* Day Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousDay}
                disabled={currentDay === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 flex gap-2 overflow-x-auto">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setCurrentDay(day)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      currentDay === day
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextDay}
                disabled={currentDay === totalDays}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <ItineraryTimeline dayNumber={currentDay} />
          </div>
        </div>

        {/* Right: Map */}
        <div className="w-1/2 p-6 bg-deep-night-400">
          <TravelMap onMapClick={handleMapClick} />
        </div>
      </div>
    </div>
  )
}

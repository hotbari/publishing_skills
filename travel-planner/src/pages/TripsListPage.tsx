import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Calendar, MapPin, Trash2, Eye } from 'lucide-react'
import { PageLayout, PageHeader, Button, Input } from '@/components/common'
import { formatDate } from '@/lib/utils'
import type { Trip } from '@/types'

// Mock data - will be replaced with API call
const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Tokyo Adventure',
    countryId: 'jp',
    startDate: '2026-03-15',
    endDate: '2026-03-22',
    preferredTransport: 'transit',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Paris Romance',
    countryId: 'fr',
    startDate: '2026-06-10',
    endDate: '2026-06-17',
    preferredTransport: 'walking',
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-02T10:00:00Z',
  },
]

export function TripsListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [trips] = useState<Trip[]>(mockTrips)

  const filteredTrips = trips.filter((trip) =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewTrip = (tripId: string) => {
    navigate(`/planner/${tripId}`)
  }

  const handleDeleteTrip = (tripId: string) => {
    // TODO: Implement delete
    console.log('Delete trip:', tripId)
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={t('nav.trips')}
          description="Manage your travel plans"
          action={
            <Button onClick={() => navigate('/trips/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('trip.createNew')}
            </Button>
          }
        />

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder={`${t('common.search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="border rounded-lg p-6 bg-card hover:border-primary transition-colors cursor-pointer group"
              onClick={() => handleViewTrip(trip.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{trip.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{trip.countryId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{calculateDays(trip.startDate, trip.endDate)} days</span>
                  <span>•</span>
                  <span className="capitalize">{trip.preferredTransport}</span>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewTrip(trip.id)
                  }}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTrip(trip.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first trip to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/trips/new')}>
                <Plus className="h-4 w-4 mr-2" />
                {t('trip.createNew')}
              </Button>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

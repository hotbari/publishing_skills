import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useUIStore } from '@/store/uiStore'
import { useTripStore } from '@/store/tripStore'
import type { Place } from '@/types'

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface TravelMapProps {
  onMapClick?: (lat: number, lng: number) => void
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export function TravelMap({ onMapClick }: TravelMapProps) {
  const mapState = useUIStore((state) => state.mapState)
  const setMapCenter = useUIStore((state) => state.setMapCenter)
  const setMapZoom = useUIStore((state) => state.setMapZoom)
  const setSelectedPlaceId = useUIStore((state) => state.setSelectedPlaceId)

  const places = useTripStore((state) => state.places)
  const itineraryItems = useTripStore((state) => state.itineraryItems)

  const mapRef = useRef<L.Map | null>(null)

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapState.center, mapState.zoom)
    }
  }, [mapState.center, mapState.zoom])

  // Get place by ID
  const getPlace = (placeId: string): Place | undefined => {
    return places.find((p) => p.id === placeId)
  }

  // Create custom icon for selected place
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="${
          isSelected
            ? 'w-8 h-8 bg-primary border-2 border-frost-white rounded-full'
            : 'w-6 h-6 bg-accent border border-border rounded-full'
        } flex items-center justify-center shadow-frost">
          <div class="w-3 h-3 bg-frost-white rounded-full"></div>
        </div>
      `,
      iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
      iconAnchor: [isSelected ? 16 : 12, isSelected ? 32 : 24],
    })
  }

  // Get route polylines from itinerary
  const getRoutePolylines = () => {
    const polylines: Array<{ positions: L.LatLngExpression[]; color: string }> = []

    if (mapState.routeSegments && mapState.routeSegments.length > 0) {
      mapState.routeSegments.forEach((segment) => {
        const positions = segment.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngExpression
        )
        polylines.push({
          positions,
          color: '#60A5FA', // Primary color
        })
      })
    }

    return polylines
  }

  const polylines = getRoutePolylines()

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        className="h-full w-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={onMapClick} />

        {/* Place Markers */}
        {places.map((place) => {
          const isSelected = mapState.selectedPlaceId === place.id
          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => setSelectedPlaceId(place.id),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{place.name}</h3>
                  {place.description && (
                    <p className="text-xs text-muted-foreground mt-1">{place.description}</p>
                  )}
                  <p className="text-xs mt-1">
                    Category: <span className="capitalize">{place.category}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Route Polylines */}
        {polylines.map((polyline, index) => (
          <Polyline
            key={index}
            positions={polyline.positions}
            pathOptions={{
              color: polyline.color,
              weight: 4,
              opacity: 0.7,
            }}
          />
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-frost z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full border border-frost-white" />
            <span>Selected Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full border border-border" />
            <span>Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  )
}

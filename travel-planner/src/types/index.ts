// Core Domain Types for Travel Planner

export interface Country {
  id: string
  code: string
  name: {
    en: string
    ko: string
  }
  greeting: {
    en: string
    ko: string
  }
}

export type TransportMode = 'walking' | 'driving' | 'transit' | 'cycling'

export interface Trip {
  id: string
  name: string
  countryId: string
  startDate: string // ISO date
  endDate: string // ISO date
  preferredTransport: TransportMode
  accommodationId?: string
  createdAt: string
  updatedAt: string
}

export interface Place {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  category: PlaceCategory
  businessHours?: {
    open: string // HH:MM
    close: string // HH:MM
  }
  estimatedDuration: number // minutes
  estimatedCost?: number
  tags?: string[]
  isTemplate?: boolean
  templateName?: string
  createdAt: string
  updatedAt: string
}

export type PlaceCategory =
  | 'restaurant'
  | 'museum'
  | 'attraction'
  | 'shopping'
  | 'nature'
  | 'accommodation'
  | 'transport'
  | 'other'

export interface Accommodation {
  id: string
  tripId: string
  name: string
  latitude: number
  longitude: number
  checkIn: string // ISO datetime
  checkOut: string // ISO datetime
  createdAt: string
  updatedAt: string
}

export interface ItineraryItem {
  id: string
  tripId: string
  dayNumber: number // 1-indexed
  order: number // Position in day
  placeId?: string
  accommodationId?: string
  startTime: string // ISO datetime
  endTime: string // ISO datetime
  travelMode: TransportMode
  travelDuration?: number // minutes
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface RouteSegment {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
  mode: TransportMode
  duration: number // minutes
  distance: number // meters
  coordinates: Array<[number, number]> // For polyline
}

// AI Optimization Types

export interface OptimizationRequest {
  tripId: string
  mode: 'optimize-only' | 'suggest-and-optimize'
  constraints?: {
    preserveOrder?: string[] // Place IDs to keep in order
    mustVisit?: string[] // Place IDs that must be included
  }
}

export interface OptimizationSuggestion {
  type: 'reorder' | 'add' | 'remove' | 'modify'
  itemId?: string
  placeId?: string
  newPlace?: Partial<Place>
  newOrder?: number
  newDay?: number
  newStartTime?: string
  reasoning: string
}

export interface OptimizationResult {
  suggestions: OptimizationSuggestion[]
  reasoning: string
  estimatedTimeSaved?: number // minutes
  estimatedDistanceSaved?: number // meters
}

// UI State Types

export interface DragState {
  isDragging: boolean
  draggedItemId?: string
  draggedOverDay?: number
}

export interface MapState {
  center: [number, number]
  zoom: number
  selectedPlaceId?: string
  hoveredPlaceId?: string
  routeSegments: RouteSegment[]
}

export interface UIState {
  currentDay: number
  sidebarOpen: boolean
  aiPreviewOpen: boolean
  addPlaceModalOpen: boolean
  selectedItemId?: string
}

// Form Types

export interface TripFormData {
  name: string
  countryId: string
  startDate: string
  endDate: string
  preferredTransport: TransportMode
}

export interface PlaceFormData {
  name: string
  description?: string
  latitude: number
  longitude: number
  category: PlaceCategory
  businessHours?: {
    open: string
    close: string
  }
  estimatedDuration: number
  estimatedCost?: number
  saveAsTemplate?: boolean
  templateName?: string
}

export interface AccommodationFormData {
  name: string
  latitude: number
  longitude: number
  checkIn: string
  checkOut: string
}

// API Response Types

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

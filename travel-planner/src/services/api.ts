import type {
  Trip,
  Place,
  Accommodation,
  ItineraryItem,
  OptimizationRequest,
  OptimizationResult,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  // Trips
  async getTrips(): Promise<Trip[]> {
    const response = await this.request<Trip[]>('/trips')
    return response.data
  }

  async getTrip(id: string): Promise<Trip> {
    const response = await this.request<Trip>(`/trips/${id}`)
    return response.data
  }

  async createTrip(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    const response = await this.request<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
    const response = await this.request<Trip>(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteTrip(id: string): Promise<void> {
    await this.request(`/trips/${id}`, {
      method: 'DELETE',
    })
  }

  // Places
  async getPlaces(tripId?: string): Promise<Place[]> {
    const query = tripId ? `?tripId=${tripId}` : ''
    const response = await this.request<Place[]>(`/places${query}`)
    return response.data
  }

  async createPlace(data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<Place> {
    const response = await this.request<Place>('/places', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updatePlace(id: string, data: Partial<Place>): Promise<Place> {
    const response = await this.request<Place>(`/places/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deletePlace(id: string): Promise<void> {
    await this.request(`/places/${id}`, {
      method: 'DELETE',
    })
  }

  // Itinerary Items
  async getItineraryItems(tripId: string): Promise<ItineraryItem[]> {
    const response = await this.request<ItineraryItem[]>(`/trips/${tripId}/itinerary`)
    return response.data
  }

  async createItineraryItem(
    tripId: string,
    data: Omit<ItineraryItem, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>
  ): Promise<ItineraryItem> {
    const response = await this.request<ItineraryItem>(`/trips/${tripId}/itinerary`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updateItineraryItem(id: string, data: Partial<ItineraryItem>): Promise<ItineraryItem> {
    const response = await this.request<ItineraryItem>(`/itinerary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteItineraryItem(id: string): Promise<void> {
    await this.request(`/itinerary/${id}`, {
      method: 'DELETE',
    })
  }

  // Accommodations
  async getAccommodations(tripId: string): Promise<Accommodation[]> {
    const response = await this.request<Accommodation[]>(`/trips/${tripId}/accommodations`)
    return response.data
  }

  async createAccommodation(
    tripId: string,
    data: Omit<Accommodation, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>
  ): Promise<Accommodation> {
    const response = await this.request<Accommodation>(`/trips/${tripId}/accommodations`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  // AI Optimization
  async optimizeItinerary(request: OptimizationRequest): Promise<OptimizationResult> {
    const response = await this.request<OptimizationResult>('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    return response.data
  }

  // OSRM Routing
  async getRoute(
    coordinates: Array<[number, number]>,
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<any> {
    const coords = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';')
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${mode}/${coords}?overview=full&geometries=geojson`
    )
    return response.json()
  }
}

export const apiClient = new ApiClient()

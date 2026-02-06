import { create } from 'zustand'
import type { Trip, Place, Accommodation, ItineraryItem } from '@/types'

interface TripState {
  // Current trip
  currentTrip: Trip | null
  places: Place[]
  accommodations: Accommodation[]
  itineraryItems: ItineraryItem[]

  // Actions
  setCurrentTrip: (trip: Trip | null) => void
  setPlaces: (places: Place[]) => void
  addPlace: (place: Place) => void
  updatePlace: (id: string, updates: Partial<Place>) => void
  removePlace: (id: string) => void
  setAccommodations: (accommodations: Accommodation[]) => void
  setItineraryItems: (items: ItineraryItem[]) => void
  addItineraryItem: (item: ItineraryItem) => void
  updateItineraryItem: (id: string, updates: Partial<ItineraryItem>) => void
  removeItineraryItem: (id: string) => void
  reorderItineraryItems: (items: ItineraryItem[]) => void
}

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  places: [],
  accommodations: [],
  itineraryItems: [],

  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  setPlaces: (places) => set({ places }),

  addPlace: (place) =>
    set((state) => ({
      places: [...state.places, place],
    })),

  updatePlace: (id, updates) =>
    set((state) => ({
      places: state.places.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  removePlace: (id) =>
    set((state) => ({
      places: state.places.filter((p) => p.id !== id),
    })),

  setAccommodations: (accommodations) => set({ accommodations }),

  setItineraryItems: (items) => set({ itineraryItems: items }),

  addItineraryItem: (item) =>
    set((state) => ({
      itineraryItems: [...state.itineraryItems, item],
    })),

  updateItineraryItem: (id, updates) =>
    set((state) => ({
      itineraryItems: state.itineraryItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItineraryItem: (id) =>
    set((state) => ({
      itineraryItems: state.itineraryItems.filter((item) => item.id !== id),
    })),

  reorderItineraryItems: (items) => set({ itineraryItems: items }),
}))

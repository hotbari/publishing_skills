import { create } from 'zustand'
import type { UIState, MapState, OptimizationResult } from '@/types'

interface UIStoreState extends UIState {
  // Map state
  mapState: MapState

  // AI Optimization
  optimizationResult: OptimizationResult | null
  isOptimizing: boolean

  // Actions
  setCurrentDay: (day: number) => void
  setSidebarOpen: (open: boolean) => void
  setAiPreviewOpen: (open: boolean) => void
  setAddPlaceModalOpen: (open: boolean) => void
  setSelectedItemId: (id: string | undefined) => void

  // Map actions
  setMapCenter: (center: [number, number]) => void
  setMapZoom: (zoom: number) => void
  setSelectedPlaceId: (id: string | undefined) => void
  setHoveredPlaceId: (id: string | undefined) => void
  setRouteSegments: (segments: any[]) => void

  // AI actions
  setOptimizationResult: (result: OptimizationResult | null) => void
  setIsOptimizing: (optimizing: boolean) => void
}

export const useUIStore = create<UIStoreState>((set) => ({
  // UI State
  currentDay: 1,
  sidebarOpen: true,
  aiPreviewOpen: false,
  addPlaceModalOpen: false,
  selectedItemId: undefined,

  // Map State
  mapState: {
    center: [37.5665, 126.978], // Seoul default
    zoom: 13,
    selectedPlaceId: undefined,
    hoveredPlaceId: undefined,
    routeSegments: [],
  },

  // AI State
  optimizationResult: null,
  isOptimizing: false,

  // UI Actions
  setCurrentDay: (day) => set({ currentDay: day }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAiPreviewOpen: (open) => set({ aiPreviewOpen: open }),
  setAddPlaceModalOpen: (open) => set({ addPlaceModalOpen: open }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  // Map Actions
  setMapCenter: (center) =>
    set((state) => ({
      mapState: { ...state.mapState, center },
    })),

  setMapZoom: (zoom) =>
    set((state) => ({
      mapState: { ...state.mapState, zoom },
    })),

  setSelectedPlaceId: (id) =>
    set((state) => ({
      mapState: { ...state.mapState, selectedPlaceId: id },
    })),

  setHoveredPlaceId: (id) =>
    set((state) => ({
      mapState: { ...state.mapState, hoveredPlaceId: id },
    })),

  setRouteSegments: (segments) =>
    set((state) => ({
      mapState: { ...state.mapState, routeSegments: segments },
    })),

  // AI Actions
  setOptimizationResult: (result) => set({ optimizationResult: result }),
  setIsOptimizing: (optimizing) => set({ isOptimizing: optimizing }),
}))

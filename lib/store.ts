'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppStore, Room } from './types'
import { DEFAULT_MATERIAL_RATES, DEFAULT_SETTINGS } from './constants'

function generateRoomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const DEFAULT_ROOMS: Room[] = [
  { id: '1', name: 'Living Room', length: 20, width: 15, height: 10 },
  { id: '2', name: 'Bedroom 1', length: 12, width: 12, height: 10 },
  { id: '3', name: 'Bedroom 2', length: 12, width: 10, height: 10 },
  { id: '4', name: 'Kitchen', length: 10, width: 8, height: 10 },
  { id: '5', name: 'Bathroom', length: 6, width: 5, height: 9 },
]

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      materialRates: { ...DEFAULT_MATERIAL_RATES },
      setMaterialRate: (material, rate) =>
        set(state => ({ materialRates: { ...state.materialRates, [material]: rate } })),
      resetMaterialRates: () => set({ materialRates: { ...DEFAULT_MATERIAL_RATES } }),

      settings: { ...DEFAULT_SETTINGS },
      updateSettings: (updates) =>
        set(state => ({ settings: { ...state.settings, ...updates } })),

      currentResult: null,
      results: [],
      setCurrentResult: (result) =>
        set(state => ({
          currentResult: result,
          results: [result, ...state.results.filter(r => r.id !== result.id)].slice(0, 20),
        })),
      clearCurrentResult: () => set({ currentResult: null }),

      rooms: [...DEFAULT_ROOMS],
      addRoom: (partial = {}) =>
        set(state => ({
          rooms: [
            ...state.rooms,
            {
              id: generateRoomId(),
              name: partial.name ?? `Room ${state.rooms.length + 1}`,
              length: partial.length ?? 10,
              width: partial.width ?? 10,
              height: partial.height ?? 10,
            },
          ],
        })),
      updateRoom: (id, updates) =>
        set(state => ({ rooms: state.rooms.map(r => r.id === id ? { ...r, ...updates } : r) })),
      deleteRoom: (id) =>
        set(state => ({ rooms: state.rooms.filter(r => r.id !== id) })),
      resetRooms: () => set({ rooms: [...DEFAULT_ROOMS] }),

      currency: '₹',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'construction-estimator-store',
      partialize: (state) => ({
        materialRates: state.materialRates,
        settings: state.settings,
        results: state.results,
        currency: state.currency,
      }),
    }
  )
)

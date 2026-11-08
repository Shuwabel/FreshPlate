'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IngredientGroup, MealPlan, MealSlot } from './types'

export interface ListSource {
  slug: string
  name: string
  baseServings: number
  servings: number
  ingredients: IngredientGroup[]
}

export interface CustomItem {
  id: string
  name: string
  amount: string
}

interface FreshPlateState {
  favourites: string[]
  recent: string[]
  plans: MealPlan[]
  activePlanId: string | null
  listSources: ListSource[]
  customItems: CustomItem[]
  /** Ingredient key -> ticked. Keys come from the shopping list builder. */
  ticked: Record<string, boolean>

  toggleFavourite: (slug: string) => void
  pushRecent: (slug: string) => void

  savePlan: (plan: MealPlan) => void
  removePlan: (id: string) => void
  setActivePlan: (id: string) => void
  setMeal: (planId: string, dayIndex: number, slot: MealSlot, slug: string | null) => void

  addToList: (source: ListSource) => void
  removeFromList: (slug: string) => void
  addCustomItem: (name: string, amount: string) => void
  removeCustomItem: (id: string) => void
  toggleTick: (key: string) => void
  clearTicked: () => void
  clearList: () => void
}

const uid = () => (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`)

export const useFreshPlate = create<FreshPlateState>()(
  persist(
    (set) => ({
      favourites: [],
      recent: [],
      plans: [],
      activePlanId: null,
      listSources: [],
      customItems: [],
      ticked: {},

      toggleFavourite: (slug) =>
        set((s) => ({
          favourites: s.favourites.includes(slug) ? s.favourites.filter((x) => x !== slug) : [slug, ...s.favourites],
        })),
      pushRecent: (slug) => set((s) => ({ recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 12) })),

      savePlan: (plan) =>
        set((s) => ({
          plans: [plan, ...s.plans.filter((p) => p.id !== plan.id)],
          activePlanId: plan.id,
        })),
      removePlan: (id) =>
        set((s) => {
          const plans = s.plans.filter((p) => p.id !== id)
          return { plans, activePlanId: s.activePlanId === id ? (plans[0]?.id ?? null) : s.activePlanId }
        }),
      setActivePlan: (id) => set({ activePlanId: id }),
      setMeal: (planId, dayIndex, slot, slug) =>
        set((s) => ({
          plans: s.plans.map((p) =>
            p.id !== planId
              ? p
              : { ...p, days: p.days.map((d, i) => (i === dayIndex ? { ...d, [slot]: slug } : d)) },
          ),
        })),

      addToList: (source) =>
        set((s) => ({ listSources: [source, ...s.listSources.filter((x) => x.slug !== source.slug)] })),
      removeFromList: (slug) => set((s) => ({ listSources: s.listSources.filter((x) => x.slug !== slug) })),
      addCustomItem: (name, amount) => set((s) => ({ customItems: [...s.customItems, { id: uid(), name, amount }] })),
      removeCustomItem: (id) => set((s) => ({ customItems: s.customItems.filter((x) => x.id !== id) })),
      toggleTick: (key) => set((s) => ({ ticked: { ...s.ticked, [key]: !s.ticked[key] } })),
      clearTicked: () => set({ ticked: {} }),
      clearList: () => set({ listSources: [], customItems: [], ticked: {} }),
    }),
    { name: 'freshplate:v2', version: 2 },
  ),
)

export function newPlanId(): string {
  return uid()
}

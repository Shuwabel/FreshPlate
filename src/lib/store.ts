// Zustand store for app state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecipeCard, MealPlan, UserPreferences } from '@/types/recipe';

interface RecipeStore {
  // User preferences
  favorites: RecipeCard[];
  routine: RecipeCard[];
  dietPreference: 'vegan' | 'vegetarian' | 'all';
  theme: 'light' | 'dark' | 'system';

  // Search/browse state
  searchResults: RecipeCard[];
  isSearching: boolean;
  selectedCategory: string | null;
  selectedCuisine: string | null;

  // Meal plans
  mealPlans: MealPlan[];
  activeMealPlanId: string | null;

  // Recent recipes
  recentlyViewed: RecipeCard[];

  // Actions - Favorites
  addFavorite: (recipe: RecipeCard) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;

  // Actions - Routine
  addToRoutine: (recipe: RecipeCard) => void;
  removeFromRoutine: (recipeId: string) => void;
  isInRoutine: (recipeId: string) => boolean;

  // Actions - Search
  setSearchResults: (results: RecipeCard[]) => void;
  setIsSearching: (searching: boolean) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedCuisine: (cuisine: string | null) => void;
  clearSearch: () => void;

  // Actions - Meal Plans
  addMealPlan: (plan: MealPlan) => void;
  removeMealPlan: (planId: string) => void;
  setActiveMealPlan: (planId: string) => void;
  updateMealPlan: (plan: MealPlan) => void;

  // Actions - Recently Viewed
  addRecentlyViewed: (recipe: RecipeCard) => void;
  clearRecentlyViewed: () => void;

  // Actions - Preferences
  setDietPreference: (diet: 'vegan' | 'vegetarian' | 'all') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      routine: [],
      dietPreference: 'all',
      theme: 'system',
      searchResults: [],
      isSearching: false,
      selectedCategory: null,
      selectedCuisine: null,
      mealPlans: [],
      activeMealPlanId: null,
      recentlyViewed: [],

      // Favorites
      addFavorite: (recipe) =>
        set((state) => {
          if (state.favorites.some((f) => f.id === recipe.id)) {
            return state;
          }
          return { favorites: [...state.favorites, recipe] };
        }),

      removeFavorite: (recipeId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== recipeId),
        })),

      isFavorite: (recipeId) => get().favorites.some((f) => f.id === recipeId),

      // Routine
      addToRoutine: (recipe) =>
        set((state) => {
          if (state.routine.some((r) => r.id === recipe.id)) {
            return state;
          }
          return { routine: [...state.routine, recipe] };
        }),

      removeFromRoutine: (recipeId) =>
        set((state) => ({
          routine: state.routine.filter((r) => r.id !== recipeId),
        })),

      isInRoutine: (recipeId) => get().routine.some((r) => r.id === recipeId),

      // Search
      setSearchResults: (results) => set({ searchResults: results }),
      setIsSearching: (searching) => set({ isSearching: searching }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedCuisine: (cuisine) => set({ selectedCuisine: cuisine }),
      clearSearch: () =>
        set({
          searchResults: [],
          isSearching: false,
          selectedCategory: null,
          selectedCuisine: null,
        }),

      // Meal Plans
      addMealPlan: (plan) =>
        set((state) => ({
          mealPlans: [...state.mealPlans, plan],
        })),

      removeMealPlan: (planId) =>
        set((state) => ({
          mealPlans: state.mealPlans.filter((p) => p.id !== planId),
          activeMealPlanId:
            state.activeMealPlanId === planId ? null : state.activeMealPlanId,
        })),

      setActiveMealPlan: (planId) => set({ activeMealPlanId: planId }),

      updateMealPlan: (plan) =>
        set((state) => ({
          mealPlans: state.mealPlans.map((p) => (p.id === plan.id ? plan : p)),
        })),

      // Recently Viewed
      addRecentlyViewed: (recipe) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((r) => r.id !== recipe.id);
          return {
            recentlyViewed: [recipe, ...filtered].slice(0, 10), // Keep last 10
          };
        }),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // Preferences
      setDietPreference: (diet) => set({ dietPreference: diet }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'freshplate-store',
      version: 1,
    }
  )
);

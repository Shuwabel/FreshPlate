'use client';

import { useState, useCallback } from 'react';
import { mealdbClient } from '@/lib/api/mealdb';
import { normalizeToRecipeDetails } from '@/lib/api/recipeAdapter';
import type { RecipeDetails } from '@/types/recipe';
import { useRecipeStore } from '@/lib/store';

export function useMealDetails() {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addRecentlyViewed = useRecipeStore((state) => state.addRecentlyViewed);

  const fetchRecipe = useCallback(async (mealId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Remove prefix if present (mdb-{id})
      const id = mealId.startsWith('mdb-') ? mealId.slice(4) : mealId;

      const meal = await mealdbClient.getMealById(id);
      if (!meal) {
        setError('Meal not found');
        return null;
      }

      const details = normalizeToRecipeDetails(meal);
      setRecipe(details);
      addRecentlyViewed(details); // Track as viewed

      return details;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recipe';
      setError(errorMessage);
      console.error('[useMealDetails] error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addRecentlyViewed]);

  const reset = useCallback(() => {
    setRecipe(null);
    setError(null);
  }, []);

  return {
    recipe,
    isLoading,
    error,
    fetchRecipe,
    reset,
  };
}

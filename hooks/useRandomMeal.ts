'use client';

import { useState, useCallback } from 'react';
import { mealdbClient } from '@/lib/api/mealdb';
import { normalizeToRecipeCard } from '@/lib/api/recipeAdapter';
import type { RecipeCard } from '@/types/recipe';

export function useRandomMeal() {
  const [meal, setMeal] = useState<RecipeCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomMeal = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomMeal = await mealdbClient.getRandomMeal();
      if (!randomMeal) {
        setError('Could not fetch random meal');
        return null;
      }

      const normalized = normalizeToRecipeCard(randomMeal);
      setMeal(normalized);
      return normalized;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get random meal';
      setError(errorMessage);
      console.error('[useRandomMeal] error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMultipleRandomMeals = useCallback(async (count: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const meals = await mealdbClient.getRandomMeals(count);
      if (meals.length === 0) {
        setError('Could not fetch random meals');
        return [];
      }

      return meals.map(normalizeToRecipeCard);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get random meals';
      setError(errorMessage);
      console.error('[useRandomMeal] error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMeal(null);
    setError(null);
  }, []);

  return {
    meal,
    isLoading,
    error,
    getRandomMeal,
    getMultipleRandomMeals,
    reset,
  };
}

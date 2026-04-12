'use client';

import { useState, useCallback } from 'react';
import { mealdbClient } from '@/lib/api/mealdb';
import { normalizeToRecipeCard, filterRecipesByDiet } from '@/lib/api/recipeAdapter';
import type { RecipeCard, SearchFilters } from '@/types/recipe';
import { useRecipeStore } from '@/lib/store';

export function useMealSearch() {
  const [results, setResults] = useState<RecipeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSearchResults = useRecipeStore((state) => state.setSearchResults);

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      let meals = [];

      if (filters.query) {
        // Search by meal name
        meals = await mealdbClient.searchByName(filters.query);
      } else if (filters.category) {
        // Filter by category
        meals = await mealdbClient.filterByCategory(filters.category);
      } else if (filters.cuisine) {
        // Filter by cuisine/area
        meals = await mealdbClient.filterByCuisine(filters.cuisine);
      } else if (filters.ingredient) {
        // Filter by ingredient
        meals = await mealdbClient.filterByIngredient(filters.ingredient);
      } else {
        setResults([]);
        return;
      }

      // Normalize meals to RecipeCard format
      let normalized = meals.map(normalizeToRecipeCard);

      // Apply diet filter
      if (filters.diet && filters.diet !== 'all') {
        normalized = filterRecipesByDiet(normalized, filters.diet);
      }

      setResults(normalized);
      setSearchResults(normalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('[useMealSearch] error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setSearchResults]);

  const searchByName = useCallback(
    (query: string, diet?: 'vegan' | 'vegetarian' | 'all') => {
      return search({ query, diet });
    },
    [search]
  );

  const searchByCategory = useCallback(
    (category: string, diet?: 'vegan' | 'vegetarian' | 'all') => {
      return search({ category, diet });
    },
    [search]
  );

  const searchByCuisine = useCallback(
    (cuisine: string, diet?: 'vegan' | 'vegetarian' | 'all') => {
      return search({ cuisine, diet });
    },
    [search]
  );

  const searchByIngredient = useCallback(
    (ingredient: string, diet?: 'vegan' | 'vegetarian' | 'all') => {
      return search({ ingredient, diet });
    },
    [search]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setSearchResults([]);
  }, [setSearchResults]);

  return {
    results,
    isLoading,
    error,
    search,
    searchByName,
    searchByCategory,
    searchByCuisine,
    searchByIngredient,
    clearResults,
  };
}

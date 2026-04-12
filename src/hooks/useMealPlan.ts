'use client';

import { useState, useCallback } from 'react';
import { useRandomMeal } from './useRandomMeal';
import { useMealSearch } from './useMealSearch';
import { useRecipeStore } from '@/lib/store';
import type { MealPlan, MealPlanDay, RecipeCard } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';

const DAYS_OF_WEEK: MealPlanDay['dayOfWeek'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MEAL_PLAN_CATEGORIES = {
  breakfast: 'Breakfast',
  lunch: ['Seafood', 'Chicken', 'Pasta', 'Vegetarian'],
  dinner: ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pork', 'Lamb'],
};

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMultipleRandomMeals } = useRandomMeal();
  const { search, searchByCategory } = useMealSearch();
  const { addMealPlan, updateMealPlan } = useRecipeStore((state) => ({
    addMealPlan: state.addMealPlan,
    updateMealPlan: state.updateMealPlan,
  }));

  const generateMealPlan = useCallback(
    async (
      diet: 'vegan' | 'vegetarian' | 'all' = 'all',
      name?: string
    ): Promise<MealPlan | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const week: MealPlanDay[] = [];

        for (const day of DAYS_OF_WEEK) {
          // Get breakfast - use breakfast category
          const breakfastMeals = await searchByCategory(MEAL_PLAN_CATEGORIES.breakfast, diet);
          const breakfast = breakfastMeals.length > 0 ? breakfastMeals[0] : null;

          // Get lunch - pick random category from lunch options
          const lunchCategory =
            MEAL_PLAN_CATEGORIES.lunch[
              Math.floor(Math.random() * MEAL_PLAN_CATEGORIES.lunch.length)
            ];
          const lunchMeals = await searchByCategory(lunchCategory, diet);
          const lunch =
            lunchMeals.length > 0
              ? lunchMeals[Math.floor(Math.random() * lunchMeals.length)]
              : null;

          // Get dinner - pick random category from dinner options
          const dinnerCategory =
            MEAL_PLAN_CATEGORIES.dinner[
              Math.floor(Math.random() * MEAL_PLAN_CATEGORIES.dinner.length)
            ];
          const dinnerMeals = await searchByCategory(dinnerCategory, diet);
          const dinner =
            dinnerMeals.length > 0
              ? dinnerMeals[Math.floor(Math.random() * dinnerMeals.length)]
              : null;

          week.push({
            dayOfWeek: day,
            breakfast,
            lunch,
            dinner,
          });
        }

        const newPlan: MealPlan = {
          id: uuidv4(),
          name: name || `${diet.charAt(0).toUpperCase() + diet.slice(1)} Meal Plan`,
          week,
          diet,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setPlan(newPlan);
        addMealPlan(newPlan);

        return newPlan;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate meal plan';
        setError(errorMessage);
        console.error('[useMealPlan] error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getMultipleRandomMeals, searchByCategory, addMealPlan]
  );

  const updateMealInPlan = useCallback(
    (dayOfWeek: MealPlanDay['dayOfWeek'], mealType: 'breakfast' | 'lunch' | 'dinner', recipe: RecipeCard | null) => {
      if (!plan) return;

      const updated = {
        ...plan,
        week: plan.week.map((day) => {
          if (day.dayOfWeek === dayOfWeek) {
            return {
              ...day,
              [mealType]: recipe,
            };
          }
          return day;
        }),
        updatedAt: new Date(),
      };

      setPlan(updated);
      updateMealPlan(updated);
    },
    [plan, updateMealPlan]
  );

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  return {
    plan,
    isLoading,
    error,
    generateMealPlan,
    updateMealInPlan,
    reset,
  };
}

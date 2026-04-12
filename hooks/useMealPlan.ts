'use client';

import { useState, useCallback } from 'react';
import { mealdbClient } from '@/lib/api/mealdb';
import { normalizeToRecipeCard } from '@/lib/api/recipeAdapter';
import type { RecipeCard } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_PLAN_CATEGORIES = {
  breakfast: 'Breakfast',
  lunch: ['Seafood', 'Chicken', 'Vegetarian', 'Pasta'],
  dinner: ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pork'],
};

export interface DayPlan {
  dayOfWeek: string;
  breakfast: RecipeCard | null;
  lunch: RecipeCard | null;
  dinner: RecipeCard | null;
}

export interface MealPlan {
  id: string;
  name: string;
  week: DayPlan[];
  createdAt: Date;
  diet?: 'omad' | 'high-protein' | 'all';
}

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWeekPlan = useCallback(
    async (diet: 'omad' | 'high-protein' | 'all' = 'all') => {
      setIsLoading(true);
      setError(null);

      try {
        const week: DayPlan[] = [];

        for (const day of DAYS_OF_WEEK) {
          // Get breakfast meals
          const breakfastMeals = await mealdbClient.filterByCategory(
            MEAL_PLAN_CATEGORIES.breakfast
          );

          const breakfast =
            breakfastMeals.length > 0
              ? normalizeToRecipeCard(breakfastMeals[Math.floor(Math.random() * breakfastMeals.length)])
              : null;

          // Get lunch - pick random category from lunch options
          const lunchCategory =
            MEAL_PLAN_CATEGORIES.lunch[
              Math.floor(Math.random() * MEAL_PLAN_CATEGORIES.lunch.length)
            ];
          const lunchMeals = await mealdbClient.filterByCategory(lunchCategory);
          const lunch =
            lunchMeals.length > 0
              ? normalizeToRecipeCard(lunchMeals[Math.floor(Math.random() * lunchMeals.length)])
              : null;

          // Get dinner - pick random category from dinner options
          const dinnerCategory =
            MEAL_PLAN_CATEGORIES.dinner[
              Math.floor(Math.random() * MEAL_PLAN_CATEGORIES.dinner.length)
            ];
          const dinnerMeals = await mealdbClient.filterByCategory(dinnerCategory);
          const dinner =
            dinnerMeals.length > 0
              ? normalizeToRecipeCard(dinnerMeals[Math.floor(Math.random() * dinnerMeals.length)])
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
          name: `Weekly Plan - ${new Date().toLocaleDateString()}`,
          week,
          createdAt: new Date(),
          diet,
        };

        setPlan(newPlan);
        return newPlan;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate meal plan';
        setError(message);
        console.error('[useMealPlan] generateWeekPlan error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateMeal = useCallback(
    (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', newMeal: RecipeCard | null) => {
      if (!plan) return;

      const updatedWeek = [...plan.week];
      updatedWeek[dayIndex] = {
        ...updatedWeek[dayIndex],
        [mealType]: newMeal,
      };

      setPlan({
        ...plan,
        week: updatedWeek,
      });
    },
    [plan]
  );

  const swapMeals = useCallback(
    (
      fromDay: number,
      fromMealType: 'breakfast' | 'lunch' | 'dinner',
      toDay: number,
      toMealType: 'breakfast' | 'lunch' | 'dinner'
    ) => {
      if (!plan) return;

      const updatedWeek = [...plan.week];
      const tempMeal = updatedWeek[fromDay][fromMealType];

      updatedWeek[fromDay] = {
        ...updatedWeek[fromDay],
        [fromMealType]: updatedWeek[toDay][toMealType],
      };

      updatedWeek[toDay] = {
        ...updatedWeek[toDay],
        [toMealType]: tempMeal,
      };

      setPlan({
        ...plan,
        week: updatedWeek,
      });
    },
    [plan]
  );

  const exportPlan = useCallback(() => {
    if (!plan) return null;

    let text = `Meal Plan: ${plan.name}\n`;
    text += `Generated: ${plan.createdAt.toLocaleDateString()}\n`;
    text += `Diet: ${plan.diet || 'all'}\n\n`;

    plan.week.forEach((day) => {
      text += `${day.dayOfWeek}\n`;
      text += `  Breakfast: ${day.breakfast?.name || 'Not planned'}\n`;
      text += `  Lunch: ${day.lunch?.name || 'Not planned'}\n`;
      text += `  Dinner: ${day.dinner?.name || 'Not planned'}\n\n`;
    });

    return text;
  }, [plan]);

  return {
    plan,
    isLoading,
    error,
    generateWeekPlan,
    updateMeal,
    swapMeals,
    exportPlan,
  };
}

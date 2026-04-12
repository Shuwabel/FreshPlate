// TheMealDB API client
// Free API at https://www.themealdb.com/api/json/v1/1

import type {
  TheMealDBMeal,
  MealDBResponse,
  CategoriesResponse,
  IngredientsResponse,
} from '@/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

class MealDBClient {
  async searchByName(mealName: string): Promise<TheMealDBMeal[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(mealName)}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<TheMealDBMeal> = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('[MealDB] searchByName error:', error);
      return [];
    }
  }

  async searchByFirstLetter(letter: string): Promise<TheMealDBMeal[]> {
    try {
      const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<TheMealDBMeal> = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('[MealDB] searchByFirstLetter error:', error);
      return [];
    }
  }

  async getMealById(mealId: string): Promise<TheMealDBMeal | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${mealId}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<TheMealDBMeal> = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('[MealDB] getMealById error:', error);
      return null;
    }
  }

  async filterByCategory(category: string): Promise<TheMealDBMeal[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<Partial<TheMealDBMeal>> = await response.json();

      if (!data.meals) return [];

      // Filter endpoint returns partial data, need to fetch full details
      // For performance, we'll return simplified data for lists
      return data.meals as TheMealDBMeal[];
    } catch (error) {
      console.error('[MealDB] filterByCategory error:', error);
      return [];
    }
  }

  async filterByCuisine(area: string): Promise<TheMealDBMeal[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<Partial<TheMealDBMeal>> = await response.json();
      return (data.meals || []) as TheMealDBMeal[];
    } catch (error) {
      console.error('[MealDB] filterByCuisine error:', error);
      return [];
    }
  }

  async filterByIngredient(ingredient: string): Promise<TheMealDBMeal[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<Partial<TheMealDBMeal>> = await response.json();
      return (data.meals || []) as TheMealDBMeal[];
    } catch (error) {
      console.error('[MealDB] filterByIngredient error:', error);
      return [];
    }
  }

  async getRandomMeal(): Promise<TheMealDBMeal | null> {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: MealDBResponse<TheMealDBMeal> = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('[MealDB] getRandomMeal error:', error);
      return null;
    }
  }

  async getRandomMeals(count: number): Promise<TheMealDBMeal[]> {
    const meals: TheMealDBMeal[] = [];
    for (let i = 0; i < count; i++) {
      const meal = await this.getRandomMeal();
      if (meal) meals.push(meal);
    }
    return meals;
  }

  async listCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/list.php?c=list`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: CategoriesResponse = await response.json();
      return data.meals?.map((m) => m.strCategory) || [];
    } catch (error) {
      console.error('[MealDB] listCategories error:', error);
      return [];
    }
  }

  async listAreas(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/list.php?a=list`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.meals?.map((m: any) => m.strArea) || [];
    } catch (error) {
      console.error('[MealDB] listAreas error:', error);
      return [];
    }
  }

  async listIngredients(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/list.php?i=list`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: IngredientsResponse = await response.json();
      return data.meals?.map((m) => m.strIngredient) || [];
    } catch (error) {
      console.error('[MealDB] listIngredients error:', error);
      return [];
    }
  }
}

export const mealdbClient = new MealDBClient();

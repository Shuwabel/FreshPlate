// Adapter to normalize TheMealDB responses to RecipeCard format

import type { TheMealDBMeal, RecipeCard, RecipeDetails, IngredientItem } from '@/types/recipe';
import {
  getEstimatedCalories,
  getEstimatedCookTime,
  getEstimatedDifficulty,
} from '@/lib/estimates';

export function normalizeToRecipeCard(meal: TheMealDBMeal): RecipeCard {
  const isVegan = isVeganMeal(meal);
  const isVegetarian = isVegetarianMeal(meal);

  return {
    id: `mdb-${meal.idMeal}`,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    cuisine: meal.strArea,
    tags: extractTags(meal.strTags),
    calories: getEstimatedCalories(meal.strCategory, meal.strArea),
    cookTime: getEstimatedCookTime(meal.strCategory),
    difficulty: getEstimatedDifficulty(meal.strCategory, meal.strArea),
    isVegan,
    isVegetarian,
  };
}

export function normalizeToRecipeDetails(meal: TheMealDBMeal): RecipeDetails {
  const card = normalizeToRecipeCard(meal);
  const ingredients = extractIngredients(meal);

  return {
    ...card,
    instructions: meal.strInstructions,
    ingredients,
    youtubeUrl: meal.strYoutube || undefined,
  };
}

function extractIngredients(meal: TheMealDBMeal): IngredientItem[] {
  const ingredients: IngredientItem[] = [];

  // TheMealDB uses numbered fields strIngredient1-20 and strMeasure1-20
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof TheMealDBMeal;
    const measureKey = `strMeasure${i}` as keyof TheMealDBMeal;

    const ingredient = meal[ingredientKey];
    const measure = meal[measureKey];

    if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: (measure && typeof measure === 'string' ? measure.trim() : '') || 'to taste',
      });
    }
  }

  return ingredients;
}

function extractTags(tagsString: string | null | undefined): string[] {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function isVeganMeal(meal: TheMealDBMeal): boolean {
  const category = meal.strCategory.toLowerCase();
  const tags = (meal.strTags || '').toLowerCase();

  if (category === 'vegan') return true;
  if (tags.includes('vegan')) return true;

  // Check for common non-vegan ingredients in the ingredients list
  const hasNonVeganIngredients = hasProhibitedIngredients(meal, [
    'egg',
    'milk',
    'cheese',
    'butter',
    'cream',
    'meat',
    'chicken',
    'beef',
    'pork',
    'lamb',
    'fish',
    'seafood',
    'honey',
  ]);

  return !hasNonVeganIngredients;
}

function isVegetarianMeal(meal: TheMealDBMeal): boolean {
  const category = meal.strCategory.toLowerCase();
  const tags = (meal.strTags || '').toLowerCase();

  if (category === 'vegetarian' || category === 'vegan') return true;
  if (tags.includes('vegetarian') || tags.includes('vegan')) return true;

  // Check for common non-vegetarian ingredients
  const hasNonVegetarianIngredients = hasProhibitedIngredients(meal, [
    'meat',
    'chicken',
    'beef',
    'pork',
    'lamb',
    'fish',
    'seafood',
    'bacon',
    'ham',
    'sausage',
  ]);

  return !hasNonVegetarianIngredients;
}

function hasProhibitedIngredients(
  meal: TheMealDBMeal,
  prohibitedKeywords: string[]
): boolean {
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof TheMealDBMeal;
    const ingredient = meal[ingredientKey];

    if (ingredient && typeof ingredient === 'string') {
      const ingredientLower = ingredient.toLowerCase();
      if (prohibitedKeywords.some((keyword) => ingredientLower.includes(keyword))) {
        return true;
      }
    }
  }

  return false;
}

export function filterRecipesByDiet(
  recipes: RecipeCard[],
  diet: 'vegan' | 'vegetarian' | 'all'
): RecipeCard[] {
  if (diet === 'all') return recipes;
  if (diet === 'vegan') return recipes.filter((r) => r.isVegan);
  if (diet === 'vegetarian') return recipes.filter((r) => r.isVegetarian);
  return recipes;
}

export function sortRecipesByCalories(
  recipes: RecipeCard[],
  order: 'asc' | 'desc' = 'asc'
): RecipeCard[] {
  return [...recipes].sort((a, b) => {
    return order === 'asc' ? a.calories - b.calories : b.calories - a.calories;
  });
}

export function sortRecipesByCookTime(
  recipes: RecipeCard[],
  order: 'asc' | 'desc' = 'asc'
): RecipeCard[] {
  return [...recipes].sort((a, b) => {
    return order === 'asc' ? a.cookTime - b.cookTime : b.cookTime - a.cookTime;
  });
}

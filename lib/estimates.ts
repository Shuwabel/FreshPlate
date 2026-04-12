// Estimated nutritional values and cook times for TheMealDB meals
// Based on meal category since TheMealDB doesn't provide nutrition data

export const CATEGORY_ESTIMATES: Record<
  string,
  { calories: number; cookTime: number; difficulty: 'easy' | 'medium' | 'hard' }
> = {
  Breakfast: { calories: 400, cookTime: 15, difficulty: 'easy' },
  Dessert: { calories: 350, cookTime: 20, difficulty: 'medium' },
  Seafood: { calories: 450, cookTime: 25, difficulty: 'medium' },
  Vegetarian: { calories: 380, cookTime: 20, difficulty: 'easy' },
  Vegan: { calories: 320, cookTime: 25, difficulty: 'medium' },
  Pasta: { calories: 520, cookTime: 20, difficulty: 'easy' },
  Beef: { calories: 620, cookTime: 35, difficulty: 'hard' },
  Chicken: { calories: 480, cookTime: 25, difficulty: 'easy' },
  Pork: { calories: 550, cookTime: 30, difficulty: 'medium' },
  Lamb: { calories: 580, cookTime: 40, difficulty: 'hard' },
  Goat: { calories: 450, cookTime: 45, difficulty: 'hard' },
  Miscellaneous: { calories: 400, cookTime: 20, difficulty: 'medium' },
  Starter: { calories: 200, cookTime: 10, difficulty: 'easy' },
  Side: { calories: 250, cookTime: 15, difficulty: 'easy' },
};

export const CUISINE_ESTIMATES: Record<
  string,
  { caloriesAdjust: number; difficulty: 'easy' | 'medium' | 'hard' }
> = {
  American: { caloriesAdjust: 50, difficulty: 'medium' },
  British: { caloriesAdjust: 0, difficulty: 'medium' },
  Canadian: { caloriesAdjust: 20, difficulty: 'medium' },
  Chinese: { caloriesAdjust: -20, difficulty: 'medium' },
  Croatian: { caloriesAdjust: 30, difficulty: 'medium' },
  Dutch: { caloriesAdjust: 40, difficulty: 'easy' },
  Egyptian: { caloriesAdjust: 10, difficulty: 'medium' },
  Filipino: { caloriesAdjust: 30, difficulty: 'medium' },
  French: { caloriesAdjust: 60, difficulty: 'hard' },
  Greek: { caloriesAdjust: 20, difficulty: 'easy' },
  Indian: { caloriesAdjust: 40, difficulty: 'hard' },
  Irish: { caloriesAdjust: 50, difficulty: 'easy' },
  Italian: { caloriesAdjust: 10, difficulty: 'medium' },
  Jamaican: { caloriesAdjust: 30, difficulty: 'medium' },
  Japanese: { caloriesAdjust: -30, difficulty: 'hard' },
  Kenyan: { caloriesAdjust: 0, difficulty: 'easy' },
  Malaysian: { caloriesAdjust: 20, difficulty: 'medium' },
  Mexican: { caloriesAdjust: 40, difficulty: 'medium' },
  Moroccan: { caloriesAdjust: 30, difficulty: 'hard' },
  Polish: { caloriesAdjust: 60, difficulty: 'medium' },
  Portuguese: { caloriesAdjust: 30, difficulty: 'medium' },
  Russian: { caloriesAdjust: 50, difficulty: 'medium' },
  Spanish: { caloriesAdjust: 20, difficulty: 'medium' },
  Thai: { caloriesAdjust: 10, difficulty: 'medium' },
  Tunisian: { caloriesAdjust: 20, difficulty: 'hard' },
  Turkish: { caloriesAdjust: 10, difficulty: 'medium' },
  Ukrainian: { caloriesAdjust: 40, difficulty: 'medium' },
  Unknown: { caloriesAdjust: 0, difficulty: 'medium' },
  Vietnamese: { caloriesAdjust: -10, difficulty: 'medium' },
};

export function getEstimatedCalories(category: string, cuisine: string): number {
  const baseCalories = CATEGORY_ESTIMATES[category]?.calories || 400;
  const cuisineAdjust = CUISINE_ESTIMATES[cuisine]?.caloriesAdjust || 0;
  return Math.max(200, baseCalories + cuisineAdjust);
}

export function getEstimatedCookTime(category: string): number {
  return CATEGORY_ESTIMATES[category]?.cookTime || 20;
}

export function getEstimatedDifficulty(
  category: string,
  cuisine: string
): 'easy' | 'medium' | 'hard' {
  const categoryDiff = CATEGORY_ESTIMATES[category]?.difficulty || 'medium';
  const cuisineDiff = CUISINE_ESTIMATES[cuisine]?.difficulty || 'medium';

  // Upgrade difficulty if both suggest harder recipes
  if (categoryDiff === 'hard' && cuisineDiff === 'hard') return 'hard';
  if (categoryDiff === 'hard' || cuisineDiff === 'hard') return 'medium';
  return 'easy';
}

export const DIET_KEYWORDS = {
  vegan: ['vegan', 'plant-based', 'no meat', 'vegetables only'],
  vegetarian: ['vegetarian', 'no meat', 'eggs and dairy ok'],
};

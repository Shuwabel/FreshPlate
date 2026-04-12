// Recipe types for TheMealDB integration
export interface TheMealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

// Normalized recipe card for consistent display
export interface RecipeCard {
  id: string;
  name: string;
  image: string;
  category: string;
  cuisine: string;
  tags: string[];
  calories: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isVegan: boolean;
  isVegetarian: boolean;
}

// Full recipe details
export interface RecipeDetails extends RecipeCard {
  instructions: string;
  ingredients: IngredientItem[];
  youtubeUrl?: string;
}

// Ingredient with measurement
export interface IngredientItem {
  name: string;
  measure: string;
}

// API Response types
export interface MealDBResponse<T> {
  meals: T[] | null;
}

export interface CategoriesResponse {
  meals: Array<{
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
  }>;
}

export interface IngredientsResponse {
  meals: Array<{
    idIngredient: string;
    strIngredient: string;
    strDescription: string;
    strType: string;
  }>;
}

// Search filters
export interface SearchFilters {
  query?: string;
  category?: string;
  cuisine?: string;
  ingredient?: string;
  diet?: 'vegan' | 'vegetarian' | 'all';
}

// Meal plan types
export interface MealPlanDay {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: RecipeCard | null;
  lunch: RecipeCard | null;
  dinner: RecipeCard | null;
}

export interface MealPlan {
  id: string;
  name: string;
  week: MealPlanDay[];
  diet: 'vegan' | 'vegetarian' | 'all';
  createdAt: Date;
  updatedAt: Date;
}

// User preference
export interface UserPreferences {
  favoriteIds: string[];
  routineIds: string[];
  dietPreference: 'vegan' | 'vegetarian' | 'all';
  theme: 'light' | 'dark' | 'system';
}

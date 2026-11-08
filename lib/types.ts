export type Course = 'main' | 'soup' | 'side' | 'snack' | 'drink' | 'breakfast' | 'dessert' | 'street-food'
export type Region = 'West Africa' | 'East Africa' | 'North Africa' | 'Southern Africa' | 'Central Africa'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Diet {
  vegetarian: boolean
  vegan: boolean
  glutenFree: boolean
  containsNuts: boolean
}

export interface IngredientItem {
  name: string
  amount: string
  note?: string
}

export interface IngredientGroup {
  group: string | null
  items: IngredientItem[]
}

export interface Step {
  title: string
  text: string
  minutes?: number
}

export interface Swap {
  ingredient: string
  swap: string
}

export interface Nutrition {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface DishImage {
  file: string
  alt: string
  title: string
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
  width: number
  height: number
}

export interface DishVideo {
  id: string
  title: string
  channel: string
  durationSec: number
  views: number
}

/** Everything about one dish. Loaded on the server for recipe pages. */
export interface Recipe {
  slug: string
  name: string
  localName?: string
  country: string
  region: Region
  course: Course
  tags: string[]
  diet: Diet
  spice: number
  summary: string
  story: string
  prepMinutes: number
  cookMinutes: number
  servings: number
  difficulty: Difficulty
  ingredients: IngredientGroup[]
  steps: Step[]
  tips: string[]
  swaps: Swap[]
  servesWith: string[]
  nutrition: Nutrition
  image: DishImage
  video?: DishVideo
}

/** Light version used for lists, search and the planner on the client. */
export interface RecipeSummary {
  slug: string
  name: string
  localName?: string
  country: string
  region: Region
  course: Course
  tags: string[]
  diet: Diet
  spice: number
  summary: string
  totalMinutes: number
  servings: number
  difficulty: Difficulty
  image: { file: string; alt: string }
  hasVideo: boolean
  /** The first few ingredients, shown as "Starring". */
  starring: string[]
  /** Lowercase ingredient names, for ingredient-first search. */
  keywords: string[]
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export interface PlanDay {
  breakfast: string | null
  lunch: string | null
  dinner: string | null
}

export interface MealPlan {
  id: string
  name: string
  createdAt: string
  /** Seven entries, Monday first. */
  days: PlanDay[]
  servings: number
}

export interface ShoppingEntry {
  id: string
  name: string
  amount: string
  checked: boolean
  /** Which recipes asked for it. */
  from: string[]
  custom?: boolean
}

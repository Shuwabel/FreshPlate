import type { MealPlan, MealSlot, PlanDay, RecipeSummary } from './types'

export interface PlanOptions {
  diet: 'all' | 'vegetarian' | 'vegan'
  /** nigerian: mostly Nigerian dishes; africa: all African dishes mixed. */
  focus: 'nigerian' | 'africa'
  maxSpice: number
  servings: number
  seed: number
}

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner']

/** Small deterministic random generator so "shuffle" is repeatable. */
function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function allowed(r: RecipeSummary, o: PlanOptions): boolean {
  if (o.diet === 'vegan' && !r.diet.vegan) return false
  if (o.diet === 'vegetarian' && !r.diet.vegetarian) return false
  return r.spice <= o.maxSpice
}

const MEAL_COURSES: Record<MealSlot, RecipeSummary['course'][]> = {
  breakfast: ['breakfast', 'snack', 'street-food'],
  lunch: ['main', 'soup', 'side', 'street-food'],
  dinner: ['main', 'soup'],
}

/** Builds a week with no repeated dish where the library allows it. */
export function generatePlan(all: RecipeSummary[], o: PlanOptions, id: string, name: string): MealPlan {
  const rand = rng(o.seed)
  const pool = all.filter((r) => allowed(r, o) && r.course !== 'drink' && r.course !== 'dessert')
  const used = new Set<string>()

  const pick = (slot: MealSlot): string | null => {
    const courses = MEAL_COURSES[slot]
    let candidates = pool.filter((r) => courses.includes(r.course) && !used.has(r.slug))
    if (o.focus === 'nigerian') {
      const home = candidates.filter((r) => r.country === 'Nigeria')
      // Four in five meals from Nigeria, the rest from elsewhere for variety.
      if (home.length && rand() < 0.8) candidates = home
    }
    if (candidates.length === 0) candidates = pool.filter((r) => courses.includes(r.course))
    if (candidates.length === 0) return null
    const chosen = shuffle(candidates, rand)[0]
    used.add(chosen.slug)
    return chosen.slug
  }

  const days: PlanDay[] = DAY_LABELS.map(() => ({
    breakfast: pick('breakfast'),
    lunch: pick('lunch'),
    dinner: pick('dinner'),
  }))

  return { id, name, createdAt: new Date().toISOString(), days, servings: o.servings }
}

export function plannedSlugs(plan: MealPlan): string[] {
  return [...new Set(plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]).filter((s): s is string => !!s))]
}

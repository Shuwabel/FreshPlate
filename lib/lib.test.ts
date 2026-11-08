import { describe, expect, it } from 'vitest'
import { formatNumber, parseAmount, scaleAmount } from './scale'
import { aisleFor, buildShoppingList } from './shopping'
import { generatePlan } from './planner'
import type { IngredientGroup, RecipeSummary } from './types'

describe('scaleAmount', () => {
  it('scales plain numbers and the metric figure in brackets', () => {
    expect(scaleAmount('2 cups (400 g) long-grain rice', 2)).toBe('4 cups (800 g) long-grain rice')
    expect(scaleAmount('2 cups (400 g)', 0.5)).toBe('1 cup (200 g)')
  })
  it('handles fractions and mixed numbers', () => {
    expect(scaleAmount('1/2 tsp', 2)).toBe('1 tsp')
    expect(scaleAmount('1 1/2 cups', 2)).toBe('3 cups')
    expect(scaleAmount('½ cup', 3)).toBe('1½ cups')
  })
  it('scales ranges on both ends', () => {
    expect(scaleAmount('2-3 scotch bonnets', 2)).toBe('4-6 scotch bonnets')
  })
  it('leaves amounts with no number alone', () => {
    expect(scaleAmount('to taste', 4)).toBe('to taste')
    expect(scaleAmount('1 cup', 1)).toBe('1 cup')
  })
  it('rounds to cooking-friendly values', () => {
    expect(formatNumber(0.3333)).toBe('¼')
    expect(formatNumber(12.4)).toBe('12')
    expect(formatNumber(403)).toBe('405')
  })
})

describe('parseAmount', () => {
  it('reads quantity, unit and bracketed metric', () => {
    expect(parseAmount('2 cups (400 g) rice')).toEqual({ qty: 2, unit: 'cup', paren: { qty: 400, unit: 'g' } })
    expect(parseAmount('to taste')).toBeNull()
  })
})

const rice: IngredientGroup[] = [
  { group: null, items: [{ name: 'Long-grain rice', amount: '2 cups (400 g)' }, { name: 'Vegetable oil', amount: '3 tbsp' }, { name: 'Salt', amount: 'to taste' }] },
]
const stew: IngredientGroup[] = [
  { group: null, items: [{ name: 'long-grain rice', amount: '1 cup (200 g)' }, { name: 'Vegetable oil', amount: '1/2 cup' }, { name: 'Salt', amount: 'to taste' }] },
]

describe('buildShoppingList', () => {
  const list = buildShoppingList([
    { recipe: { name: 'Jollof', servings: 4, ingredients: rice }, servings: 4 },
    { recipe: { name: 'Fried rice', servings: 2, ingredients: stew }, servings: 4 },
  ])
  it('adds the same ingredient across recipes and scales to the servings wanted', () => {
    const r = list.find((l) => l.name.toLowerCase().includes('rice'))!
    expect(r.amount).toBe('4 cups (800 g)')
    expect(r.from).toEqual(['Jollof', 'Fried rice'])
  })
  it('keeps different units apart instead of guessing', () => {
    const oil = list.find((l) => l.name.toLowerCase().includes('oil'))!
    expect(oil.amount).toBe('3 tbsp + 1 cup')
  })
  it('does not lose amounts without a number', () => {
    expect(list.find((l) => l.name === 'Salt')!.amount).toBe('to taste')
  })
})

describe('aisleFor', () => {
  it('sorts African pantry items correctly', () => {
    expect(aisleFor('Ground egusi (melon seeds)')).toBe('African pantry')
    expect(aisleFor('Chicken thighs')).toBe('Meat, fish and eggs')
    expect(aisleFor('Scotch bonnet')).toBe('Fresh produce')
    expect(aisleFor('Palm oil')).toBe('African pantry')
  })
})

function make(slug: string, course: RecipeSummary['course'], country = 'Nigeria', vegan = false): RecipeSummary {
  return {
    slug, name: slug, country, region: 'West Africa', course, tags: [], spice: 1, summary: '', totalMinutes: 30, servings: 4, difficulty: 'Easy',
    diet: { vegetarian: vegan, vegan, glutenFree: false, containsNuts: false }, image: { file: '/x.jpg', alt: '' }, hasVideo: false, starring: [], keywords: [],
  }
}

describe('generatePlan', () => {
  const lib: RecipeSummary[] = [
    ...['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'].map((s) => make(s, 'breakfast')),
    ...Array.from({ length: 16 }, (_, i) => make(`m${i}`, i % 2 ? 'main' : 'soup', i > 11 ? 'Ghana' : 'Nigeria')),
  ]
  it('fills 7 days x 3 meals with no repeats when the library is big enough', () => {
    const plan = generatePlan(lib, { diet: 'all', focus: 'nigerian', maxSpice: 3, servings: 4, seed: 1 }, 'p', 'Week')
    const slugs = plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner])
    expect(slugs.every(Boolean)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('is repeatable for the same seed', () => {
    const a = generatePlan(lib, { diet: 'all', focus: 'africa', maxSpice: 3, servings: 4, seed: 7 }, 'p', 'Week')
    const b = generatePlan(lib, { diet: 'all', focus: 'africa', maxSpice: 3, servings: 4, seed: 7 }, 'p', 'Week')
    expect(a.days).toEqual(b.days)
  })
  it('respects diet', () => {
    const vegan = [...lib.map((r) => ({ ...r })), make('v1', 'breakfast', 'Nigeria', true), make('v2', 'main', 'Nigeria', true), make('v3', 'soup', 'Nigeria', true)]
    const plan = generatePlan(vegan, { diet: 'vegan', focus: 'nigerian', maxSpice: 3, servings: 2, seed: 3 }, 'p', 'Week')
    const picked = plan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]).filter(Boolean)
    expect(picked.every((s) => ['v1', 'v2', 'v3'].includes(s as string))).toBe(true)
  })
})

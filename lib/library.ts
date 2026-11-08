import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import type { Recipe, RecipeSummary } from './types'

let cache: Recipe[] | null = null

function load(): Recipe[] {
  if (!cache) {
    const file = path.join(process.cwd(), 'data/library.json')
    cache = JSON.parse(fs.readFileSync(file, 'utf8')) as Recipe[]
  }
  return cache
}

export function getAllRecipes(): Recipe[] {
  return load()
}

export function getRecipe(slug: string): Recipe | undefined {
  return load().find((r) => r.slug === slug)
}

export function getSlugs(): string[] {
  return load().map((r) => r.slug)
}

export function getSummaries(): RecipeSummary[] {
  return (JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/index.json'), 'utf8')) as RecipeSummary[])
}

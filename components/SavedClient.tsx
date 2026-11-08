'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import RecipeCard from '@/components/RecipeCard'
import { useFreshPlate } from '@/lib/store'
import type { RecipeSummary } from '@/lib/types'

export default function SavedClient({ recipes }: { recipes: RecipeSummary[] }) {
  const favourites = useFreshPlate((s) => s.favourites)
  const recent = useFreshPlate((s) => s.recent)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return <p className="text-muted-foreground">Loading...</p>

  const bySlug = new Map(recipes.map((r) => [r.slug, r]))
  const saved = favourites.map((s) => bySlug.get(s)).filter((r): r is RecipeSummary => !!r)
  const seen = recent.map((s) => bySlug.get(s)).filter((r): r is RecipeSummary => !!r && !favourites.includes(r.slug))

  return (
    <div className="space-y-12">
      <section aria-label="Saved recipes">
        {saved.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((r) => (
              <li key={r.slug}><RecipeCard recipe={r} /></li>
            ))}
          </ul>
        ) : (
          <div className="border border-border bg-card p-6">
            <p className="display text-2xl">Nothing saved yet</p>
            <p className="mt-2 max-w-prose text-muted-foreground">Tap the heart on any dish and it will wait for you here. Saved dishes live in this browser.</p>
            <Button asChild className="mt-4"><Link href="/explore">Find something to cook</Link></Button>
          </div>
        )}
      </section>

      {seen.length > 0 && (
        <section aria-labelledby="recent-h">
          <h2 id="recent-h" className="display text-3xl">Recently viewed</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {seen.slice(0, 8).map((r) => (
              <li key={r.slug}><RecipeCard recipe={r} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

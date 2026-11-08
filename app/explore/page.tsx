import type { Metadata } from 'next'
import { Suspense } from 'react'
import ExploreClient from '@/components/ExploreClient'
import { getSummaries } from '@/lib/library'

export const metadata: Metadata = {
  title: 'Explore African recipes',
  description: 'Search Nigerian, Ghanaian, Ethiopian, Kenyan and other African recipes by dish, country, diet, time or the ingredients you have.',
}

export default function ExplorePage() {
  const recipes = getSummaries()
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="display text-4xl md:text-6xl">Explore</h1>
      <p className="mt-2 max-w-prose text-lg text-muted-foreground">
        {recipes.length} African dishes with photos, steps and video tutorials. Start with a country, or tell us what is in your kitchen.
      </p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-muted-foreground">Loading recipes...</p>}>
          <ExploreClient recipes={recipes} />
        </Suspense>
      </div>
    </div>
  )
}

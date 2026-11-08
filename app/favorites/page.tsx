import type { Metadata } from 'next'
import SavedClient from '@/components/SavedClient'
import { getSummaries } from '@/lib/library'

export const metadata: Metadata = { title: 'Saved recipes' }

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="display text-4xl md:text-6xl">Saved</h1>
      <p className="mt-2 max-w-prose text-lg text-muted-foreground">The dishes you want to cook again.</p>
      <div className="mt-6">
        <SavedClient recipes={getSummaries()} />
      </div>
    </div>
  )
}

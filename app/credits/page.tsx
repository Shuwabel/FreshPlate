import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllRecipes } from '@/lib/library'

export const metadata: Metadata = { title: 'Photo and video credits' }

export default function CreditsPage() {
  const recipes = getAllRecipes()
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <h1 className="display text-4xl md:text-6xl">Credits</h1>
      <p className="mt-2 max-w-prose text-lg text-muted-foreground">
        Every photo is shared under a free licence on Wikimedia Commons. Recipe text is original to FreshPlate. Video tutorials belong to their creators and play from YouTube.
      </p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {recipes.map((r) => (
          <li key={r.slug} className="py-3">
            <Link href={`/recipe/${r.slug}`} className="font-bold hover:underline">{r.name}</Link>
            <p className="text-sm text-muted-foreground">
              Photo by {r.image.author}, {r.image.license}.{' '}
              <a className="underline underline-offset-4" href={r.image.sourceUrl} target="_blank" rel="noreferrer">Source</a>
              {r.video && <> · Video: {r.video.channel}</>}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SpiceMark } from '@/components/RecipeCard'
import type { RecipeSummary } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface HeroTab {
  id: string
  label: string
  recipes: RecipeSummary[]
}

/** The lead poster follows the shelf you pick. */
export default function HomeHero({ tabs }: { tabs: HeroTab[] }) {
  const [tabId, setTabId] = useState(tabs[0].id)
  const [leadIndex, setLeadIndex] = useState(0)
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0]
  const lead = tab.recipes[Math.min(leadIndex, tab.recipes.length - 1)]

  return (
    <section className="night-ground relative overflow-hidden" aria-labelledby="hero-h">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-8 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-10 md:pb-12 md:pt-12">
        <div>
          <p className="billing text-gold">Nigerian kitchen · West Africa · Now cooking</p>
          <h1 id="hero-h" className="sr-only">FreshPlate: African recipes you can actually cook</h1>
          <p key={lead.slug} className="poster-title mt-4 text-5xl md:text-7xl" aria-live="polite">
            {lead.name}
          </p>
          <p className="mt-4 max-w-prose text-lg text-chalk/90">{lead.summary}</p>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-chalk/85">
            <span>{lead.country}</span>
            <span className="inline-flex items-center gap-1 tnum">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {lead.totalMinutes >= 60 ? `${Math.floor(lead.totalMinutes / 60)} h ${lead.totalMinutes % 60 || ''}`.trim() + (lead.totalMinutes % 60 ? ' min' : '') : `${lead.totalMinutes} min`}
            </span>
            <SpiceMark level={lead.spice} className="text-gold" />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-night hover:bg-gold-deep">
              <Link href={`/recipe/${lead.slug}`}>Cook this</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-chalk hover:bg-white/10 hover:text-chalk">
              <Link href="/explore">Browse all recipes</Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="vignette relative aspect-[4/3] overflow-hidden bg-night-2">
            <Image
              key={lead.slug}
              src={lead.image.file}
              alt={lead.image.alt}
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          <ul className="mt-3 grid grid-cols-4 gap-2" aria-label={`More from ${tab.label}`}>
            {tab.recipes.slice(0, 4).map((r, i) => (
              <li key={r.slug}>
                <button
                  type="button"
                  onClick={() => setLeadIndex(i)}
                  aria-label={`Feature ${r.name}`}
                  aria-pressed={i === leadIndex}
                  className={cn('vignette relative block aspect-square w-full overflow-hidden ring-offset-2 ring-offset-night', i === leadIndex ? 'ring-2 ring-gold' : 'opacity-75 hover:opacity-100')}
                >
                  <Image src={r.image.file} alt="" fill sizes="12vw" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-6">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Choose a shelf">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === tabId}
              onClick={() => {
                setTabId(t.id)
                setLeadIndex(0)
              }}
              className={cn(
                'min-h-11 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition-colors',
                t.id === tabId ? 'border-gold bg-gold text-night' : 'border-white/30 text-chalk hover:bg-white/10',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

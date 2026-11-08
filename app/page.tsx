import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import HomeHero, { type HeroTab } from '@/components/HomeHero'
import RecipeCard from '@/components/RecipeCard'
import { getSummaries } from '@/lib/library'
import type { RecipeSummary } from '@/lib/types'

const pick = (all: RecipeSummary[], slugs: string[]) =>
  slugs.map((s) => all.find((r) => r.slug === s)).filter((r): r is RecipeSummary => !!r)

function Shelf({ title, blurb, href, recipes }: { title: string; blurb: string; href: string; recipes: RecipeSummary[] }) {
  if (recipes.length === 0) return null
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-12" aria-label={title}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="display text-3xl md:text-5xl">{title}</h2>
          <p className="mt-2 max-w-prose text-muted-foreground">{blurb}</p>
        </div>
        <Link href={href} className="inline-flex min-h-11 items-center gap-1 font-bold underline underline-offset-4">
          See all <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-8 md:overflow-visible md:px-0">
        {recipes.slice(0, 8).map((r) => (
          <li key={r.slug} className="w-[62%] shrink-0 snap-start sm:w-[34%] md:w-auto">
            <RecipeCard recipe={r} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  const all = getSummaries()
  const nigeria = all.filter((r) => r.country === 'Nigeria')
  const classics = pick(all, ['suya', 'egusi-soup', 'jollof-rice', 'moi-moi', 'pounded-yam', 'efo-riro', 'puff-puff', 'akara'])
  // A dish appears on one shelf only, so the page never repeats itself.
  const shown = new Set(classics.map((r) => r.slug))
  const take = (list: RecipeSummary[]) => {
    const out = list.filter((r) => !shown.has(r.slug))
    out.slice(0, 8).forEach((r) => shown.add(r.slug))
    return out
  }
  const soups = take(nigeria.filter((r) => ['soup', 'side'].includes(r.course)))
  const street = take(nigeria.filter((r) => ['street-food', 'snack'].includes(r.course)))
  const rest = take(nigeria.filter((r) => !['soup', 'side', 'street-food', 'snack'].includes(r.course)))

  const tabs: HeroTab[] = [
    { id: 'street', label: 'Street food', recipes: pick(all, ['suya', 'akara', 'puff-puff', 'boli']) },
    { id: 'rice', label: 'Rice and one-pot', recipes: pick(all, ['ofada-rice-ayamase', 'jollof-rice', 'nigerian-fried-rice', 'coconut-rice']) },
    { id: 'soups', label: 'Soups and swallows', recipes: pick(all, ['egusi-soup', 'pounded-yam', 'efo-riro', 'afang-soup']) },
    { id: 'africa', label: 'Across Africa', recipes: pick(all, ['doro-wat', 'thieboudienne', 'chicken-yassa', 'waakye']) },
  ]
    .map((t) => ({ ...t, recipes: t.recipes.length ? t.recipes : all.slice(0, 4) }))

  return (
    <>
      <HomeHero tabs={tabs} />

      <Shelf
        title="Nigerian classics"
        blurb="The dishes you grew up on, or the ones you keep hearing about. Written out with real amounts and a way to tell when each step is done."
        href="/explore?country=Nigeria"
        recipes={classics}
      />

      <section className="night-ground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:py-16">
          <div>
            <h2 className="display text-3xl text-gold">Cook mode</h2>
            <p className="mt-3 text-chalk/90">One step at a time in big type, a timer when a step needs one, and the screen stays awake while your hands are busy.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-gold">Cannot find an ingredient?</h2>
            <p className="mt-3 text-chalk/90">Every recipe lists what to use instead of ogbono, iru, uziza or stockfish when you are cooking far from home.</p>
          </div>
          <div>
            <h2 className="display text-3xl text-gold">Plan the week</h2>
            <p className="mt-3 text-chalk/90">Build seven days of meals in one tap, then get a shopping list that adds the same ingredient up across every dish.</p>
            <Link href="/planner" className="mt-4 inline-flex min-h-11 items-center gap-1 font-bold text-gold underline underline-offset-4">
              Start a meal plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Shelf
        title="Soups and swallows"
        blurb="The pot at the centre of a Nigerian table, and the pounded yam, eba or amala you scoop it with."
        href="/explore?country=Nigeria&course=soup"
        recipes={soups}
      />
      <Shelf
        title="Street food and snacks"
        blurb="Smoky, spicy, fried and sweet. What you buy by the roadside, made in your own kitchen."
        href="/explore?country=Nigeria&course=street-food"
        recipes={street}
      />
      <Shelf
        title="Rice, one-pot and more"
        blurb="Party rice, porridges and the dishes that feed a crowd."
        href="/explore?country=Nigeria&course=main"
        recipes={rest}
      />
      <Shelf
        title="Across Africa"
        blurb="Ghana, Senegal, Ethiopia, Kenya, South Africa, Morocco and more. Each recipe says where the dish comes from."
        href="/explore"
        recipes={all.filter((r) => r.country !== 'Nigeria')}
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        <h2 className="display text-2xl">Browse by country</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {[...new Set(all.map((r) => r.country))].map((c) => (
            <li key={c}>
              <Link href={`/explore?country=${encodeURIComponent(c)}`} className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-bold hover:border-foreground/50">
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

'use client'

import { useMemo, useRef, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import RecipeCard from '@/components/RecipeCard'
import type { RecipeSummary } from '@/lib/types'
import { cn } from '@/lib/utils'

const COURSES: { id: string; label: string }[] = [
  { id: 'soup', label: 'Soups' },
  { id: 'main', label: 'Mains and rice' },
  { id: 'side', label: 'Swallows and sides' },
  { id: 'street-food', label: 'Street food' },
  { id: 'snack', label: 'Snacks' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'drink', label: 'Drinks' },
  { id: 'dessert', label: 'Dessert' },
]

const DIETS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenFree', label: 'Gluten free' },
]

const TIMES = [
  { id: '30', label: 'Under 30 min' },
  { id: '60', label: 'Under 1 hour' },
  { id: '120', label: 'Under 2 hours' },
]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors',
        active ? 'border-gold bg-gold text-night' : 'border-border bg-card text-foreground hover:border-foreground/50',
      )}
    >
      {children}
    </button>
  )
}

export default function ExploreClient({ recipes }: { recipes: RecipeSummary[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const q = params.get('q') ?? ''
  const country = params.get('country') ?? ''
  const course = params.get('course') ?? ''
  const diet = params.get('diet') ?? ''
  const time = params.get('time') ?? ''
  const mild = params.get('mild') === '1'
  const have = params.get('have') ?? ''

  useEffect(() => {
    if (params.get('focus') === 'search') inputRef.current?.focus()
  }, [params])

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search)
    next.delete('focus')
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const countries = useMemo(() => {
    const counts = new Map<string, number>()
    recipes.forEach((r) => counts.set(r.country, (counts.get(r.country) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => (a[0] === 'Nigeria' ? -1 : b[0] === 'Nigeria' ? 1 : b[1] - a[1] || a[0].localeCompare(b[0])))
  }, [recipes])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const owned = have
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    const scored = recipes
      .filter((r) => {
        if (country && r.country !== country) return false
        if (course && r.course !== course) return false
        if (diet && !r.diet[diet as keyof RecipeSummary['diet']]) return false
        if (time && r.totalMinutes > Number(time)) return false
        if (mild && r.spice > 1) return false
        if (needle) {
          const hay = `${r.name} ${r.localName ?? ''} ${r.country} ${r.tags.join(' ')} ${r.keywords.join(' ')}`.toLowerCase()
          if (!needle.split(/\s+/).every((w) => hay.includes(w))) return false
        }
        return true
      })
      .map((r) => ({
        r,
        hits: owned.length ? owned.filter((o) => r.keywords.some((k) => k.includes(o))).length : 0,
      }))
      .filter((x) => !owned.length || x.hits > 0)
    if (owned.length) scored.sort((a, b) => b.hits - a.hits)
    return scored
  }, [recipes, q, country, course, diet, time, mild, have])

  const active = [q, country, course, diet, time, mild ? '1' : '', have].filter(Boolean).length

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="relative block">
          <span className="sr-only">Search by dish, country or ingredient</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => set({ q: e.target.value || null })}
            placeholder="Search jollof, suya, Ghana, palm oil..."
            className="h-12 w-full rounded border border-input bg-card pl-10 pr-3 text-base"
            type="search"
          />
        </label>
        <label className="relative block">
          <span className="sr-only">Ingredients you have, separated by commas</span>
          <input
            value={have}
            onChange={(e) => set({ have: e.target.value || null })}
            placeholder="I have: tomatoes, rice, crayfish"
            className="h-12 w-full rounded border border-input bg-card px-3 text-base"
            type="text"
          />
        </label>
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Country">
        <Chip active={!country} onClick={() => set({ country: null })}>All countries</Chip>
        {countries.map(([c, n]) => (
          <Chip key={c} active={country === c} onClick={() => set({ country: country === c ? null : c })}>
            {c} <span className="tnum opacity-70">{n}</span>
          </Chip>
        ))}
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Type of dish">
        <Chip active={!course} onClick={() => set({ course: null })}>Everything</Chip>
        {COURSES.map((c) => (
          <Chip key={c.id} active={course === c.id} onClick={() => set({ course: course === c.id ? null : c.id })}>
            {c.label}
          </Chip>
        ))}
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Diet, time and spice">
        {DIETS.map((d) => (
          <Chip key={d.id} active={diet === d.id} onClick={() => set({ diet: diet === d.id ? null : d.id })}>
            {d.label}
          </Chip>
        ))}
        {TIMES.map((t) => (
          <Chip key={t.id} active={time === t.id} onClick={() => set({ time: time === t.id ? null : t.id })}>
            {t.label}
          </Chip>
        ))}
        <Chip active={mild} onClick={() => set({ mild: mild ? null : '1' })}>Mild</Chip>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3" aria-live="polite">
        <p className="font-semibold tnum">
          {results.length} {results.length === 1 ? 'recipe' : 'recipes'}
        </p>
        {active > 0 && (
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-1 rounded px-2 text-sm font-semibold underline underline-offset-4"
            onClick={() => router.replace(pathname, { scroll: false })}
          >
            <X className="h-4 w-4" aria-hidden="true" /> Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {results.map(({ r, hits }, i) => (
            <li key={r.slug}>
              <RecipeCard recipe={r} priority={i < 4} />
              {have && hits > 0 && <p className="mt-1 text-xs font-semibold text-leaf">Uses {hits} of your ingredients</p>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-border bg-card p-6">
          <p className="display text-2xl">Nothing matches that</p>
          <p className="mt-2 text-muted-foreground">Try a shorter search, or clear a filter. Ingredient search matches parts of words, so "pepper" finds scotch bonnet and black pepper.</p>
        </div>
      )}
    </div>
  )
}

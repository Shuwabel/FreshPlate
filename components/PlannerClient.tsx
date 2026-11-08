'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, Shuffle, ShoppingBasket, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DAY_LABELS, SLOTS, generatePlan, plannedSlugs, type PlanOptions } from '@/lib/planner'
import { newPlanId, useFreshPlate } from '@/lib/store'
import type { IngredientGroup, MealSlot, RecipeSummary } from '@/lib/types'
import { cn } from '@/lib/utils'

const SLOT_COURSES: Record<MealSlot, RecipeSummary['course'][]> = {
  breakfast: ['breakfast', 'snack', 'street-food', 'side'],
  lunch: ['main', 'soup', 'side', 'street-food'],
  dinner: ['main', 'soup', 'side'],
}

function Segment<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="billing mb-1 text-muted-foreground">{label}</legend>
      <div className="inline-flex border border-border">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn('min-h-11 px-4 text-sm font-bold', value === o.id ? 'bg-night text-gold dark:bg-gold dark:text-night' : 'bg-card hover:bg-muted')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function PlannerClient({ recipes }: { recipes: RecipeSummary[] }) {
  const { plans, activePlanId, savePlan, removePlan, setActivePlan, setMeal, addToList } = useFreshPlate()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const [opts, setOpts] = useState<Omit<PlanOptions, 'seed'>>({ diet: 'all', focus: 'nigerian', maxSpice: 3, servings: 4 })
  const [swap, setSwap] = useState<{ day: number; slot: MealSlot } | null>(null)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)

  const bySlug = useMemo(() => new Map(recipes.map((r) => [r.slug, r])), [recipes])
  const plan = ready ? (plans.find((p) => p.id === activePlanId) ?? plans[0]) : undefined

  const create = () => {
    const id = newPlanId()
    const created = generatePlan(recipes, { ...opts, seed: Date.now() }, id, `Week plan ${plans.length + 1}`)
    savePlan(created)
    toast.success('Your week is ready')
  }

  const shuffle = () => {
    if (!plan) return
    const next = generatePlan(recipes, { ...opts, seed: Date.now() }, plan.id, plan.name)
    savePlan({ ...next, createdAt: plan.createdAt })
  }

  const addWeekToList = async () => {
    if (!plan) return
    setBusy(true)
    try {
      const slugs = plannedSlugs(plan)
      const loaded = await Promise.all(
        slugs.map(async (slug) => {
          const res = await fetch(`/data/recipes/${slug}.json`)
          if (!res.ok) throw new Error(slug)
          return (await res.json()) as { slug: string; name: string; servings: number; ingredients: IngredientGroup[] }
        }),
      )
      loaded.forEach((r) => addToList({ slug: r.slug, name: r.name, baseServings: r.servings, servings: plan.servings, ingredients: r.ingredients }))
      toast.success(`Added ${loaded.length} dishes to your shopping list`, { action: { label: 'Open list', onClick: () => (window.location.href = '/shopping') } })
    } catch {
      toast.error('Could not load every recipe. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!plan) return
    const lines = [`${plan.name} (${plan.servings} servings)`, '']
    plan.days.forEach((d, i) => {
      lines.push(DAY_LABELS[i])
      SLOTS.forEach((s) => lines.push(`  ${s[0].toUpperCase() + s.slice(1)}: ${d[s] ? (bySlug.get(d[s]!)?.name ?? d[s]) : '-'}`))
      lines.push('')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'freshplate-meal-plan.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const swapChoices = useMemo(() => {
    if (!swap) return []
    const q = query.trim().toLowerCase()
    return recipes
      .filter((r) => SLOT_COURSES[swap.slot].includes(r.course))
      .filter((r) => !q || `${r.name} ${r.country}`.toLowerCase().includes(q))
  }, [swap, query, recipes])

  return (
    <div>
      <section aria-labelledby="opts-h" className="border border-border bg-card p-4 md:p-6">
        <h2 id="opts-h" className="display text-2xl">{plan ? 'Make a new week' : 'Build your week'}</h2>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-4">
          <Segment
            label="Food"
            value={opts.focus}
            options={[{ id: 'nigerian', label: 'Mostly Nigerian' }, { id: 'africa', label: 'All of Africa' }]}
            onChange={(focus) => setOpts((o) => ({ ...o, focus }))}
          />
          <Segment
            label="Diet"
            value={opts.diet}
            options={[{ id: 'all', label: 'Anything' }, { id: 'vegetarian', label: 'Vegetarian' }, { id: 'vegan', label: 'Vegan' }]}
            onChange={(diet) => setOpts((o) => ({ ...o, diet }))}
          />
          <Segment
            label="Heat"
            value={String(opts.maxSpice) as '1' | '3'}
            options={[{ id: '1', label: 'Mild only' }, { id: '3', label: 'Bring the pepper' }]}
            onChange={(v) => setOpts((o) => ({ ...o, maxSpice: Number(v) }))}
          />
          <div>
            <label htmlFor="serv" className="billing mb-1 block text-muted-foreground">Servings per meal</label>
            <input
              id="serv"
              type="number"
              min={1}
              max={12}
              value={opts.servings}
              onChange={(e) => setOpts((o) => ({ ...o, servings: Math.min(12, Math.max(1, Number(e.target.value) || 1)) }))}
              className="h-11 w-24 border border-border bg-background px-3 tnum"
            />
          </div>
          <Button size="lg" onClick={create} className="bg-crimson text-primary-foreground hover:bg-crimson-deep">
            <Plus /> {plan ? 'Create another' : 'Generate my week'}
          </Button>
        </div>
      </section>

      {plan && (
        <section className="mt-8" aria-label={plan.name}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {plans.length > 1 && (
                <label className="flex items-center gap-2">
                  <span className="sr-only">Choose a plan</span>
                  <select
                    value={plan.id}
                    onChange={(e) => setActivePlan(e.target.value)}
                    className="h-11 border border-border bg-card px-3 font-bold"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <h2 className="display text-3xl">{plan.name}</h2>
              <p className="text-sm text-muted-foreground tnum">{plan.servings} servings per meal</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={shuffle}><Shuffle /> Shuffle</Button>
              <Button variant="outline" onClick={download}><Download /> Download</Button>
              <Button onClick={addWeekToList} disabled={busy}><ShoppingBasket /> {busy ? 'Adding...' : 'Add week to shopping list'}</Button>
              <Button
                variant="ghost"
                aria-label={`Delete ${plan.name}`}
                onClick={() => {
                  const keep = plan
                  removePlan(plan.id)
                  toast(`Deleted ${keep.name}`, { action: { label: 'Undo', onClick: () => savePlan(keep) } })
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>

          <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plan.days.map((day, di) => (
              <li key={di} className="border border-border bg-card">
                <h3 className="display border-b border-border bg-night px-3 py-2 text-lg text-gold">{DAY_LABELS[di]}</h3>
                <ul className="divide-y divide-border">
                  {SLOTS.map((slot) => {
                    const r = day[slot] ? bySlug.get(day[slot]!) : undefined
                    return (
                      <li key={slot} className="flex items-center gap-3 p-3">
                        {r ? (
                          <Link href={`/recipe/${r.slug}`} className="relative h-14 w-14 shrink-0 overflow-hidden bg-night" aria-hidden="true" tabIndex={-1}>
                            <Image src={r.image.file} alt="" fill sizes="56px" className="object-cover" />
                          </Link>
                        ) : (
                          <span className="grid h-14 w-14 shrink-0 place-items-center bg-muted text-muted-foreground" aria-hidden="true">?</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="billing text-muted-foreground">{slot}</p>
                          {r ? (
                            <Link href={`/recipe/${r.slug}`} className="block truncate font-bold hover:underline">{r.name}</Link>
                          ) : (
                            <p className="text-muted-foreground">Nothing planned</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="min-h-11" onClick={() => { setQuery(''); setSwap({ day: di, slot }) }}>
                          {r ? 'Swap' : 'Add'}
                        </Button>
                        {r && (
                          <Button variant="ghost" size="icon" className="h-11 w-11" aria-label={`Clear ${slot} on ${DAY_LABELS[di]}`} onClick={() => setMeal(plan.id, di, slot, null)}>
                            <X />
                          </Button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!plan && ready && (
        <p className="mt-8 max-w-prose text-muted-foreground">
          Choose what you like and generate seven days of breakfast, lunch and dinner. You can swap any meal after, then send the whole week to your shopping list.
        </p>
      )}

      <Dialog open={!!swap} onOpenChange={(o) => !o && setSwap(null)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="display text-2xl">
              Choose {swap?.slot} for {swap ? DAY_LABELS[swap.day] : ''}
            </DialogTitle>
            <DialogDescription>Showing dishes that suit this meal.</DialogDescription>
          </DialogHeader>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search dishes"
            className="h-11 w-full border border-input bg-background px-3"
          />
          <ul className="divide-y divide-border">
            {swapChoices.map((r) => (
              <li key={r.slug}>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center gap-3 py-2 text-left hover:bg-muted"
                  onClick={() => {
                    if (plan && swap) setMeal(plan.id, swap.day, swap.slot, r.slug)
                    setSwap(null)
                  }}
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-night">
                    <Image src={r.image.file} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{r.name}</span>
                    <span className="block text-sm text-muted-foreground">{r.country} · {r.totalMinutes} min</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  )
}

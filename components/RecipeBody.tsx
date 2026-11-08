'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, Minus, Plus, ShoppingBasket, Timer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import RecipeTimer from '@/components/RecipeTimer'
import { scaleAmount } from '@/lib/scale'
import { useFreshPlate } from '@/lib/store'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function RecipeBody({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.servings)
  const [ticked, setTicked] = useState<Record<string, boolean>>({})
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({})
  const addToList = useFreshPlate((s) => s.addToList)
  const pushRecent = useFreshPlate((s) => s.pushRecent)
  const factor = servings / recipe.servings

  useEffect(() => pushRecent(recipe.slug), [pushRecent, recipe.slug])

  const total = useMemo(() => recipe.ingredients.reduce((n, g) => n + g.items.length, 0), [recipe])
  const have = Object.values(ticked).filter(Boolean).length

  const addAll = () => {
    addToList({
      slug: recipe.slug,
      name: recipe.name,
      baseServings: recipe.servings,
      servings,
      ingredients: recipe.ingredients,
    })
    toast.success(`Added ${recipe.name} to your shopping list`, { action: { label: 'Open list', onClick: () => (window.location.href = '/shopping') } })
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section aria-labelledby="ingredients-h" className="lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-end justify-between gap-3">
          <h2 id="ingredients-h" className="display text-3xl">Ingredients</h2>
          <p className="tnum text-sm font-semibold text-muted-foreground">
            {have} of {total} ticked
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border border-border bg-card p-2" role="group" aria-label="Servings">
          <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Fewer servings">
            <Minus />
          </Button>
          <p className="text-center" aria-live="polite">
            <span className="display tnum text-2xl">{servings}</span>
            <span className="ml-2 font-semibold">{servings === 1 ? 'serving' : 'servings'}</span>
            {servings !== recipe.servings && <span className="block text-xs text-muted-foreground">Recipe makes {recipe.servings}</span>}
          </p>
          <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => setServings((s) => Math.min(40, s + 1))} aria-label="More servings">
            <Plus />
          </Button>
        </div>
        {servings !== recipe.servings && (
          <p className="mt-2 text-sm text-muted-foreground">
            Amounts are scaled. Oil, salt and pepper do not scale in a straight line, so taste before you add the full amount.
          </p>
        )}

        <div className="mt-4 space-y-5">
          {recipe.ingredients.map((group, gi) => (
            <div key={gi}>
              {group.group && <h3 className="billing mb-1 text-crimson dark:text-gold">{group.group}</h3>}
              <ul className="divide-y divide-border border-y border-border">
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`
                  const on = !!ticked[id]
                  return (
                    <li key={id}>
                      <label className="flex min-h-12 cursor-pointer items-start gap-3 py-2">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={on}
                          onChange={() => setTicked((t) => ({ ...t, [id]: !t[id] }))}
                        />
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded border-2 border-foreground/60 peer-checked:border-leaf peer-checked:bg-leaf peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-deep"
                        >
                          {on && <Check className="h-4 w-4 text-white" />}
                        </span>
                        <span className={cn('min-w-0 flex-1', on && 'text-muted-foreground line-through')}>
                          <span className="font-bold tnum">{scaleAmount(item.amount, factor)}</span> {item.name}
                          {item.note && <span className="text-muted-foreground">, {item.note}</span>}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <Button className="no-print mt-4 w-full" size="lg" variant="outline" onClick={addAll}>
          <ShoppingBasket /> Add to shopping list
        </Button>
      </section>

      <section aria-labelledby="method-h">
        <div className="flex items-end justify-between gap-3">
          <h2 id="method-h" className="display text-3xl">Method</h2>
          <Button asChild className="no-print bg-crimson text-primary-foreground hover:bg-crimson-deep">
            <Link href={`/recipe/${recipe.slug}/cook?servings=${servings}`}>Cook mode</Link>
          </Button>
        </div>
        <ol className="mt-4 space-y-4">
          {recipe.steps.map((step, i) => {
            const done = !!doneSteps[i]
            return (
              <li key={i} className={cn('flex gap-4 border border-border bg-card p-4', done && 'bg-muted')}>
                <button
                  type="button"
                  aria-pressed={done}
                  aria-label={`Mark step ${i + 1} done`}
                  onClick={() => setDoneSteps((d) => ({ ...d, [i]: !d[i] }))}
                  className={cn(
                    'display grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg',
                    done ? 'bg-leaf text-white' : 'bg-night text-gold',
                  )}
                >
                  {done ? <Check className="h-5 w-5" aria-hidden="true" /> : i + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={cn('text-lg font-bold leading-tight', done && 'line-through')}>{step.title}</h3>
                  <p className="mt-1 max-w-prose text-[1.05rem] leading-relaxed">{step.text}</p>
                  {step.minutes ? (
                    <div className="no-print mt-3">
                      <RecipeTimer minutes={step.minutes} label={`${step.title} timer`} />
                    </div>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
        <p className="no-print mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="h-4 w-4" aria-hidden="true" /> Tap a number to tick off a step. Steps with a time have their own timer.
        </p>
      </section>
    </div>
  )
}

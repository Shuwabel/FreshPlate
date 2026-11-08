'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ListChecks, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import RecipeTimer from '@/components/RecipeTimer'
import { scaleAmount } from '@/lib/scale'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'

/** One step at a time, big enough to read from the other side of the stove, screen kept awake. */
export default function CookMode({ recipe, servings }: { recipe: Recipe; servings: number }) {
  const [i, setI] = useState(0)
  const [awake, setAwake] = useState<'on' | 'off' | 'unsupported'>('off')
  const last = recipe.steps.length - 1
  const factor = servings / recipe.servings
  const step = recipe.steps[i]

  const go = useCallback((n: number) => setI((cur) => Math.min(last + 1, Math.max(0, cur + n))), [last])

  // Keep the screen on. The lock is released when the tab is hidden, so ask again when it returns.
  useEffect(() => {
    if (!('wakeLock' in navigator)) {
      setAwake('unsupported')
      return
    }
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    const request = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
        if (!cancelled) setAwake('on')
        lock.addEventListener('release', () => !cancelled && setAwake('off'))
      } catch {
        if (!cancelled) setAwake('off')
      }
    }
    request()
    const onVisible = () => document.visibilityState === 'visible' && request()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const finished = i > last

  return (
    <div className="night-ground fixed inset-0 z-[60] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Button asChild variant="ghost" className="min-h-11 text-chalk hover:bg-white/10 hover:text-chalk">
          <Link href={`/recipe/${recipe.slug}`}>
            <X /> Leave
          </Link>
        </Button>
        <p className="billing text-gold">{recipe.name}</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="min-h-11 text-chalk hover:bg-white/10 hover:text-chalk">
              <ListChecks /> Ingredients
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="display text-2xl">Ingredients for {servings}</SheetTitle>
              <SheetDescription>{servings !== recipe.servings ? `Scaled from ${recipe.servings} servings.` : 'As written.'}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              {recipe.ingredients.map((g, gi) => (
                <div key={gi}>
                  {g.group && <h3 className="billing mb-1 text-crimson dark:text-gold">{g.group}</h3>}
                  <ul className="divide-y divide-border border-y border-border">
                    {g.items.map((it, ii) => (
                      <li key={ii} className="py-2 text-lg">
                        <span className="font-bold tnum">{scaleAmount(it.amount, factor)}</span> {it.name}
                        {it.note && <span className="text-muted-foreground">, {it.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="px-4" role="progressbar" aria-valuemin={0} aria-valuemax={recipe.steps.length} aria-valuenow={Math.min(i, recipe.steps.length)} aria-label="Progress">
        <div className="flex gap-1">
          {recipe.steps.map((_, n) => (
            <span key={n} className={cn('h-1.5 flex-1 rounded-full', n < i ? 'bg-gold' : n === i ? 'bg-chalk' : 'bg-white/20')} />
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-8" aria-live="polite">
        {finished ? (
          <div>
            <h1 className="poster-title text-5xl md:text-7xl">Enjoy your {recipe.name}</h1>
            <p className="mt-5 max-w-prose text-xl text-chalk/90">That was the last step. Serve it while it is hot, and taste again for salt and pepper at the table.</p>
            {recipe.servesWith.length > 0 && <p className="mt-3 text-chalk/80">Pairs well with the dishes listed on the recipe page.</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-night hover:bg-gold-deep">
                <Link href={`/recipe/${recipe.slug}`}>Back to the recipe</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-chalk hover:bg-white/10 hover:text-chalk" onClick={() => setI(0)}>
                Start again
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="billing text-gold">
              Step {i + 1} of {recipe.steps.length}
            </p>
            <h1 className="display mt-2 text-4xl text-chalk md:text-6xl">{step.title}</h1>
            <p className="mt-5 text-2xl leading-snug md:text-3xl">{step.text}</p>
            {step.minutes ? (
              <div className="mt-6">
                <RecipeTimer key={i} minutes={step.minutes} label={`${step.title} timer`} large />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {!finished && (
        <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-white/10 bg-night p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 border-white/30 bg-transparent text-xl text-chalk hover:bg-white/10 hover:text-chalk"
            onClick={() => go(-1)}
            disabled={i === 0}
          >
            <ArrowLeft /> Back
          </Button>
          <Button size="lg" className="min-h-16 bg-gold text-xl text-night hover:bg-gold-deep" onClick={() => go(1)}>
            {i === last ? 'Finish' : 'Next'} <ArrowRight />
          </Button>
        </div>
      )}
      <p className="sr-only" role="status">
        {awake === 'on' ? 'Screen will stay awake while you cook.' : awake === 'unsupported' ? 'Your browser cannot keep the screen awake.' : ''}
      </p>
    </div>
  )
}

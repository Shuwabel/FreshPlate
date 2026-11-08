'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, MessageCircle, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AISLE_ORDER, aisleFor, buildShoppingList, type Aisle } from '@/lib/shopping'
import { useFreshPlate } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function ShoppingClient() {
  const { listSources, customItems, ticked, toggleTick, clearTicked, clearList, removeFromList, addCustomItem, removeCustomItem } = useFreshPlate()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const lines = useMemo(() => {
    const merged = buildShoppingList(listSources.map((s) => ({ recipe: { name: s.name, servings: s.baseServings, ingredients: s.ingredients }, servings: s.servings })))
    const custom = customItems.map((c) => ({ name: c.name, amount: c.amount, from: [] as string[], custom: true, id: c.id }))
    return [...merged.map((m) => ({ ...m, id: undefined as string | undefined })), ...custom].map((l) => ({
      ...l,
      key: `${l.name.toLowerCase()}|${l.custom ? l.id : ''}`,
      aisle: aisleFor(l.name),
    }))
  }, [listSources, customItems])

  const grouped = useMemo(() => {
    const map = new Map<Aisle, typeof lines>()
    for (const l of lines) map.set(l.aisle, [...(map.get(l.aisle) ?? []), l])
    return AISLE_ORDER.filter((a) => map.has(a)).map((a) => ({ aisle: a, items: map.get(a)!.sort((x, y) => x.name.localeCompare(y.name)) }))
  }, [lines])

  const done = lines.filter((l) => ticked[l.key]).length
  const asText = () =>
    grouped
      .map((g) => `${g.aisle}\n${g.items.filter((i) => !ticked[i.key]).map((i) => `- ${i.amount ? i.amount + ' ' : ''}${i.name}`).join('\n')}`)
      .filter((block) => block.includes('\n-'))
      .join('\n\n')

  if (!ready) return <p className="text-muted-foreground">Loading your list...</p>

  if (lines.length === 0) {
    return (
      <div className="border border-border bg-card p-6">
        <p className="display text-2xl">Your list is empty</p>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Open any recipe and press "Add to shopping list", or build a meal plan and add the whole week. Amounts for the same ingredient are added together.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild><Link href="/explore">Find a recipe</Link></Button>
          <Button asChild variant="outline"><Link href="/planner">Plan a week</Link></Button>
        </div>
        <form
          className="mt-6 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addCustomItem(name.trim(), amount.trim())
            setName('')
            setAmount('')
          }}
        >
          <label className="sr-only" htmlFor="c-name">Item</label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Add an item" className="h-11 flex-1 border border-input bg-background px-3" />
          <Button type="submit" variant="outline"><Plus /> Add</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="font-bold tnum">{done} of {lines.length} in the basket</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(asText())
                  toast.success('List copied')
                } catch {
                  toast.error('Could not copy. Select the text and copy it by hand.')
                }
              }}
            >
              <Copy /> Copy
            </Button>
            <Button asChild variant="outline">
              <a href={`https://wa.me/?text=${encodeURIComponent('Shopping list from FreshPlate\n\n' + asText())}`} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
            {done > 0 && <Button variant="ghost" onClick={clearTicked}>Untick all</Button>}
          </div>
        </div>

        <div className="mt-5 space-y-8">
          {grouped.map((g) => (
            <section key={g.aisle} aria-label={g.aisle}>
              <h2 className="display text-xl">{g.aisle}</h2>
              <ul className="mt-2 divide-y divide-border border-y border-border">
                {g.items.map((l) => {
                  const on = !!ticked[l.key]
                  return (
                    <li key={l.key} className="flex items-center gap-2">
                      <label className="flex min-h-14 flex-1 cursor-pointer items-center gap-3 py-2">
                        <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggleTick(l.key)} />
                        <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded border-2 border-foreground/60 peer-checked:border-leaf peer-checked:bg-leaf peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-deep">
                          {on && <Check className="h-5 w-5 text-white" />}
                        </span>
                        <span className={cn('min-w-0 flex-1', on && 'text-muted-foreground line-through')}>
                          <span className="font-bold tnum">{l.amount}</span> {l.name}
                          {l.from.length > 0 && <span className="block text-xs text-muted-foreground">for {l.from.join(', ')}</span>}
                        </span>
                      </label>
                      {l.custom && (
                        <Button variant="ghost" size="icon" className="h-11 w-11" aria-label={`Remove ${l.name}`} onClick={() => removeCustomItem(l.id!)}>
                          <X />
                        </Button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start" aria-label="List sources">
        <form
          className="border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addCustomItem(name.trim(), amount.trim())
            setName('')
            setAmount('')
          }}
        >
          <h2 className="display text-xl">Add your own</h2>
          <div className="mt-3 grid grid-cols-[1fr_6rem] gap-2">
            <label className="sr-only" htmlFor="name">Item</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item" className="h-11 min-w-0 border border-input bg-background px-3" />
            <label className="sr-only" htmlFor="amt">Amount</label>
            <input id="amt" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="h-11 min-w-0 border border-input bg-background px-3" />
          </div>
          <Button type="submit" className="mt-3 w-full" variant="outline"><Plus /> Add to list</Button>
        </form>

        <div className="border border-border bg-card p-4">
          <h2 className="display text-xl">On this list</h2>
          <ul className="mt-3 space-y-2">
            {listSources.map((s) => (
              <li key={s.slug} className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <Link href={`/recipe/${s.slug}`} className="block truncate font-bold hover:underline">{s.name}</Link>
                  <span className="text-xs text-muted-foreground tnum">{s.servings} servings</span>
                </span>
                <Button variant="ghost" size="icon" className="h-11 w-11" aria-label={`Remove ${s.name} from list`} onClick={() => removeFromList(s.slug)}>
                  <X />
                </Button>
              </li>
            ))}
            {listSources.length === 0 && <li className="text-sm text-muted-foreground">Only your own items.</li>}
          </ul>
          <Button
            variant="ghost"
            className="mt-3 w-full text-destructive"
            onClick={() => {
              clearList()
              toast('List cleared')
            }}
          >
            <Trash2 /> Clear everything
          </Button>
        </div>
      </aside>
    </div>
  )
}

import type { Metadata } from 'next'
import ShoppingClient from '@/components/ShoppingClient'

export const metadata: Metadata = {
  title: 'Shopping list',
  description: 'A shopping list that adds up the same ingredient across every recipe and groups it by where you find it.',
}

export default function ShoppingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="display text-4xl md:text-6xl">Shopping list</h1>
      <p className="mt-2 max-w-prose text-lg text-muted-foreground">Ingredients from every recipe you add, added together and grouped by aisle. Ticks stay on this phone.</p>
      <div className="mt-6">
        <ShoppingClient />
      </div>
    </div>
  )
}

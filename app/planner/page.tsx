import type { Metadata } from 'next'
import PlannerClient from '@/components/PlannerClient'
import { getSummaries } from '@/lib/library'

export const metadata: Metadata = {
  title: 'Weekly meal plan',
  description: 'Generate a seven-day plan of Nigerian and African meals, swap any dish, and send the week to a shopping list.',
}

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="display text-4xl md:text-6xl">Meal plan</h1>
      <p className="mt-2 max-w-prose text-lg text-muted-foreground">Seven days of breakfast, lunch and dinner in one tap. Plans are saved in this browser.</p>
      <div className="mt-6">
        <PlannerClient recipes={getSummaries()} />
      </div>
    </div>
  )
}

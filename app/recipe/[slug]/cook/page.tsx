import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CookMode from '@/components/CookMode'
import { getRecipe, getSlugs } from '@/lib/library'

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const r = getRecipe(slug)
  return { title: r ? `Cook ${r.name}` : 'Cook mode', robots: { index: false } }
}

export default async function CookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ servings?: string }>
}) {
  const { slug } = await params
  const { servings } = await searchParams
  const recipe = getRecipe(slug)
  if (!recipe) notFound()
  const n = Number(servings)
  return <CookMode recipe={recipe} servings={Number.isFinite(n) && n >= 1 && n <= 40 ? Math.round(n) : recipe.servings} />
}

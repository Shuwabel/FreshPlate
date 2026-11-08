import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChefHat, Clock, Printer, Users } from 'lucide-react'
import FavouriteButton from '@/components/FavouriteButton'
import PrintButton from '@/components/PrintButton'
import RecipeBody from '@/components/RecipeBody'
import RecipeCard, { SpiceMark } from '@/components/RecipeCard'
import YoutubeFacade from '@/components/YoutubeFacade'
import { Button } from '@/components/ui/button'
import { getRecipe, getSlugs, getSummaries } from '@/lib/library'

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const r = getRecipe(slug)
  if (!r) return {}
  return {
    title: `${r.name}: how to cook it`,
    description: r.summary,
    openGraph: { title: r.name, description: r.summary, type: 'article', images: [{ url: r.image.file, width: r.image.width, height: r.image.height, alt: r.image.alt }] },
  }
}

function minutes(total: number): string {
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) notFound()

  const summaries = getSummaries()
  const pairs = recipe.servesWith.map((s) => summaries.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x)
  const more = summaries.filter((s) => s.slug !== recipe.slug && s.country === recipe.country && !recipe.servesWith.includes(s.slug)).slice(0, 4)
  const total = recipe.prepMinutes + recipe.cookMinutes

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.summary,
    image: [recipe.image.file],
    recipeCuisine: recipe.country,
    prepTime: `PT${recipe.prepMinutes}M`,
    cookTime: `PT${recipe.cookMinutes}M`,
    totalTime: `PT${total}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients.flatMap((g) => g.items.map((i) => `${i.amount} ${i.name}`)),
    recipeInstructions: recipe.steps.map((s) => ({ '@type': 'HowToStep', name: s.title, text: s.text })),
    nutrition: { '@type': 'NutritionInformation', calories: `${recipe.nutrition.calories} calories` },
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      {/* The poster: this dish is tonight's feature. */}
      <header className="night-ground">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-10 md:py-12">
          <div className="vignette relative aspect-[4/3] overflow-hidden bg-night-2 md:order-2">
            <Image src={recipe.image.file} alt={recipe.image.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="md:order-1">
            <p className="billing text-gold">
              <Link href={`/explore?country=${encodeURIComponent(recipe.country)}`} className="underline underline-offset-4">
                {recipe.country}
              </Link>{' '}
              · {recipe.region}
            </p>
            <h1 className="poster-title mt-3 text-5xl md:text-7xl">{recipe.name}</h1>
            {recipe.localName && <p className="mt-3 text-lg italic text-chalk/85">{recipe.localName}</p>}
            <p className="mt-4 max-w-prose text-lg text-chalk/90">{recipe.summary}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-white/20 py-4 sm:grid-cols-4">
              <div>
                <dt className="billing text-gold">Runtime</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-bold tnum"><Clock className="h-4 w-4" aria-hidden="true" />{minutes(total)}</dd>
              </div>
              <div>
                <dt className="billing text-gold">Serves</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-bold tnum"><Users className="h-4 w-4" aria-hidden="true" />{recipe.servings}</dd>
              </div>
              <div>
                <dt className="billing text-gold">Level</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-bold"><ChefHat className="h-4 w-4" aria-hidden="true" />{recipe.difficulty}</dd>
              </div>
              <div>
                <dt className="billing text-gold">Heat</dt>
                <dd className="mt-0.5 font-bold">{recipe.spice === 0 ? 'Mild' : <SpiceMark level={recipe.spice} className="text-gold" />}</dd>
              </div>
            </dl>

            <div className="no-print mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-night hover:bg-gold-deep">
                <Link href={`/recipe/${recipe.slug}/cook`}>Start cooking</Link>
              </Button>
              <FavouriteButton slug={recipe.slug} name={recipe.name} label className="h-12 border border-white/30" />
              <PrintButton />
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {recipe.tags.map((t) => (
                <li key={t} className="rounded-full border border-white/25 px-3 py-1 text-xs font-semibold capitalize text-chalk/90">{t}</li>
              ))}
              {recipe.diet.vegan && <li className="rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white">Vegan</li>}
              {!recipe.diet.vegan && recipe.diet.vegetarian && <li className="rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white">Vegetarian</li>}
              {recipe.diet.glutenFree && <li className="rounded-full bg-night-2 px-3 py-1 text-xs font-bold text-chalk ring-1 ring-white/30">Gluten free</li>}
            </ul>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:py-14">
        <section aria-labelledby="about-h" className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="about-h" className="display text-3xl">About this dish</h2>
            <p className="mt-3 max-w-prose text-lg leading-relaxed">{recipe.story}</p>
          </div>
          {recipe.video && (
            <div className="no-print">
              <YoutubeFacade video={recipe.video} dish={recipe.name} />
            </div>
          )}
        </section>

        <RecipeBody recipe={recipe} />

        <div className="grid gap-8 md:grid-cols-2">
          {recipe.tips.length > 0 && (
            <section aria-labelledby="tips-h" className="border border-border bg-card p-5">
              <h2 id="tips-h" className="display text-2xl">Cook's tips</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {recipe.tips.map((t) => <li key={t} className="max-w-prose">{t}</li>)}
              </ul>
            </section>
          )}
          {recipe.swaps.length > 0 && (
            <section aria-labelledby="swaps-h" className="border border-border bg-card p-5">
              <h2 id="swaps-h" className="display text-2xl">Cannot find it? Swap it</h2>
              <dl className="mt-3 space-y-3">
                {recipe.swaps.map((s) => (
                  <div key={s.ingredient}>
                    <dt className="font-bold">{s.ingredient}</dt>
                    <dd className="max-w-prose text-muted-foreground">{s.swap}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <section aria-labelledby="nutrition-h" className="border border-border bg-card p-5">
          <h2 id="nutrition-h" className="display text-2xl">Roughly, per serving</h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['Calories', recipe.nutrition.calories, ''],
              ['Protein', recipe.nutrition.proteinG, 'g'],
              ['Carbs', recipe.nutrition.carbsG, 'g'],
              ['Fat', recipe.nutrition.fatG, 'g'],
            ].map(([label, value, unit]) => (
              <div key={label as string}>
                <dt className="billing text-muted-foreground">{label}</dt>
                <dd className="display tnum text-2xl">{value}{unit}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted-foreground">These are estimates from typical ingredients. They change with the brands, oil and portion sizes you use.</p>
        </section>

        {pairs.length > 0 && (
          <section aria-labelledby="pair-h" className="no-print">
            <h2 id="pair-h" className="display text-3xl">Serve it with</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
              {pairs.map((r) => (
                <li key={r.slug}><RecipeCard recipe={r} /></li>
              ))}
            </ul>
          </section>
        )}

        {more.length > 0 && (
          <section aria-labelledby="more-h" className="no-print">
            <h2 id="more-h" className="display text-3xl">More from {recipe.country}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
              {more.map((r) => (
                <li key={r.slug}><RecipeCard recipe={r} /></li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-sm text-muted-foreground">
          Photo: {recipe.image.title.replace(/^File:/, '')} by {recipe.image.author}, {recipe.image.license}.{' '}
          <a href={recipe.image.sourceUrl} className="underline underline-offset-4" target="_blank" rel="noreferrer">
            Source
          </a>
          {recipe.video && <> · Video tutorial: {recipe.video.channel} on YouTube.</>}
        </p>
      </div>
    </article>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Flame, PlayCircle } from 'lucide-react'
import FavouriteButton from '@/components/FavouriteButton'
import type { RecipeSummary } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SpiceMark({ level, className }: { level: number; className?: string }) {
  if (level <= 0) return null
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`Spice level ${level} of 3`}>
      {Array.from({ length: level }).map((_, i) => (
        <Flame key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      ))}
    </span>
  )
}

/** A dish presented like a poster: photo in a cut-corner frame, title on a night strip. */
export default function RecipeCard({
  recipe,
  priority = false,
  className,
}: {
  recipe: RecipeSummary
  priority?: boolean
  className?: string
}) {
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/recipe/${recipe.slug}`} className="block focus-visible:outline-offset-4">
        <div className="vignette relative aspect-[4/5] overflow-hidden bg-night">
          <Image
            src={recipe.image.file}
            alt={recipe.image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/85 to-transparent px-3 pb-3 pt-12 text-chalk">
            <h3 className="display text-lg leading-tight text-chalk md:text-xl">{recipe.name}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-chalk/85">
              <span>{recipe.country}</span>
              <span className="inline-flex items-center gap-1 tnum">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {recipe.totalMinutes >= 60 ? `${Math.floor(recipe.totalMinutes / 60)}h ${recipe.totalMinutes % 60 || ''}${recipe.totalMinutes % 60 ? 'm' : ''}`.trim() : `${recipe.totalMinutes}m`}
              </span>
              <SpiceMark level={recipe.spice} className="text-gold" />
              {recipe.hasVideo && (
                <span className="inline-flex items-center gap-1 text-gold">
                  <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Video
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>
      <FavouriteButton slug={recipe.slug} name={recipe.name} className="absolute right-2 top-2" />
    </article>
  )
}

'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useFreshPlate } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function FavouriteButton({
  slug,
  name,
  className,
  label = false,
}: {
  slug: string
  name: string
  className?: string
  label?: boolean
}) {
  const favourites = useFreshPlate((s) => s.favourites)
  const toggle = useFreshPlate((s) => s.toggleFavourite)
  // Stored in the browser, so the first server render never knows. Avoid a hydration mismatch.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const saved = ready && favourites.includes(slug)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={() => {
        toggle(slug)
        toast(saved ? `Removed ${name} from saved` : `Saved ${name}`)
      }}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-night/80 px-3 text-chalk backdrop-blur transition-colors hover:bg-night',
        label && 'rounded px-4 font-bold',
        className,
      )}
    >
      <Heart className={cn('h-5 w-5', saved && 'fill-crimson text-crimson')} aria-hidden="true" />
      {label && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  )
}

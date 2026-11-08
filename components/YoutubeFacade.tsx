'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import type { DishVideo } from '@/lib/types'

function duration(sec: number): string {
  const m = Math.round(sec / 60)
  return `${m} min`
}

/**
 * Shows a poster and loads YouTube only when tapped, so the page stays light on mobile data
 * and no YouTube cookies are set until the visitor chooses to watch.
 */
export default function YoutubeFacade({ video, dish }: { video: DishVideo; dish: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden bg-night">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={`${dish}: ${video.title}`}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid place-items-center text-chalk"
            aria-label={`Play video tutorial: ${video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-crimson shadow-lg transition-transform group-hover:scale-105">
              <Play className="h-7 w-7 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-muted-foreground">
        Video by <span className="font-semibold text-foreground">{video.channel}</span>, {duration(video.durationSec)}. Plays from YouTube when you press play.
      </figcaption>
    </figure>
  )
}

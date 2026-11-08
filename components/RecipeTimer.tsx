'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

function fmt(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

/** A simple step timer. It keeps time from the clock, so a locked phone does not lose it. */
export default function RecipeTimer({ minutes, label, large = false }: { minutes: number; label: string; large?: boolean }) {
  const full = Math.round(minutes * 60)
  const [left, setLeft] = useState(full)
  const [running, setRunning] = useState(false)
  const endsAt = useRef<number | null>(null)
  const announced = useRef(false)

  useEffect(() => {
    setLeft(full)
    setRunning(false)
    announced.current = false
  }, [full])

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const remaining = Math.max(0, Math.round(((endsAt.current ?? Date.now()) - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining === 0) {
        setRunning(false)
        if (!announced.current) {
          announced.current = true
          try {
            navigator.vibrate?.([300, 150, 300])
          } catch {
            /* not supported */
          }
        }
      }
    }
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [running])

  const toggle = () => {
    if (running) {
      setRunning(false)
    } else {
      announced.current = false
      endsAt.current = Date.now() + (left === 0 ? full : left) * 1000
      if (left === 0) setLeft(full)
      setRunning(true)
    }
  }

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <Button
        type="button"
        variant="outline"
        size={large ? 'lg' : 'default'}
        onClick={toggle}
        className={large ? 'min-h-14 min-w-36 border-white/40 bg-transparent text-2xl text-chalk hover:bg-white/10 hover:text-chalk' : 'min-h-11'}
        aria-label={running ? `Pause ${label}` : `Start ${label}`}
      >
        {running ? <Pause /> : <Play />}
        <span className="tnum font-bold" aria-live="off">
          {fmt(left)}
        </span>
      </Button>
      {left !== full && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={large ? 'h-14 w-14 text-chalk hover:bg-white/10 hover:text-chalk' : 'h-11 w-11'}
          aria-label={`Reset ${label}`}
          onClick={() => {
            setRunning(false)
            setLeft(full)
          }}
        >
          <RotateCcw />
        </Button>
      )}
      {left === 0 && (
        <span role="status" className={large ? 'font-bold text-gold' : 'font-bold text-crimson dark:text-gold'}>
          Time is up
        </span>
      )}
    </div>
  )
}

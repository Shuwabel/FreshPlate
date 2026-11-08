'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Search, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export const NAV = [
  { href: '/explore', label: 'Explore' },
  { href: '/planner', label: 'Meal plan' },
  { href: '/shopping', label: 'Shopping list' },
  { href: '/favorites', label: 'Saved' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-night text-chalk">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="FreshPlate home">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-gold text-night">
            <span className="display text-sm">F</span>
          </span>
          <span className="display text-xl text-gold">FreshPlate</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded px-3 py-2 text-sm font-semibold transition-colors',
                  active ? 'bg-gold text-night' : 'text-chalk/85 hover:bg-white/10 hover:text-chalk',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => router.push('/explore?focus=search')}
            className="grid h-11 w-11 place-items-center rounded hover:bg-white/10"
            aria-label="Search recipes"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="grid h-11 w-11 place-items-center rounded hover:bg-white/10"
            aria-label={mounted && resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}

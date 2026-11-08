'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Compass, Heart, Home, ShoppingBasket } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/planner', label: 'Plan', icon: CalendarDays },
  { href: '/shopping', label: 'List', icon: ShoppingBasket },
  { href: '/favorites', label: 'Saved', icon: Heart },
]

/** Thumb-reach navigation for phones. Hidden while cooking so the steps get the whole screen. */
export default function MobileTabs() {
  const pathname = usePathname()
  if (pathname.endsWith('/cook')) return null
  return (
    <nav
      aria-label="Main"
      className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-night pb-[env(safe-area-inset-bottom)] text-chalk md:hidden"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-semibold',
              active ? 'bg-gold text-night' : 'text-chalk/80',
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

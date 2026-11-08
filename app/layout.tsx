import type { Metadata, Viewport } from 'next'
import { Bowlby_One, Hanken_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import MobileTabs from '@/components/MobileTabs'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const display = Bowlby_One({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const text = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-text', display: 'swap' })

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'FreshPlate: African recipes you can actually cook', template: '%s | FreshPlate' },
  description:
    'Nigerian and African recipes with real photos, step-by-step cook mode, video tutorials, a weekly meal planner and a shopping list that adds itself up.',
  openGraph: {
    title: 'FreshPlate: African recipes you can actually cook',
    description: 'Jollof, egusi, suya, injera and more, with cook mode, videos, a meal planner and a smart shopping list.',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8f2' },
    { media: '(prefers-color-scheme: dark)', color: '#17133a' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${text.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:font-bold focus:text-night"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="min-h-[70vh] pb-20 md:pb-0">
            {children}
          </main>
          <SiteFooter />
          <MobileTabs />
          <Toaster position="top-center" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

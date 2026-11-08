import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-white/10 bg-night px-4 py-10 pb-28 text-chalk md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="display text-2xl text-gold">FreshPlate</p>
          <p className="mt-2 max-w-sm text-chalk/80">
            Nigerian and African home cooking, written out properly: real amounts, real steps, a swap for the ingredient you cannot find.
          </p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2 text-sm font-semibold">
          <Link href="/explore" className="hover:underline">Explore recipes</Link>
          <Link href="/planner" className="hover:underline">Weekly meal plan</Link>
          <Link href="/shopping" className="hover:underline">Shopping list</Link>
          <Link href="/credits" className="hover:underline">Photo and video credits</Link>
        </nav>
        <p className="text-sm text-chalk/70">
          Photos are free-licence images from Wikimedia Commons, credited on each recipe. Video tutorials belong to their creators and play from YouTube. Calorie figures are rough estimates.
        </p>
      </div>
    </footer>
  )
}

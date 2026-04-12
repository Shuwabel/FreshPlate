'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Utensils, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { CategoryBrowser } from '@/components/CategoryBrowser';
import { RecipeGrid } from '@/components/RecipeGrid';
import { useRecipeStore } from '@/lib/store';
import { useRandomMeal } from '@/hooks/useRandomMeal';
import { useMealSearch } from '@/hooks/useMealSearch';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchResults = useRecipeStore((state) => state.searchResults);
  const favorites = useRecipeStore((state) => state.favorites);
  const { meal, getRandomMeal, isLoading: randomLoading } = useRandomMeal();
  const { searchByCategory } = useMealSearch();
  const defaultLoadedRef = useRef(false);

  // Hydration safety and load default meals once
  useEffect(() => {
    setMounted(true);
    
    // Load default meals from Seafood category on first mount only
    if (!defaultLoadedRef.current && searchResults.length === 0) {
      defaultLoadedRef.current = true;
      searchByCategory('Seafood').catch((error) => {
        console.error('Failed to load default meals:', error);
      });
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="text-foreground">FreshPlate</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/favorites">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart size={18} />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/meal-planner">
              <Button variant="ghost" size="sm" className="gap-2">
                <Calendar size={18} />
                <span className="hidden sm:inline">Meal Planner</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background px-4 py-16 sm:py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Discover Delicious Recipes
          </h1>
          <p className="text-balance mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore thousands of recipes from around the world. Search by name, browse by cuisine, or discover random meals.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex justify-center">
            <SearchBar className="max-w-md" onSearch={() => setSearchPerformed(true)} />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={getRandomMeal}
              disabled={randomLoading}
              className="gap-2"
            >
              {randomLoading ? 'Loading...' : '🎲 Get Random Recipe'}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Random Meal Section */}
        {meal && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Random Pick for You</h2>
            <RecipeGrid recipes={[meal]} />
          </section>
        )}

        {/* Category Browser */}
        <section className="space-y-4">
          <CategoryBrowser />
        </section>

        {/* Search Results or Meals */}
        {searchResults.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
            <RecipeGrid recipes={searchResults} />
          </section>
        ) : searchPerformed ? (
          <section className="space-y-4 text-center py-12">
            <p className="text-lg text-muted-foreground">This recipe is not available at the moment.</p>
          </section>
        ) : null}

        {/* Favorites Section */}
        {favorites.length > 0 && searchResults.length === 0 && !searchPerformed && (
          <section className="space-y-4 border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground">Your Favorites</h2>
            <RecipeGrid recipes={favorites.slice(0, 8)} />
            {favorites.length > 8 && (
              <div className="flex justify-center pt-4">
                <Link href="/favorites">
                  <Button variant="outline">View All Favorites</Button>
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

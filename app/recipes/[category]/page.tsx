'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Utensils, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeGrid } from '@/components/RecipeGrid';
import { useMealSearch } from '@/hooks/useMealSearch';
import { useRecipeStore } from '@/lib/store';
import type { RecipeCard } from '@/types/recipe';

const EMOJI_MAP: Record<string, string> = {
  Breakfast: '🌅',
  Beef: '🥩',
  Chicken: '🍗',
  Dessert: '🍰',
  Goat: '🐐',
  Lamb: '🍖',
  Miscellaneous: '🍲',
  Pasta: '🍝',
  Pork: '🥓',
  Seafood: '🐟',
  Side: '🥗',
  Starter: '🥒',
  Vegan: '🥬',
  Vegetarian: '🥕',
};

export default function CategoryPage() {
  const [mounted, setMounted] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState<RecipeCard[]>([]);
  const [page, setPage] = useState(1);
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const from = searchParams.get('from') || 'home';

  const { results: allRecipes, searchByCategory, isLoading } = useMealSearch();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load recipes for category
  useEffect(() => {
    if (mounted && category) {
      searchByCategory(decodeURIComponent(category));
    }
  }, [mounted, category, searchByCategory]);

  // Update displayed recipes based on pagination
  useEffect(() => {
    if (allRecipes && allRecipes.length > 0) {
      const itemsPerPage = 20;
      const startIndex = 0;
      const endIndex = itemsPerPage * page;
      setDisplayedRecipes(allRecipes.slice(startIndex, endIndex));
    }
  }, [allRecipes, page]);

  if (!mounted) {
    return null;
  }

  const decodedCategory = decodeURIComponent(category);
  const hasMore = allRecipes && allRecipes.length > displayedRecipes.length;
  const backLabel = from === 'recipe' ? 'Back to Recipe' : 'Back to Home';
  const backHref = from === 'recipe' ? -1 : '/';

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="text-foreground">FreshPlate</span>
          </Link>

          <div className="text-sm text-muted-foreground">
            Showing {displayedRecipes.length} of {allRecipes?.length || 0} recipes
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Category Header */}
        <div className="space-y-4">
          <Link href={from === 'recipe' ? '#' : '/'} onClick={() => from === 'recipe' ? window.history.back() : undefined}>
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft size={18} />
              {backLabel}
            </Button>
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{EMOJI_MAP[decodedCategory] || '🍽️'}</span>
              <h1 className="text-4xl font-bold text-foreground">{decodedCategory} Recipes</h1>
            </div>
            <p className="text-muted-foreground">
              Browse all delicious {decodedCategory.toLowerCase()} recipes from our collection.
            </p>
          </div>
        </div>

        {/* Recipes Grid */}
        {isLoading && displayedRecipes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading recipes...</p>
            </div>
          </div>
        ) : displayedRecipes.length > 0 ? (
          <>
            <RecipeGrid recipes={displayedRecipes} category={decodedCategory} />

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => setPage(page + 1)}
                  size="lg"
                  variant="outline"
                >
                  Load More Recipes
                </Button>
              </div>
            )}

            {!hasMore && displayedRecipes.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You&apos;ve reached the end of {decodedCategory.toLowerCase()} recipes
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}

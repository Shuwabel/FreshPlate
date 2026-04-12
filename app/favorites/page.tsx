'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeGrid } from '@/components/RecipeGrid';
import { useRecipeStore } from '@/lib/store';

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);
  const favorites = useRecipeStore((state) => state.favorites);
  const routine = useRecipeStore((state) => state.routine);
  const { removeFavorite, removeFromRoutine } = useRecipeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      favorites.forEach((recipe) => removeFavorite(recipe.id));
    }
  };

  const clearAllRoutine = () => {
    if (confirm('Are you sure you want to clear all routine meals?')) {
      routine.forEach((recipe) => removeFromRoutine(recipe.id));
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>

          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart size={24} className="fill-red-500 text-red-500" />
            Saved Recipes
          </h1>

          <div className="w-[40px]" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="favorites" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="routine">
              Routine ({routine.length})
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Favorite Recipes</h2>
              {favorites.length > 0 && (
                <Button
                  onClick={clearAllFavorites}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  Clear All
                </Button>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center space-y-4">
                <Heart size={48} className="mx-auto text-muted-foreground opacity-50" />
                <div>
                  <p className="text-lg font-medium text-foreground">No favorites yet</p>
                  <p className="text-muted-foreground">Start saving your favorite recipes by clicking the heart icon</p>
                </div>
                <Link href="/">
                  <Button>Explore Recipes</Button>
                </Link>
              </div>
            ) : (
              <RecipeGrid recipes={favorites} />
            )}
          </TabsContent>

          {/* Routine Tab */}
          <TabsContent value="routine" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Routine Meals</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Recipes you cook regularly
                </p>
              </div>
              {routine.length > 0 && (
                <Button
                  onClick={clearAllRoutine}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  Clear All
                </Button>
              )}
            </div>

            {routine.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center space-y-4">
                <div className="text-4xl">🍽️</div>
                <div>
                  <p className="text-lg font-medium text-foreground">No routine meals yet</p>
                  <p className="text-muted-foreground">Mark recipes as part of your routine to track what you cook often</p>
                </div>
                <Link href="/">
                  <Button>Find Recipes</Button>
                </Link>
              </div>
            ) : (
              <RecipeGrid recipes={routine} />
            )}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        {(favorites.length > 0 || routine.length > 0) && (
          <section className="mt-12 border-t border-border pt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {favorites.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Total Favorites</p>
                  <p className="mt-2 text-4xl font-bold text-primary">{favorites.length}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Avg calories: {(favorites.reduce((sum, r) => sum + r.calories, 0) / favorites.length).toFixed(0)}
                  </p>
                </div>
              )}

              {routine.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Routine Meals</p>
                  <p className="mt-2 text-4xl font-bold text-primary">{routine.length}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Avg cook time: {(routine.reduce((sum, r) => sum + r.cookTime, 0) / routine.length).toFixed(0)} min
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

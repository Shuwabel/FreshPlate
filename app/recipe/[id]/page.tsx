'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, Flame, ChefHat, Share2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMealDetails } from '@/hooks/useMealDetails';
import { useRecipeStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function RecipeDetailPage() {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const params = useParams();
  const recipeId = params.id as string;

  const { recipe, isLoading, error, fetchRecipe } = useMealDetails();
  const { addFavorite, removeFavorite, isFavorite, addToRoutine, removeFromRoutine, isInRoutine } =
    useRecipeStore();

  const isFav = recipe ? isFavorite(recipe.id) : false;
  const isRoutine = recipe ? isInRoutine(recipe.id) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && recipeId) {
      fetchRecipe(recipeId);
    }
  }, [mounted, recipeId, fetchRecipe]);

  if (!mounted) {
    return null;
  }

  const handleFavorite = () => {
    if (!recipe) return;
    if (isFav) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handleRoutine = () => {
    if (!recipe) return;
    if (isRoutine) {
      removeFromRoutine(recipe.id);
    } else {
      addToRoutine(recipe);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto flex items-center gap-2 px-4 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
          </div>
        </header>
        <div className="container mx-auto flex items-center justify-center px-4 py-24">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-foreground">Recipe not found</p>
            <p className="text-muted-foreground">{error || 'The recipe you&apos;re looking for does not exist.'}</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-foreground hidden sm:inline">FreshPlate</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFavorite}
              className="gap-2"
            >
              <Heart
                size={18}
                className={cn(
                  'transition-colors',
                  isFav ? 'fill-red-500 text-red-500' : 'text-foreground'
                )}
              />
              <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Image and Title Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {/* Image */}
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted">
              {!imageError && recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">{recipe.name}</h1>

              <div className="flex flex-wrap gap-2">
                {recipe.isVegan && (
                  <Badge className="text-base">Vegan</Badge>
                )}
                {recipe.isVegetarian && !recipe.isVegan && (
                  <Badge className="text-base">Vegetarian</Badge>
                )}
                <Badge variant="secondary">{recipe.difficulty}</Badge>
                <Badge variant="outline">{recipe.cuisine}</Badge>
                <Badge variant="outline">{recipe.category}</Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Cook Time</p>
                    <p className="text-lg font-semibold text-foreground">{recipe.cookTime} min</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Flame className="text-primary" size={20} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="text-lg font-semibold text-foreground">{recipe.calories}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <ChefHat className="text-primary" size={20} />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="text-lg font-semibold capitalize text-foreground">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <Button onClick={handleFavorite} className="w-full gap-2 text-base" variant={isFav ? 'default' : 'outline'}>
                <Heart
                  size={20}
                  className={cn('transition-colors', isFav ? 'fill-white' : '')}
                />
                {isFav ? 'Saved to Favorites' : 'Save to Favorites'}
              </Button>

              <Button onClick={handleRoutine} className="w-full gap-2 text-base" variant={isRoutine ? 'default' : 'outline'}>
                <ChefHat size={20} />
                {isRoutine ? 'In Routine' : 'Add to Routine'}
              </Button>

              {recipe.youtubeUrl && (
                <Button asChild className="w-full gap-2 text-base" variant="outline">
                  <a href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={20} />
                    Watch Recipe
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <section className="border-t border-border pt-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Ingredients</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <ul className="grid gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 py-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{ingredient.name}</p>
                    <p className="text-sm text-muted-foreground">{ingredient.measure}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Instructions */}
        <section className="border-t border-border pt-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Instructions</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        {recipe.tags.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Action Buttons */}
        <div className="border-t border-border pt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft size={18} />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

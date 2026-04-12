'use client';

import { Loader2 } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import type { RecipeCard as RecipeCardType } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface RecipeGridProps {
  recipes: RecipeCardType[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function RecipeGrid({
  recipes,
  isLoading = false,
  error,
  className,
}: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-12', className)}>
        <Loader2 size={20} className="animate-spin text-primary" />
        <span className="text-muted-foreground">Loading recipes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center', className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-card p-12 text-center', className)}>
        <p className="text-lg font-medium text-foreground">No recipes found</p>
        <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

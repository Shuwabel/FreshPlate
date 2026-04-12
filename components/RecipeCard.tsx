'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RecipeCard as RecipeCardType } from '@/types/recipe';
import { useRecipeStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: RecipeCardType;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useRecipeStore();
  const isFav = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {!imageError && recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-muted-foreground text-4xl">🍽️</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:bg-white active:scale-95"
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={cn('transition-colors', isFav ? 'fill-red-500 text-red-500' : 'text-gray-600')}
            />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 p-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {recipe.isVegan && (
              <Badge variant="secondary" className="text-xs">
                Vegan
              </Badge>
            )}
            {recipe.isVegetarian && !recipe.isVegan && (
              <Badge variant="secondary" className="text-xs">
                Vegetarian
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={14} />
              <span>{recipe.calories} cal</span>
            </div>
          </div>

          {/* Cuisine */}
          <p className="text-xs text-muted-foreground line-clamp-1">
            {recipe.cuisine}
          </p>
        </div>
      </div>
    </Link>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { useRecipeStore } from '@/lib/store';
import { mealdbClient } from '@/lib/api/mealdb';
import { cn } from '@/lib/utils';

interface CategoryBrowserProps {
  onCategorySelect?: (category: string) => void;
  className?: string;
}

const EMOJI_MAP: Record<string, string> = {
  'All Meals': '🍽️',
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

export function CategoryBrowser({ onCategorySelect, className }: CategoryBrowserProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchByCategory } = useMealSearch();
  const { setSearchResults } = useRecipeStore((state) => ({
    setSearchResults: state.setSearchResults,
  }));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await mealdbClient.listCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      // Load diverse recipes from multiple categories
      try {
        const categoryNames = ['Seafood', 'Chicken', 'Beef', 'Vegetarian', 'Dessert'];
        const allMeals = [];
        
        for (const cat of categoryNames) {
          const meals = await mealdbClient.filterByCategory(cat);
          allMeals.push(...meals.slice(0, 4)); // Get 4 from each category for diversity
        }
        
        const { normalizeToRecipeCard } = await import('@/lib/api/recipeAdapter');
        const normalized = allMeals.map(normalizeToRecipeCard).slice(0, 20);
        setSearchResults(normalized);
      } catch (error) {
        console.error('Failed to load all meals:', error);
      }
    } else {
      await searchByCategory(category);
    }
    
    onCategorySelect?.(category);
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-4', className)}>
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm font-semibold text-foreground">Browse by Category</p>
      <div className="flex flex-wrap gap-2">
        {/* All Meals Button */}
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick('All')}
          className="gap-1 text-xs sm:text-sm"
        >
          <span>{EMOJI_MAP['All Meals']}</span>
          <span>All Meals</span>
        </Button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <Link
            key={category}
            href={`/recipes/${encodeURIComponent(category)}`}
          >
            <Button
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="gap-1 text-xs sm:text-sm"
            >
              <span>{EMOJI_MAP[category] || '🍽️'}</span>
              <span>{category}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

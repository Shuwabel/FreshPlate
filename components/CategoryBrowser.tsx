'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { mealdbClient } from '@/lib/api/mealdb';
import { cn } from '@/lib/utils';

interface CategoryBrowserProps {
  onCategorySelect?: (category: string) => void;
  className?: string;
}

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

export function CategoryBrowser({ onCategorySelect, className }: CategoryBrowserProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchByCategory } = useMealSearch();

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
    await searchByCategory(category);
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
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="gap-1 text-xs sm:text-sm"
          >
            <span>{EMOJI_MAP[category] || '🍽️'}</span>
            <span>{category}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

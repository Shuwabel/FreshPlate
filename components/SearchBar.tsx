'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { useRecipeStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchBarProps {
  onSearch?: () => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { searchByName } = useMealSearch();
  const searchResults = useRecipeStore((state) => state.searchResults);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    
    if (value.trim().length > 0) {
      setIsSearching(true);
      try {
        await searchByName(value.trim());
      } finally {
        setIsSearching(false);
      }
      onSearch?.();
    }
  }, [searchByName, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  const showResults = query.trim().length > 0;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search recipes by name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-8"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border bg-card shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-border">
              {searchResults.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="block p-3 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <p className="font-medium text-foreground text-sm">{recipe.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{recipe.cuisine} • {recipe.category}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Recipe is not available at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

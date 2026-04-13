'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { RecipeCard } from '@/components/RecipeCard';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results: searchResults, searchByName, isLoading } = useMealSearch();

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    setIsOpen(true);
    
    if (value.trim().length > 0) {
      await searchByName(value.trim());
    }
  }, [searchByName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleRecipeClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full relative', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search recipes by name... (Press Enter for full results)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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

      {/* Search Results Modal */}
      {isOpen && query.trim().length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleModalClose}
          />

          {/* Modal */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {searchResults.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipe/${recipe.id}`}
                      onClick={handleRecipeClick}
                    >
                      <div className="group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-md h-full">
                        <div className="relative h-32 overflow-hidden bg-muted">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2 bg-card">
                          <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {recipe.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {recipe.category}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Results Button */}
                <div className="border-t border-border p-3 bg-muted/30">
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View all results
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  This recipe is not available at the moment.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { RecipeGrid } from '@/components/RecipeGrid';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [mounted, setMounted] = useState(false);
  const { results: searchResults, searchByName, isLoading } = useMealSearch();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && query) {
      searchByName(query);
    }
  }, [mounted, query, searchByName]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              Search Results for "{query}"
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? 'Searching...' : `Found ${searchResults.length} recipe${searchResults.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Searching for recipes...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            <RecipeGrid recipes={searchResults} centered={true} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                No recipes found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords or browse by category
              </p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

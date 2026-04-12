'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMealSearch } from '@/hooks/useMealSearch';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch?: () => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { searchByName, isLoading } = useMealSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchByName(query.trim());
      onSearch?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn('w-full', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search recipes by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  );
}

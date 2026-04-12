'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMealSearch } from '@/hooks/useMealSearch';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  onSearch?: () => void;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { searchByName } = useMealSearch();

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    
    if (value.trim().length > 0) {
      await searchByName(value.trim());
      onSearch?.();
    }
  }, [searchByName, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={cn('w-full', className)}>
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
  );
}

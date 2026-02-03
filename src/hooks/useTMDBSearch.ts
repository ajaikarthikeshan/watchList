import { useState, useCallback } from 'react';
import { tmdbApi } from '@/lib/tmdb/client';
import type { TMDBMultiSearchResult, TMDBMediaItem } from '@/types/tmdb';

export const useTMDBSearch = () => {
  const [results, setResults] = useState<TMDBMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching for:', query);
      const data: TMDBMultiSearchResult = await tmdbApi.search(query);
      console.log('Search results:', data);
      setResults(data.results);
      
      if (data.results.length === 0) {
        setError('No results found. Try a different search term.');
      }
    } catch (err: any) {
      console.error('TMDB search error:', err);
      const errorMsg = err?.response?.data?.status_message || err?.message || 'Failed to search';
      
      if (err?.response?.status === 401) {
        setError('Invalid API key. Please check your .env.local file.');
      } else if (err?.response?.status === 404) {
        setError('API endpoint not found. Please check your configuration.');
      } else {
        setError(`Search failed: ${errorMsg}`);
      }
      
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
};

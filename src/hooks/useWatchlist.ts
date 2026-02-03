import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { tmdbApi } from '@/lib/tmdb/client';
import { TMDB_GENRES } from '@/lib/tmdb/config';
import { getMediaTitle, getMediaType } from '@/lib/tmdb/utils';
import type { WatchNode } from '@/types/watchlist';
import type { TMDBMediaItem, TMDBMovieDetails, TMDBTVDetails } from '@/types/tmdb';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load watchlist from storage on mount
  useEffect(() => {
    const stored = storage.get();
    setWatchlist(stored);
  }, []);

  // Add item to watchlist
  const addToWatchlist = useCallback(async (item: TMDBMediaItem) => {
    setIsLoading(true);
    
    try {
      const mediaType = getMediaType(item);
      const uniqueId = `${item.id}-${mediaType}`;

      // Check if already exists
      const exists = watchlist.some(
        (node) => node.id === uniqueId
      );

      if (exists) {
        setIsLoading(false);
        return;
      }

      // Fetch detailed information to get genres
      let details: TMDBMovieDetails | TMDBTVDetails;
      if (mediaType === 'movie') {
        details = await tmdbApi.getMovieDetails(item.id);
      } else {
        details = await tmdbApi.getTVDetails(item.id);
      }

      // Create watch node
      const releaseYear = mediaType === 'movie' 
        ? (item as TMDBMediaItem & { release_date?: string }).release_date 
          ? parseInt((item as TMDBMediaItem & { release_date?: string }).release_date!.split('-')[0])
          : new Date().getFullYear()
        : (item as TMDBMediaItem & { first_air_date?: string }).first_air_date
          ? parseInt((item as TMDBMediaItem & { first_air_date?: string }).first_air_date!.split('-')[0])
          : new Date().getFullYear();

      const newNode: WatchNode = {
        id: uniqueId,
        itemId: item.id,
        title: getMediaTitle(item),
        mediaType: mediaType,
        genres: details.genres.map((g) => g.name),
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        overview: item.overview || '',
        releaseYear,
        rating: item.vote_average || 0,
        addedAt: Date.now(),
      };

      // Add to storage and state
      storage.add(newNode);
      setWatchlist((prev) => [...prev, newNode]);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [watchlist]);

  // Remove item from watchlist
  const removeFromWatchlist = useCallback((id: string) => {
    storage.remove(id);
    setWatchlist((prev) => prev.filter((node) => node.id !== id));
  }, []);

  // Update item in watchlist
  const updateWatchlistItem = useCallback((id: string, updates: Partial<WatchNode>) => {
    storage.update(id, updates);
    setWatchlist((prev) =>
      prev.map((node) => (node.id === id ? { ...node, ...updates } : node))
    );
  }, []);

  // Get set of added IDs for quick lookup
  const addedIds = new Set(watchlist.map((node) => node.id));

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    addedIds,
    isLoading,
  };
};

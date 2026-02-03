"use client";

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { WatchNode } from '@/types/watchlist';
import type { SearchResult } from '@/lib/services/searchService';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchNode[]>([]);

  // Load watchlist from storage on mount
  useEffect(() => {
    const stored = storage.get();
    setWatchlist(stored);
  }, []);

  // Add item to watchlist
  const addToWatchlist = useCallback((item: SearchResult) => {
    const uniqueId = `${item.id}-${item.mediaType}`;

    // Check if already exists
    const exists = watchlist.some((node) => node.id === uniqueId);
    if (exists) return;

    // Create watch node
    const newNode: WatchNode = {
      id: uniqueId,
      itemId: item.id,
      title: item.title,
      mediaType: item.mediaType,
      posterUrl: item.posterUrl,
      genres: item.genres,
      releaseYear: item.releaseYear,
      overview: item.overview,
      rating: item.rating,
      addedAt: Date.now(),
    };

    // Add to storage and state
    storage.add(newNode);
    setWatchlist((prev) => [...prev, newNode]);
  }, [watchlist]);

  // Remove item from watchlist
  const removeFromWatchlist = useCallback((id: string) => {
    storage.remove(id);
    setWatchlist((prev) => prev.filter((node) => node.id !== id));
  }, []);

  // Get set of added IDs for quick lookup
  const addedIds = new Set(watchlist.map((node) => node.id));

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    addedIds,
  };
};

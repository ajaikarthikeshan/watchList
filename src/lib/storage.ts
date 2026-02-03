import type { WatchNode } from '@/types/watchlist';

const STORAGE_KEY = 'watchlist-constellation';

export const storage = {
  get: (): WatchNode[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  set: (watchlist: WatchNode[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  add: (item: WatchNode): void => {
    const watchlist = storage.get();
    // Check for duplicates by item ID and media type
    const exists = watchlist.some(
      (node) => node.itemId === item.itemId && node.mediaType === item.mediaType
    );
    
    if (!exists) {
      watchlist.push(item);
      storage.set(watchlist);
    }
  },

  remove: (id: string): void => {
    const watchlist = storage.get();
    const filtered = watchlist.filter((node) => node.id !== id);
    storage.set(filtered);
  },

  update: (id: string, updates: Partial<WatchNode>): void => {
    const watchlist = storage.get();
    const index = watchlist.findIndex((node) => node.id === id);
    
    if (index !== -1) {
      watchlist[index] = { ...watchlist[index], ...updates };
      storage.set(watchlist);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export interface WatchNode {
  id: string; // Unique internal ID (id-mediaType)
  itemId: number; // Original item ID
  title: string;
  mediaType: 'movie' | 'tv';
  posterUrl: string;
  genres: string[];
  releaseYear: number;
  overview: string;
  rating: number;
  addedAt: number; // Timestamp
}

export interface WatchlistCache {
  [key: string]: WatchNode;
}

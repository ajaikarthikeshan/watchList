import { mockMoviesAndShows, MockMediaItem } from '../data/mockData';

/**
 * Search service abstraction layer
 * This module provides a clean interface for searching movies/shows.
 * 
 * To swap to TMDB API later:
 * 1. Replace the implementation of searchMovies() with TMDB API call
 * 2. Map TMDB response to match MockMediaItem interface
 * 3. No other code needs to change
 */

export interface SearchResult {
  id: number;
  title: string;
  mediaType: 'movie' | 'tv';
  posterUrl: string;
  genres: string[];
  releaseYear: number;
  overview: string;
  rating: number;
}

/**
 * Search for movies and TV shows by title
 * 
 * Current: Filters mock data locally
 * Future: Replace with TMDB API call
 * 
 * @param query - Search term
 * @returns Array of matching media items
 */
export async function searchMovies(query: string): Promise<SearchResult[]> {
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim()) {
    return [];
  }
  
  // Filter mock data by title (case-insensitive)
  const normalizedQuery = query.toLowerCase();
  const results = mockMoviesAndShows.filter(item => 
    item.title.toLowerCase().includes(normalizedQuery)
  );
  
  return results;
}

/**
 * Get all available movies and shows (for browsing)
 * 
 * Current: Returns all mock data
 * Future: Could be TMDB trending or popular endpoint
 */
export async function getAllMovies(): Promise<SearchResult[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockMoviesAndShows;
}

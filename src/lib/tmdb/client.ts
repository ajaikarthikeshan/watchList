import axios from 'axios';
import { TMDB_CONFIG } from './config';
import type { 
  TMDBMultiSearchResult, 
  TMDBMovieDetails, 
  TMDBTVDetails 
} from '@/types/tmdb';

const tmdbClient = axios.create({
  baseURL: TMDB_CONFIG.baseUrl,
  params: {
    api_key: TMDB_CONFIG.apiKey,
  },
});

export const tmdbApi = {
  // Multi-search for movies and TV shows
  search: async (query: string, page: number = 1): Promise<TMDBMultiSearchResult> => {
    console.log('TMDB API Key:', TMDB_CONFIG.apiKey ? `${TMDB_CONFIG.apiKey.substring(0, 8)}...` : 'NOT SET');
    console.log('TMDB Base URL:', TMDB_CONFIG.baseUrl);
    
    const response = await tmdbClient.get('/search/multi', {
      params: { query, page, include_adult: false },
    });
    
    console.log('Raw TMDB response:', response.data);
    
    // Filter to only movies and TV shows
    const filteredResults = response.data.results.filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    return {
      ...response.data,
      results: filteredResults,
    };
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<TMDBMovieDetails> => {
    const response = await tmdbClient.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get TV show details
  getTVDetails: async (tvId: number): Promise<TMDBTVDetails> => {
    const response = await tmdbClient.get(`/tv/${tvId}`);
    return response.data;
  },

  // Search movies only
  searchMovies: async (query: string, page: number = 1) => {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page, include_adult: false },
    });
    return response.data;
  },

  // Search TV shows only
  searchTV: async (query: string, page: number = 1) => {
    const response = await tmdbClient.get('/search/tv', {
      params: { query, page, include_adult: false },
    });
    return response.data;
  },
};

export default tmdbClient;

import { TMDB_CONFIG, TMDB_IMAGE_SIZES } from './config';

export const getTMDBImageUrl = (
  path: string | null,
  type: 'poster' | 'backdrop' = 'poster',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | null => {
  if (!path) return null;
  
  const sizeString = TMDB_IMAGE_SIZES[type][size];
  return `${TMDB_CONFIG.imageBaseUrl}/${sizeString}${path}`;
};

export const getMediaTitle = (item: any): string => {
  return item.title || item.name || 'Untitled';
};

export const getMediaReleaseYear = (item: any): string => {
  const date = item.release_date || item.first_air_date;
  if (!date) return '';
  return new Date(date).getFullYear().toString();
};

export const getMediaType = (item: any): 'movie' | 'tv' => {
  return item.media_type === 'tv' ? 'tv' : 'movie';
};

import React from 'react';
import { MediaCard } from './MediaCard';
import type { TMDBMediaItem } from '@/types/tmdb';

interface SearchResultsProps {
  results: TMDBMediaItem[];
  onAdd: (item: TMDBMediaItem) => void;
  addedIds: Set<string>;
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onAdd,
  addedIds,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="search-results-loading">
        <div className="loading-spinner"></div>
        <p>Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <div className="search-results-grid">
        {results.map((item) => {
          const mediaType = 'media_type' in item ? item.media_type : ('title' in item ? 'movie' : 'tv');
          const uniqueId = `${item.id}-${mediaType}`;
          
          return (
            <MediaCard
              key={uniqueId}
              item={item}
              onAdd={onAdd}
              isAdded={addedIds.has(uniqueId)}
            />
          );
        })}
      </div>
    </div>
  );
};

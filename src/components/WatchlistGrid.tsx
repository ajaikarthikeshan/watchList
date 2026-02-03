import React from 'react';
import { MediaCard } from './MediaCard';
import { WatchNode } from '@/types/watchlist';

interface WatchlistGridProps {
  watchlist: WatchNode[];
  onRemove: (id: string) => void;
}

export const WatchlistGrid: React.FC<WatchlistGridProps> = ({ watchlist, onRemove }) => {
  return (
    <div className="media-grid">
      {watchlist.map((item) => (
        <MediaCard
          key={item.id}
          id={item.id}
          title={item.title}
          posterUrl={item.posterUrl}
          releaseYear={item.releaseYear}
          mediaType={item.mediaType}
          genres={item.genres}
          onRemove={() => onRemove(item.id)}
          showRemove
        />
      ))}
    </div>
  );
};

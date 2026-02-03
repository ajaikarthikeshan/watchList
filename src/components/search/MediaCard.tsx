import React from 'react';
import Image from 'next/image';
import { getTMDBImageUrl, getMediaTitle, getMediaReleaseYear } from '@/lib/tmdb/utils';
import type { TMDBMediaItem } from '@/types/tmdb';

interface MediaCardProps {
  item: TMDBMediaItem;
  onAdd: (item: TMDBMediaItem) => void;
  isAdded?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onAdd, isAdded = false }) => {
  const title = getMediaTitle(item);
  const year = getMediaReleaseYear(item);
  const posterUrl = getTMDBImageUrl(item.poster_path, 'poster', 'medium');
  const mediaType = 'media_type' in item ? item.media_type : ('title' in item ? 'movie' : 'tv');

  return (
    <div className="media-card">
      <div className="media-card-poster">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        ) : (
          <div className="media-card-no-poster">
            <span>No Image</span>
          </div>
        )}
        <div className="media-card-overlay">
          <button
            onClick={() => onAdd(item)}
            disabled={isAdded}
            className="media-card-button"
          >
            {isAdded ? 'Added' : '+ Add'}
          </button>
        </div>
      </div>
      <div className="media-card-info">
        <h3 className="media-card-title">{title}</h3>
        <div className="media-card-meta">
          <span className="media-card-year">{year}</span>
          <span className="media-card-type">{mediaType === 'tv' ? 'TV' : 'Movie'}</span>
        </div>
      </div>
    </div>
  );
};

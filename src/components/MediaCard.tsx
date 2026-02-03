import React from 'react';

interface MediaCardProps {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: number;
  mediaType: 'movie' | 'tv';
  genres?: string[];
  onAdd?: () => void;
  onRemove?: () => void;
  isAdded?: boolean;
  showRemove?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  posterUrl,
  releaseYear,
  mediaType,
  genres,
  onAdd,
  onRemove,
  isAdded = false,
  showRemove = false,
}) => {
  return (
    <div className="media-card">
      <div className="media-card-poster">
        <img src={posterUrl} alt={title} />
        <div className="media-card-overlay">
          {showRemove ? (
            <button onClick={onRemove} className="media-card-button remove">
              Remove
            </button>
          ) : (
            <button
              onClick={onAdd}
              disabled={isAdded}
              className="media-card-button"
            >
              {isAdded ? 'Added' : '+ Add'}
            </button>
          )}
        </div>
      </div>
      <div className="media-card-info">
        <h3 className="media-card-title">{title}</h3>
        <div className="media-card-meta">
          <span className="media-card-year">{releaseYear}</span>
          <span className="media-card-type">{mediaType === 'tv' ? 'TV' : 'Movie'}</span>
        </div>
        <div className="media-card-genres">
          {genres?.slice(0, 2).map((genre) => (
            <span key={genre} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

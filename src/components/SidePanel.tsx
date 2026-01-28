"use client";

import Image from "next/image";

import type { WatchItem } from "./ConstellationScene";

export type SearchResult = {
  id: number;
  title: string;
  posterPath: string | null;
  year: string;
  type: "movie" | "tv";
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  results: SearchResult[];
  onAdd: (result: SearchResult) => void;
  selected: WatchItem | null;
  onClearSelection: () => void;
};

const POSTER_BASE = "https://image.tmdb.org/t/p/w200";

export function SidePanel({ query, onQueryChange, results, onAdd, selected, onClearSelection }: Props) {
  return (
    <aside className="panel">
      <div className="panel-search">
        <input
          type="search"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder="Search TMDB"
          aria-label="Search TMDB"
        />
      </div>
      <div className="panel-results">
        {results.map(result => (
          <button key={`${result.type}-${result.id}`} type="button" onClick={() => onAdd(result)}>
            <div className="result-meta">
              <span className="result-title">{result.title}</span>
              <span className="result-year">{result.year || ""}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="panel-selection">
        {selected ? (
          <>
            <div className="selection-header">
              {selected.posterPath ? (
                <Image
                  src={`${POSTER_BASE}${selected.posterPath}`}
                  alt={selected.title}
                  width={120}
                  height={180}
                />
              ) : (
                <div className="poster-fallback" />
              )}
              <div>
                <h2>{selected.title}</h2>
                <p className="selection-year">{selected.year}</p>
                <p className="selection-type">{selected.type === "movie" ? "Film" : "Series"}</p>
              </div>
            </div>
            <div className="selection-tags">
              {selected.genres.map(genre => (
                <span key={genre} className="tag">
                  {genre}
                </span>
              ))}
            </div>
            <button type="button" className="clear-button" onClick={onClearSelection}>
              Deselect
            </button>
          </>
        ) : (
          <div className="selection-empty" />
        )}
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SimpleSearchBar";
import { MediaCard } from "@/components/MediaCard";
import { useSearch } from "@/hooks/useSearch";
import { useWatchlist } from "@/hooks/useSimpleWatchlist";
import { ConstellationView } from "@/components/ConstellationView";
import { WatchlistGrid } from "@/components/WatchlistGrid";
import { ViewToggle, ViewType } from "@/components/ViewToggle";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { results, isLoading, search } = useSearch();
  const { watchlist, addToWatchlist, removeFromWatchlist, addedIds } = useWatchlist();
  const [view, setView] = useState<ViewType>('grid');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>WatchList</h1>
            {watchlist.length > 0 && <ViewToggle currentView={view} onViewChange={setView} />}
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
        />
      </div>

      {isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <section className="section">
          <h2 className="section-title">Search Results</h2>
          <div className="media-grid">
            {results.map((item) => {
              const uniqueId = `${item.id}-${item.mediaType}`;
              return (
                <MediaCard
                  key={uniqueId}
                  id={uniqueId}
                  title={item.title}
                  posterUrl={item.posterUrl}
                  releaseYear={item.releaseYear}
                  mediaType={item.mediaType}
                  genres={item.genres}
                  onAdd={() => addToWatchlist(item)}
                  isAdded={addedIds.has(uniqueId)}
                />
              );
            })}
          </div>
        </section>
      )}

      {watchlist.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            My Watchlist ({watchlist.length})
          </h2>
          
          {view === 'grid' ? (
             <WatchlistGrid watchlist={watchlist} onRemove={removeFromWatchlist} />
          ) : (
             <ConstellationView watchlist={watchlist} onRemove={removeFromWatchlist} />
          )}
        </section>
      )}

      {!isLoading && results.length === 0 && watchlist.length === 0 && (
        <div className="empty-state">
          <p>Search for movies and TV shows to build your watchlist</p>
        </div>
      )}
    </main>
  );
}

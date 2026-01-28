"use client";

import { useEffect, useMemo, useState } from "react";

import constellationsData from "@/data/constellations.json";
import { ConstellationScene, type Constellation, type WatchItem } from "@/components/ConstellationScene";
import { StarfieldCanvas } from "@/components/StarfieldCanvas";
import { SidePanel, type SearchResult } from "@/components/SidePanel";
import { fetchTmdbDetails, getTitle, getYear, searchTmdb } from "@/lib/tmdb";
import { readLocalStorage, writeLocalStorage } from "@/lib/storage";

const STORAGE_KEY = "watchlist-items";

const constellations = constellationsData as Constellation[];

function pickConstellation(genres: string[]) {
  const match = constellations.find(constellation =>
    genres.some(genre => constellation.genreTags.includes(genre))
  );
  return match ?? constellations[0];
}

function buildPosition(center: { x: number; y: number }) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 60 + Math.random() * 90;
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
}

export default function Home() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [selected, setSelected] = useState<WatchItem | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const stored = readLocalStorage<WatchItem[]>(STORAGE_KEY, []);
    setItems(stored);
  }, []);

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return undefined;
    }

    const handler = window.setTimeout(async () => {
      const tmdbResults = await searchTmdb(query.trim());
      const nextResults = tmdbResults.map(result => {
        const title = result.title ?? result.name ?? "Untitled";
        const year = (result.release_date ?? result.first_air_date ?? "").split("-")[0];
        return {
          id: result.id,
          title,
          posterPath: result.poster_path,
          year,
          type: result.media_type
        };
      });
      setResults(nextResults.slice(0, 8));
    }, 280);

    return () => window.clearTimeout(handler);
  }, [query]);

  const itemsById = useMemo(() => new Map(items.map(item => [item.id, item])), [items]);

  const handleAdd = async (result: SearchResult) => {
    if (itemsById.has(result.id)) {
      setSelected(itemsById.get(result.id) ?? null);
      return;
    }
    const details = await fetchTmdbDetails(result.id, result.type);
    if (!details) {
      return;
    }
    const genres = details.genres.map(genre => genre.name);
    const constellation = pickConstellation(genres);
    const position = buildPosition(constellation.center);

    const item: WatchItem = {
      id: details.id,
      title: getTitle(details),
      posterPath: details.poster_path,
      genres,
      year: getYear(details),
      type: result.type,
      constellationId: constellation.id,
      position
    };

    setItems(current => [...current, item]);
    setSelected(item);
    setQuery("");
    setResults([]);
  };

  return (
    <main>
      <StarfieldCanvas />
      <div className="app">
        <ConstellationScene
          constellations={constellations}
          items={items}
          onSelect={setSelected}
          selectedId={selected?.id ?? null}
        />
        <SidePanel
          query={query}
          onQueryChange={setQuery}
          results={results}
          onAdd={handleAdd}
          selected={selected}
          onClearSelection={() => setSelected(null)}
        />
      </div>
    </main>
  );
}

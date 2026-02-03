# WatchList

A minimal, searchable movie and TV show watchlist application built with Next.js. Currently uses mock data with a clean architecture designed for easy TMDB API integration later.

## Features

- 🔍 **Search** movies and TV shows by title
- ➕ **Add to Watchlist** with poster-first card layout
- 💾 **Local Storage** persistence (browser-based)
- 🚫 **Duplicate Prevention** by ID and media type
- 📱 **Responsive Design** works on all screen sizes
- 🎯 **Vercel-Ready** deploys without environment variables

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

### Current Implementation

The app currently uses **mock data** stored in `src/lib/data/mockData.ts`. This provides 15 sample movies and TV shows that can be searched and added to your watchlist.

- Search filters the mock dataset by title
- Results are displayed as poster-first cards
- Watchlist persists in browser localStorage
- No API keys or external dependencies required

### Architecture

```
src/
├── app/
│   ├── page.tsx             # Main UI
│   └── globals.css          # Styles
├── components/
│   ├── MediaCard.tsx        # Reusable card component
│   └── SimpleSearchBar.tsx  # Search input
├── hooks/
│   ├── useSearch.ts         # Search logic
│   └── useSimpleWatchlist.ts # Watchlist CRUD
├── lib/
│   ├── data/
│   │   └── mockData.ts      # Mock dataset (15 items)
│   ├── services/
│   │   └── searchService.ts # 🔑 Abstraction layer
│   └── storage.ts           # LocalStorage wrapper
└── types/
    ├── tmdb.ts              # (Not currently used)
    └── watchlist.ts         # Watchlist data types
```

### Key Design: Pluggable Data Source

The `searchService.ts` module provides a clean abstraction:

```typescript
export async function searchMovies(query: string): Promise<SearchResult[]> {
  // Current: Filters mock data
  // Future: Replace with TMDB API call
}
```

**To swap to TMDB later:**
1. Replace `searchMovies()` implementation with TMDB API call
2. Map TMDB response to `SearchResult` interface
3. No other code needs to change

## Data Model

Each watchlist item stores:

```typescript
{
  id: string           // Unique ID (itemId-mediaType)
  itemId: number       // Source ID (currently mock, will be TMDB ID)
  title: string
  mediaType: 'movie' | 'tv'
  posterUrl: string
  genres: string[]
  releaseYear: number
  overview: string
  rating: number
  addedAt: number      // Timestamp
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy (no environment variables needed)

The app is fully static and requires no server-side secrets.

## Future: TMDB Integration

When ready to integrate TMDB:

1. Get API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Update `src/lib/services/searchService.ts`:
   ```typescript
   export async function searchMovies(query: string): Promise<SearchResult[]> {
     const response = await fetch(
       `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${query}`
     );
     const data = await response.json();
     
     // Map TMDB results to SearchResult interface
     return data.results
       .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
       .map(item => ({
         id: item.id,
         title: item.title || item.name,
         mediaType: item.media_type,
         posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
         genres: item.genre_ids.map(id => genreMap[id]),
         releaseYear: new Date(item.release_date || item.first_air_date).getFullYear(),
         overview: item.overview,
         rating: item.vote_average
       }));
   }
   ```
3. Update `next.config.js` to allow TMDB image domains
4. No other files need changes

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** (Client components)
- **TypeScript** (Type safety)
- **LocalStorage** (Persistence)

## Project Structure Details

### `/src/lib/services/searchService.ts`

**Critical abstraction layer.** This is the single point of integration for data sources. Currently returns mock data, designed to be swapped with TMDB API without touching other code.

### `/src/lib/data/mockData.ts`

Mock dataset matching TMDB structure. Contains 15 movies and TV shows with realistic data (genres, posters, ratings).

### `/src/components/MediaCard.tsx`

Reusable card component. Displays poster prominently with title, year, type, and genres below. Supports both "Add" and "Remove" modes.

### `/src/hooks/useSimpleWatchlist.ts`

Watchlist state management. Handles adding, removing, and checking for duplicates. Syncs with localStorage automatically.

## License

MIT

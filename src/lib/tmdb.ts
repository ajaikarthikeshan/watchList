const TMDB_BASE = "https://api.themoviedb.org/3";

export type TmdbSearchResult = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
};

export type TmdbDetails = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
};

function getApiKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY;
}

export async function searchTmdb(query: string): Promise<TmdbSearchResult[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return [];
  }
  const url = new URL(`${TMDB_BASE}/search/multi`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  const response = await fetch(url.toString());
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as { results?: TmdbSearchResult[] };
  return (data.results ?? []).filter(result => result.media_type === "movie" || result.media_type === "tv");
}

export async function fetchTmdbDetails(id: number, mediaType: "movie" | "tv") {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  const url = new URL(`${TMDB_BASE}/${mediaType}/${id}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as TmdbDetails;
}

export function getYear(details: TmdbDetails) {
  const date = details.release_date ?? details.first_air_date ?? "";
  return date ? date.split("-")[0] : "";
}

export function getTitle(details: TmdbDetails) {
  return details.title ?? details.name ?? "Untitled";
}

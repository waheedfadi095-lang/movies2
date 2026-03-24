import type { MovieListItem } from "@/api/tmdb";

export async function searchLocalMovies(query: string, limit: number = 20, page: number = 1): Promise<MovieListItem[]> {
  const q = query.trim();
  if (!q) return [];
  const res = await fetch(
    `/api/tmdb-search-movies?q=${encodeURIComponent(q)}&limit=${Math.max(1, limit)}&page=${Math.max(1, page)}`
  );
  const json = await res.json();
  if (!res.ok || !json?.success || !Array.isArray(json.data)) return [];
  return json.data as MovieListItem[];
}


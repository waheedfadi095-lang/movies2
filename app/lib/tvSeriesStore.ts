import fs from "fs";
import path from "path";
import { TV_SERIES_IDS } from "@/data/tvSeriesIds";

type SeriesDoc = {
  imdb_id: string;
  tmdb_id?: number | null;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string | null;
  last_air_date?: string | null;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: string[];
  categories?: string[];
  seasons?: Array<{ episodes?: any[] }>;
};

const TMDB_API_KEY = "b31d2e5f33b74ffa7b3b483ff353f760";
const DETAILS_PATH = path.join(process.cwd(), "scripts", "tv-series-details.json");
const CACHE_TTL_MS = 10 * 60 * 1000;

let storeCache: { at: number; map: Map<string, SeriesDoc> } | null = null;

function loadDiskMap(): Map<string, SeriesDoc> {
  const map = new Map<string, SeriesDoc>();
  if (!fs.existsSync(DETAILS_PATH)) return map;
  try {
    const raw = JSON.parse(fs.readFileSync(DETAILS_PATH, "utf8"));
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (item?.imdb_id) map.set(item.imdb_id, item);
      }
    } else if (raw && typeof raw === "object") {
      for (const [imdb, item] of Object.entries(raw)) {
        if (item && typeof item === "object") {
          map.set(imdb, { ...(item as SeriesDoc), imdb_id: imdb });
        }
      }
    }
  } catch (e) {
    console.error("tvSeriesStore: failed reading disk details", e);
  }
  return map;
}

function writeDiskMap(map: Map<string, SeriesDoc>) {
  try {
    const obj: Record<string, SeriesDoc> = {};
    for (const [k, v] of map.entries()) obj[k] = v;
    fs.writeFileSync(DETAILS_PATH, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error("tvSeriesStore: failed writing disk details", e);
  }
}

function getMap(): Map<string, SeriesDoc> {
  const now = Date.now();
  if (storeCache && now - storeCache.at < CACHE_TTL_MS) return storeCache.map;
  const map = loadDiskMap();
  storeCache = { at: now, map };
  return map;
}

function normalize(id: string, map: Map<string, SeriesDoc>): SeriesDoc {
  const d = map.get(id);
  return (
    d || {
      imdb_id: id,
      tmdb_id: null,
      name: `TV Series ${id}`,
      overview: "",
      poster_path: null,
      backdrop_path: null,
      first_air_date: null,
      last_air_date: null,
      vote_average: 0,
      number_of_seasons: 0,
      number_of_episodes: 0,
      seasons: [],
      genres: [],
      categories: [],
    }
  );
}

export function getTvSeriesCount() {
  if (TV_SERIES_IDS.length > 0) return TV_SERIES_IDS.length;
  return getMap().size;
}

export function getAllSeriesIds(): string[] {
  if (TV_SERIES_IDS.length > 0) return TV_SERIES_IDS;
  return Array.from(getMap().keys());
}

/** When ID list is empty, allow lookup only for series present in local details JSON. */
export function hasSeriesInStore(imdbId: string): boolean {
  if (TV_SERIES_IDS.length > 0) return TV_SERIES_IDS.includes(imdbId);
  return getMap().has(imdbId);
}

export function getTvSeriesList(): SeriesDoc[] {
  const map = getMap();
  if (TV_SERIES_IDS.length > 0) {
    return TV_SERIES_IDS.map((id) => normalize(id, map));
  }
  if (map.size === 0) return [];
  return Array.from(map.values()).map((doc) => ({
    ...doc,
    imdb_id: doc.imdb_id || (doc as SeriesDoc).imdb_id,
  }));
}

export function getTvSeriesByImdbId(imdbId: string): SeriesDoc | null {
  const map = getMap();
  return normalize(imdbId, map) || null;
}

export function hasSeriesDetails(): boolean {
  const map = getMap();
  for (const item of map.values()) {
    if (item.tmdb_id || (item.name && !item.name.startsWith("TV Series tt"))) return true;
  }
  return false;
}

export async function getSeriesMeta(imdbId: string, enrich: boolean = false): Promise<SeriesDoc | null> {
  if (TV_SERIES_IDS.length > 0 && !TV_SERIES_IDS.includes(imdbId)) return null;
  if (!enrich) return getTvSeriesByImdbId(imdbId);
  return enrichTvSeries(imdbId);
}

export async function enrichTvSeries(imdbId: string): Promise<SeriesDoc | null> {
  const map = getMap();
  const existing = normalize(imdbId, map);
  if (existing?.tmdb_id && existing?.name && existing.name !== `TV Series ${imdbId}`) {
    return existing;
  }

  try {
    const findRes = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    if (!findRes.ok) return existing;
    const findData = await findRes.json();
    const tv = findData?.tv_results?.[0];
    if (!tv?.id) return existing;

    const detailRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!detailRes.ok) return existing;
    const d = await detailRes.json();

    const merged: SeriesDoc = {
      imdb_id: imdbId,
      tmdb_id: d.id,
      name: d.name || existing.name,
      overview: d.overview || existing.overview || "",
      poster_path: d.poster_path || existing.poster_path || null,
      backdrop_path: d.backdrop_path || existing.backdrop_path || null,
      first_air_date: d.first_air_date || existing.first_air_date || null,
      last_air_date: d.last_air_date || existing.last_air_date || null,
      vote_average: d.vote_average ?? existing.vote_average ?? 0,
      number_of_seasons: d.number_of_seasons ?? existing.number_of_seasons ?? 0,
      number_of_episodes: d.number_of_episodes ?? existing.number_of_episodes ?? 0,
      genres: Array.isArray(d.genres) ? d.genres.map((g: any) => g?.name).filter(Boolean) : existing.genres || [],
      seasons: Array.isArray(d.seasons) ? d.seasons.map((s: any) => ({ episodes: Array(s?.episode_count || 0) })) : existing.seasons || [],
      categories: existing.categories || [],
    };

    map.set(imdbId, merged);
    writeDiskMap(map);
    storeCache = { at: Date.now(), map };
    return merged;
  } catch (e) {
    console.error("tvSeriesStore: enrich failed", imdbId, e);
    return existing;
  }
}


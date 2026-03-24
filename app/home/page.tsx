"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getMoviesByImdbIds } from "@/api/tmdb";
// REMOVED: import { BULK_MOVIE_IDS } from "@/data/bulkMovieIds"; // 1.4MB - Now lazy loaded
// REMOVED: import { TV_SERIES_STATIC } from "@/data/tvSeriesStatic"; // 61MB - Now lazy loaded
import Navbar from "@/components/Navbar";
import TVNavbar from "@/components/TVNavbar";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import { getTVImageUrl } from "@/api/tmdb-tv";
import SiteLogo from "@/components/SiteLogo";
import { resolvePosterUrl } from "@/lib/poster";
import { HOME_DISPLAY_TITLES } from "@/data/homeReferenceDisplayTitles";
type HomeMovieCard = { movie: Movie; displayTitle?: string; source: "mapped" | "fallback" };

// Shared GET cache to avoid duplicate homepage requests.
const homeRequestCache = new Map<string, { at: number; data: any }>();
const homePendingRequests = new Map<string, Promise<any>>();
const HOME_CACHE_TTL_MS = 60 * 1000;

async function fetchCachedJson(url: string, ttlMs: number = HOME_CACHE_TTL_MS) {
  const now = Date.now();
  const cached = homeRequestCache.get(url);
  if (cached && now - cached.at < ttlMs) {
    return cached.data;
  }

  const pending = homePendingRequests.get(url);
  if (pending) {
    return pending;
  }

  const request = fetch(url)
    .then(async (response) => {
      const data = await response.json();
      return { ok: response.ok, data };
    })
    .finally(() => {
      homePendingRequests.delete(url);
    });

  homePendingRequests.set(url, request);
  const result = await request;
  homeRequestCache.set(url, { at: now, data: result });
  return result;
}

// --- Reference: titles + order only (layout). Data / links / posters = our app. ---

/** IMDb ids from reference hrefs — used only to seed our `getMoviesByImdbIds` pool (not for external links). */
function extractImdbIdsInItemOrder(items: any[] | undefined, max: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items || []) {
    const href = item?.href;
    const m = typeof href === "string" ? href.match(/(tt\d{6,10})/i) : null;
    if (!m) continue;
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

function normTitleKey(t: string) {
  return t.trim().toLowerCase().replace(/\s+/g, " ");
}

function titleTokens(t: string): string[] {
  return normTitleKey(t)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x.length >= 3);
}

function isKeywordMatch(movieTitle: string, refTitle: string): boolean {
  const a = titleTokens(movieTitle);
  const b = titleTokens(refTitle);
  if (a.length === 0 || b.length === 0) return false;
  const aset = new Set(a);
  let common = 0;
  for (const w of b) {
    if (aset.has(w)) common += 1;
  }
  return common >= Math.min(2, b.length);
}

function movieHasGenreId(movie: Movie, genreId: number): boolean {
  const m = movie as any;
  const genreIds = Array.isArray(m.genre_ids) ? m.genre_ids : [];
  if (genreIds.includes(genreId)) return true;
  const genres = Array.isArray(m.genres) ? m.genres : [];
  return genres.some((g: any) => Number(g?.id) === genreId);
}

function fillToMinMovies(
  movies: Movie[],
  pool: Movie[],
  min: number,
  excludedImdbIds: Set<string> = new Set(),
  preferredGenreId?: number
): Movie[] {
  const seen = new Set([...movies.map((m) => m.imdb_id), ...excludedImdbIds]);
  const out = [...movies];
  const orderedPool =
    preferredGenreId == null
      ? pool
      : [
          ...pool.filter((m) => movieHasGenreId(m, preferredGenreId)),
          ...pool.filter((m) => !movieHasGenreId(m, preferredGenreId)),
        ];
  for (const m of orderedPool) {
    if (out.length >= min) break;
    if (seen.has(m.imdb_id)) continue;
    seen.add(m.imdb_id);
    out.push(m);
  }
  return out.slice(0, min);
}

function fillToMinTv(items: any[], pool: any[], min: number): any[] {
  const key = (s: any) => String(s.tmdb_id || s.imdb_id || "");
  const seen = new Set(items.map(key).filter(Boolean));
  const out = [...items];
  for (const s of pool) {
    if (out.length >= min) break;
    const k = key(s);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out.slice(0, min);
}

function dedupeMoviesByImdb(pool: Movie[]): Movie[] {
  const seen = new Set<string>();
  const out: Movie[] = [];
  for (const m of pool) {
    if (!m?.imdb_id || seen.has(m.imdb_id)) continue;
    seen.add(m.imdb_id);
    out.push(m);
  }
  return out;
}

/** Strip " - Season N" / " Season N" from reference TV labels for matching DB `name`. */
function baseTvTitleFromRef(refTitle: string): string {
  return refTitle
    .replace(/\s*-\s*Season\s*\d+/i, "")
    .replace(/\s+Season\s*\d+/i, "")
    .trim();
}

function tvKeyVariants(refTitle: string): string[] {
  const full = normTitleKey(refTitle);
  const base = normTitleKey(baseTvTitleFromRef(refTitle));
  return [...new Set([full, base])].filter(Boolean);
}

function pickTvFromPool(refTitle: string, pool: any[], used: Set<string>): any | null {
  const keys = tvKeyVariants(refTitle);
  for (const s of pool) {
    const id = String(s.tmdb_id || s.imdb_id || "");
    if (!id || used.has(id)) continue;
    const n = normTitleKey(s.name || "");
    if (keys.some((k) => k && n === k)) return s;
  }
  const baseLabel = baseTvTitleFromRef(refTitle);
  for (const s of pool) {
    const id = String(s.tmdb_id || s.imdb_id || "");
    if (!id || used.has(id)) continue;
    if (isKeywordMatch(s.name || "", baseLabel)) return s;
  }
  return null;
}

async function resolveTvFromSearch(refTitle: string, used: Set<string>): Promise<any | null> {
  const q = baseTvTitleFromRef(refTitle);
  if (q.length < 2) return null;
  const { ok, data } = await fetchCachedJson(
    `/api/tv-series-search?q=${encodeURIComponent(q)}&limit=6`
  );
  if (!ok || !data?.success || !Array.isArray(data.data)) return null;
  const want = normTitleKey(q);
  const candidates = data.data as any[];
  let s =
    candidates.find((x) => normTitleKey(x.name || "") === want) ||
    candidates.find((x) => isKeywordMatch(x.name || "", q)) ||
    candidates[0];
  if (!s) return null;
  const id = String(s.tmdb_id || s.imdb_id || "");
  if (!id || used.has(id)) return null;
  return s;
}

async function buildTvRowFromDisplayTitles(
  refTitles: string[],
  tvPool: any[],
  min: number,
  maxSearchLookups: number = 0
): Promise<any[]> {
  const used = new Set<string>();
  const out: any[] = [];
  let lookups = 0;
  for (const t of refTitles.slice(0, min)) {
    let s = pickTvFromPool(t, tvPool, used);
    if (!s && lookups < maxSearchLookups) {
      lookups += 1;
      s = await resolveTvFromSearch(t, used);
    }
    if (s) {
      const id = String(s.tmdb_id || s.imdb_id);
      used.add(id);
      out.push(s);
    }
  }
  return fillToMinTv(out, tvPool, min);
}

async function buildOrderedMovieCardsFromTitles(
  titles: string[],
  pool: Movie[],
  min: number,
  blockedFromOutput: Set<string>
): Promise<HomeMovieCard[]> {
  const out: Movie[] = [];
  const displayByImdb = new Map<string, string>();
  const blocked = new Set(blockedFromOutput);
  for (const t of titles.slice(0, min)) {
    let m = pool.find(
      (x) => x.imdb_id && !blocked.has(x.imdb_id) && normTitleKey(x.title || "") === normTitleKey(t)
    );
    if (!m) {
      m = pool.find(
        (x) => x.imdb_id && !blocked.has(x.imdb_id) && isKeywordMatch(x.title || "", t)
      );
    }
    if (m) {
      out.push(m);
      blocked.add(m.imdb_id);
      if (m.imdb_id && !displayByImdb.has(m.imdb_id)) {
        displayByImdb.set(m.imdb_id, t);
      }
    }
  }
  const filled = fillToMinMovies(out, pool, min, blockedFromOutput, 12);
  const mappedIds = new Set(out.map((m) => m.imdb_id).filter(Boolean));
  return filled.map((movie) => ({
    movie,
    displayTitle: displayByImdb.get(movie.imdb_id),
    source: mappedIds.has(movie.imdb_id) ? "mapped" : "fallback",
  }));
}

/** When batch JSON pools are empty, fill from VidSrc IMDB list + TMDB (posters optional). */
async function hydratePoolFromVidSrcList(maxIds: number): Promise<Movie[]> {
  const { ok, data } = await fetchCachedJson(
    `/api/movies/list?offset=0&limit=${Math.min(500, maxIds * 4)}&order=desc`
  );
  if (!ok || !Array.isArray(data?.imdb_ids) || data.imdb_ids.length === 0) return [];
  const ids = (data.imdb_ids as string[]).slice(0, maxIds).filter(Boolean);
  if (!ids.length) return [];
  return getMoviesByImdbIds(ids, { allowMissingPoster: true });
}

/** Movie poster: only TMDB / our poster_path (no external hotlink). */
function getMovieCardPoster(movie: Movie): string {
  return resolvePosterUrl(movie.poster_path, "w500");
}

/** TV poster: TMDB image host or placeholder (no third-party CDN on cards). */
function getTvCardPoster(posterPath: string | null | undefined): string {
  if (!posterPath?.trim()) return "/placeholder.svg";
  const p = posterPath.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p.includes("image.tmdb.org") ? p : "/placeholder.svg";
  }
  return getTVImageUrl(p, "w500");
}

// TV Search Modal Component
function TVSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSuggestions([]);
      setPage(1);
      setTotal(0);
      setPages(0);
      setHasMore(false);
    }
  }, [isOpen]);

  const fetchSuggestions = async (targetPage: number, append: boolean) => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setTotal(0);
      setPages(0);
      setHasMore(false);
      return;
    }

    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const url = `/api/tv-series-search?q=${encodeURIComponent(searchTerm)}&page=${targetPage}&limit=${LIMIT}&enrich=1`;
      const { ok, data } = await fetchCachedJson(url, 2 * 60 * 1000);
      if (ok && data.success && Array.isArray(data.data)) {
        setSuggestions((prev) => (append ? [...prev, ...data.data] : data.data));
        const p = data.pagination || {};
        setPage(p.page || targetPage);
        setTotal(p.total || data.data.length);
        setPages(p.pages || 1);
        setHasMore(Boolean(p.hasMore));
      } else if (!append) {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching TV series:", error);
      if (!append) setSuggestions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(1, false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSuggestionClick = (series: any) => {
    const slug = series.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    window.location.href = `/${slug}-${series.tmdb_id || series.imdb_id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🔍 Search TV Series</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="text"
            placeholder="Search TV series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-purple-400 font-semibold">💡 TV Series:</h4>
            {suggestions.map((series, index) => (
              <button
                key={`${series.imdb_id}-${index}`}
                onClick={() => handleSuggestionClick(series)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="relative w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={series.poster_path ? getTVImageUrl(series.poster_path, 'w500') : '/placeholder.svg'}
                    alt={series.name}
                    width={48}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{series.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'} • 
                    {series.number_of_seasons} seasons • 
                    ⭐ {series.vote_average?.toFixed(1) || 'N/A'}
                  </p>
                </div>
              </button>
            ))}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>
                Showing {suggestions.length} of {total}
              </span>
              {hasMore && (
                <button
                  onClick={() => fetchSuggestions(page + 1, true)}
                  disabled={loadingMore}
                  className="rounded bg-purple-600 px-3 py-1 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : `Load More (${page + 1}/${Math.max(1, pages)})`}
                </button>
              )}
            </div>
          </div>
        )}

        {searchTerm.length > 0 && suggestions.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">No TV series found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// TV Series Display Component - Lazy Loading for Categories
function TVSeriesDisplay({ activeCategory, categoryConfig }: { activeCategory: string, categoryConfig: any[] }) {
  const [displayCount, setDisplayCount] = useState(7); // Load only 7 initially
  const [categorySeriesByName, setCategorySeriesByName] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  
  // Load series data for specific category (lazy loading)
  useEffect(() => {
    // If category already loaded, don't reload
    if (categorySeriesByName[activeCategory]) {
      return;
    }
    
    setLoading(true);
    
    // Determine filters per category, but keep latest-first ordering everywhere.
    let sortBy = 'first_air_date';
    let sortOrder = 'desc';
    let additionalFilters = '';
    
    if (activeCategory === 'Popular') {
      // Strongly separate from Featured so rows are not near-identical.
      additionalFilters = '&minRating=6.5&maxRating=8.4&minYear=2018';
    } else if (activeCategory === 'Featured') {
      additionalFilters = '&minRating=8.5&minYear=2015';
    } else if (activeCategory === 'Classic Shows') {
      sortBy = 'first_air_date';
      sortOrder = 'desc';
      additionalFilters = '&maxYear=2010'; // latest titles inside classic window
    } else if (activeCategory === 'Trending') {
      sortBy = 'first_air_date';
      sortOrder = 'desc';
      additionalFilters = '&minYear=2020'; // Recent shows
    } else if (activeCategory === 'New Releases') {
      sortBy = 'first_air_date';
      sortOrder = 'desc';
      additionalFilters = '&minYear=2023'; // Very recent shows
    }
    
    // Fetch only 14 series for category (fast loading)
    const url = `/api/tv-series-db?limit=14&sortBy=${sortBy}&sortOrder=${sortOrder}${additionalFilters}`;
    fetchCachedJson(url)
      .then(({ ok, data: result }) => {
        if (ok && result.success && result.data) {
          const seriesData = result.data.map((data: any) => ({
            imdbId: data.imdb_id,
          tmdbId: data.tmdb_id,
            name: data.name || `TV Series ${data.imdb_id}`,
          poster: data.poster_path,
          backdrop: data.backdrop_path,
          overview: data.overview,
          firstAirDate: data.first_air_date,
          voteAverage: data.vote_average || 0,
            episodeCount:
              data.number_of_episodes ||
              data.seasons?.reduce((sum: number, season: any) => sum + (season?.episodes?.length || 0), 0) ||
              0,
          numberOfSeasons: data.number_of_seasons || data.seasons?.length || 0
        }));
      
          setCategorySeriesByName((prev) => ({ ...prev, [activeCategory]: seriesData }));
        }
      setLoading(false);
      })
      .catch(error => {
      console.error('Error loading TV series data:', error);
      setLoading(false);
    });
  }, [activeCategory, categorySeriesByName]);
  
  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(7);
  }, [activeCategory]);
  
  // Get series for current category (from loaded data)
  const categorySeries = categorySeriesByName[activeCategory] || [];
  const displaySeries = categorySeries.slice(0, displayCount);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-pulse">📺</div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading TV Series...</h2>
        <p className="text-gray-400">Processing series data, please wait...</p>
        <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-[#3fae2a] rounded-full animate-pulse" style={{width: '60%'}}></div>
        </div>
      </div>
    );
  }

  if (categorySeries.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📺</div>
        <h2 className="text-2xl font-bold text-white mb-2">No TV Series Available</h2>
        <p className="text-gray-400">No TV series found in {activeCategory}.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile: 2 columns (bigger posters like 123movies), Desktop: dense grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {displaySeries.map((series, index) => (
          <Link
            key={`tv-${String(series.tmdbId ?? series.imdbId ?? index)}-${index}`}
            href={`/${series.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${series.tmdbId || series.imdbId}`}
            className="group"
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
              {/* Poster */}
              <div className="relative aspect-[2/3] bg-gray-700">
                {series.poster ? (
                  <Image
                    src={getTVImageUrl(series.poster, 'w500')}
                    alt={series.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📺</div>
                      <div className="text-white text-sm font-semibold">TV Series</div>
                    </div>
                  </div>
                )}
                {/* TV Badge - same green as site */}
                <div className="absolute top-2 left-2 bg-[#3fae2a] bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                  TV
                </div>
                {/* Rating Badge */}
                {series.voteAverage > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                    ⭐ {series.voteAverage.toFixed(1)}
                  </div>
                )}
                {/* Episode Count Badge */}
                {series.episodeCount > 0 && (
                  <div className="absolute bottom-2 right-2 bg-[#3fae2a] bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                    {series.episodeCount} eps
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                  {series.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {series.firstAirDate ? series.firstAirDate.split('-')[0] : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    📺 Series
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Load More Button */}
      {displayCount < categorySeries.length && (
        <div className="text-center mt-6">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 7, categorySeries.length))}
              className="bg-[#3fae2a] hover:bg-[#35a024] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
            Load More ({categorySeries.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<{[key: string]: Movie[]}>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Suggestions");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  /** Homepage movies: our API/TMDB; reference only supplies title order. */
  const [homeSuggestionMovies, setHomeSuggestionMovies] = useState<HomeMovieCard[]>([]);
  const [homeLatestMovies, setHomeLatestMovies] = useState<HomeMovieCard[]>([]);
  /** Latest TV row on movies home — always `/api/tv-series-db` (+ optional reorder by ref titles). */
  const [homeLatestTvSeries, setHomeLatestTvSeries] = useState<any[]>([]);
  const [suggestionsReady, setSuggestionsReady] = useState(false);
  const [latestMoviesReady, setLatestMoviesReady] = useState(false);
  const [latestTvReady, setLatestTvReady] = useState(false);
  const [movieDisplayCount, setMovieDisplayCount] = useState(14); // Load 14 movies at a time
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [latestTvSeries, setLatestTvSeries] = useState<any[]>([]);
  const [popularTvSeries, setPopularTvSeries] = useState<any[]>([]);
  const [featuredTvSeries, setFeaturedTvSeries] = useState<any[]>([]);
  const [tvHomeLoading, setTvHomeLoading] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(12);
  const DISPLAY_COUNT = 16;
  const homeGridClass =
    "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4";
  
  // Mode switching state - Default to MOVIES
  const [currentMode, setCurrentMode] = useState<'movies' | 'tv'>('movies');
  
  // TV Search Modal state
  const [isTVSearchOpen, setIsTVSearchOpen] = useState(false);
  const didInitSectionsRef = useRef(false);
  const didLoadTvSectionsRef = useRef(false);
  
  // Load saved mode from localStorage on mount (ONLY if explicitly set)
  useEffect(() => {
    const savedMode = localStorage.getItem('homepageMode') as 'movies' | 'tv' | null;
    // Only switch to TV if savedMode is explicitly 'tv' AND user came from /home
    // Don't auto-load TV mode - let user switch manually
    if (savedMode === 'tv' && window.location.pathname === '/home') {
      setCurrentMode('tv');
      setActiveCategory('New Releases');
    } else {
      // Always default to movies mode
      setCurrentMode('movies');
      setActiveCategory('Suggestions');
      localStorage.setItem('homepageMode', 'movies');
    }
  }, []);

  const movieCategoryConfig = [
    { name: "Suggestions", startIndex: 0, count: 14 },
    { name: "Trending Now", startIndex: 200, count: 14 },
    { name: "Top Rated", startIndex: 300, count: 14 }
  ];

  const tvCategoryConfig = [
    { name: "New Releases", startIndex: 0, count: 14 },      // Latest series available (fast loading)
    { name: "Popular", startIndex: 100, count: 14 },         // Next batch
    { name: "Featured", startIndex: 200, count: 14 },        // Featured content
    { name: "Classic Shows", startIndex: 500, count: 14 },   // Older classics
    { name: "Trending", startIndex: 1000, count: 14 }        // Different range
  ];

  const categoryConfig = currentMode === 'movies' ? movieCategoryConfig : tvCategoryConfig;

  // Keep homepage sections to exactly 2 rows like reference site.
  // We approximate columns by viewport width.
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // Bigger cards => fewer columns
      if (w >= 1280) return 10; // xl
      if (w >= 1024) return 8; // lg
      if (w >= 768) return 6; // md
      if (w >= 640) return 4; // sm
      return 2; // mobile
    };
    const apply = () => setItemsPerRow(compute());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Reference: titles/order only. Movies: getMoviesByImdbIds + reorder + fill. TV row (movies home): tv-series-db + reorder.
  useEffect(() => {
    if (didInitSectionsRef.current) return;
    didInitSectionsRef.current = true;
    const limit = DISPLAY_COUNT;
    const initialMoviePoolLimit = Math.min(32, Math.max(24, limit * 2));
    (async () => {
      try {
        // Stage 1: must-have minimum data only (fast first paint).
        const refRes = await fetchCachedJson(`/api/reference/home`);
        const mappedRes = await fetchCachedJson(`/api/reference/home-mapped`);
        const suggestPoolRes = await fetchCachedJson(
          `/api/movies/latest?category=suggestions&limit=${limit}`
        );

        const suggestPool: Movie[] =
          suggestPoolRes.ok && Array.isArray(suggestPoolRes.data?.movies) ? suggestPoolRes.data.movies : [];
        let latestPool: Movie[] = [];
        let topPool: Movie[] = [];
        let tvPool: any[] = [];

        // Canonical row order = your static lists (reference layout guide).
        const refSuggestTitles = [...HOME_DISPLAY_TITLES.suggestions].slice(0, limit);
        const refLatestTitles = [...HOME_DISPLAY_TITLES.latestMovies].slice(0, limit);
        const refTvTitles = [...HOME_DISPLAY_TITLES.latestTvSeries].slice(0, limit);

        const mappedSuggestIds =
          mappedRes.ok && Array.isArray(mappedRes.data?.suggestionsImdbIds)
            ? mappedRes.data.suggestionsImdbIds.slice(0, limit * 3)
            : [];
        const mappedLatestIds =
          mappedRes.ok && Array.isArray(mappedRes.data?.latestMoviesImdbIds)
            ? mappedRes.data.latestMoviesImdbIds.slice(0, limit * 3)
            : [];
        const refSuggIds =
          mappedSuggestIds.length > 0
            ? mappedSuggestIds
            : refRes.ok && refRes.data
              ? extractImdbIdsInItemOrder(refRes.data.suggestions, limit * 3)
              : [];
        const refLatestIds =
          mappedLatestIds.length > 0
            ? mappedLatestIds
            : refRes.ok && refRes.data
              ? extractImdbIdsInItemOrder(refRes.data.latestMovies, limit * 3)
              : [];
        const refIdUnion = [...new Set([...refSuggIds, ...refLatestIds])];
        const refMovies = refIdUnion.length
          ? await getMoviesByImdbIds(refIdUnion, { allowMissingPoster: true })
          : [];

        let moviePoolDeduped = dedupeMoviesByImdb([...refMovies, ...suggestPool]);

        // Minimal fallback just for Suggestions first paint.
        if (moviePoolDeduped.length < Math.min(24, limit * 2)) {
          const viaList = await hydratePoolFromVidSrcList(Math.max(40, limit * 3));
          moviePoolDeduped = dedupeMoviesByImdb([...moviePoolDeduped, ...viaList]);
        }

        let suggMovies = await buildOrderedMovieCardsFromTitles(
          refSuggestTitles,
          moviePoolDeduped,
          limit,
          new Set()
        );
        if (suggMovies.length === 0 && moviePoolDeduped.length > 0) {
          suggMovies = fillToMinMovies([], moviePoolDeduped, limit, new Set(), 12).map((movie) => ({
            movie,
            source: "fallback" as const,
          }));
        }
        setHomeSuggestionMovies(suggMovies);
        setSuggestionsReady(true);
        setLoading(false);

        // Stage 2: Latest Movies (sequential after Suggestions ready)
        const [latestPoolRes, topPoolRes] = await Promise.all([
          fetchCachedJson(`/api/movies/latest?category=latest&limit=${initialMoviePoolLimit}`),
          fetchCachedJson(`/api/movies/latest?category=top_rated&limit=${initialMoviePoolLimit}`),
        ]);
        latestPool =
          latestPoolRes.ok && Array.isArray(latestPoolRes.data?.movies) ? latestPoolRes.data.movies : [];
        topPool = topPoolRes.ok && Array.isArray(topPoolRes.data?.movies) ? topPoolRes.data.movies : [];
        moviePoolDeduped = dedupeMoviesByImdb([...moviePoolDeduped, ...latestPool, ...topPool]);

        const usedInSuggestions = new Set(
          suggMovies.map((c) => c.movie.imdb_id).filter((id): id is string => Boolean(id))
        );
        let latestM = await buildOrderedMovieCardsFromTitles(
          refLatestTitles,
          moviePoolDeduped,
          limit,
          usedInSuggestions
        );
        if (latestM.length === 0 && moviePoolDeduped.length > 0) {
          latestM = fillToMinMovies([], moviePoolDeduped, limit, usedInSuggestions, 12).map((movie) => ({
            movie,
            source: "fallback" as const,
          }));
        }
        setHomeLatestMovies(latestM);
        setLatestMoviesReady(true);

        // Stage 3: Latest TV-Series (sequential after Latest Movies)
        const tvDbRes = await fetchCachedJson(
          `/api/tv-series-db?limit=80&skip=0&sortBy=first_air_date&sortOrder=desc`
        );
        tvPool =
          tvDbRes.ok && tvDbRes.data?.success && Array.isArray(tvDbRes.data?.data) ? tvDbRes.data.data : [];
        let tvRow = await buildTvRowFromDisplayTitles(refTvTitles, tvPool, limit, 0);
        if (tvRow.length === 0) {
          const tvFb = await fetchCachedJson(
            `/api/tv-series-db?limit=${limit}&skip=0&sortBy=first_air_date&sortOrder=desc`
          );
          const raw =
            tvFb.ok && tvFb.data?.success && Array.isArray(tvFb.data?.data) ? tvFb.data.data : [];
          tvRow = fillToMinTv([], raw, limit);
        }
        setHomeLatestTvSeries(tvRow);
        setLatestTvReady(true);
      } catch (error) {
        console.error("Homepage sections (ref order + our data):", error);
        try {
          const [suggestionsRes, latestRes, tvDbRes] = await Promise.all([
            fetchCachedJson(`/api/movies/latest?category=suggestions&limit=${limit}`),
            fetchCachedJson(`/api/movies/latest?category=latest&limit=${limit}`),
            fetchCachedJson(
              `/api/tv-series-db?limit=${limit}&skip=0&sortBy=first_air_date&sortOrder=desc`
            ),
          ]);
          if (suggestionsRes.ok && Array.isArray(suggestionsRes.data?.movies)) {
            const s = fillToMinMovies(suggestionsRes.data.movies, suggestionsRes.data.movies, limit, new Set(), 12)
              .map((movie) => ({ movie, source: "fallback" as const }));
            setHomeSuggestionMovies(s);
            setSuggestionsReady(true);
          }
          if (latestRes.ok && Array.isArray(latestRes.data?.movies)) {
            const used = new Set<string>(
              (suggestionsRes.ok && Array.isArray(suggestionsRes.data?.movies)
                ? suggestionsRes.data.movies
                : []
              )
                .slice(0, limit)
                .map((m: Movie) => m.imdb_id)
                .filter((id: string | undefined): id is string => Boolean(id))
            );
            const l = fillToMinMovies(latestRes.data.movies, latestRes.data.movies, limit, used, 12)
              .map((movie) => ({ movie, source: "fallback" as const }));
            setHomeLatestMovies(l);
            setLatestMoviesReady(true);
          }
          if (tvDbRes.ok && tvDbRes.data?.success && Array.isArray(tvDbRes.data?.data)) {
            setHomeLatestTvSeries(tvDbRes.data.data.slice(0, limit));
            setLatestTvReady(true);
          }
        } catch (e2) {
          console.error("Homepage fallback failed:", e2);
        }
      } finally {
        setSuggestionsReady(true);
        setLatestMoviesReady(true);
        setLatestTvReady(true);
      }
    })();
  }, [DISPLAY_COUNT]);

  // Load TV homepage sections once so movie + tv mode latest list stays consistent.
  useEffect(() => {
    if (didLoadTvSectionsRef.current) return;
    didLoadTvSectionsRef.current = true;

    (async () => {
      setTvHomeLoading(true);
      const [tvSectionsRes] = await Promise.allSettled([
        fetchCachedJson(`/api/tv-series/home-sections?limit=${DISPLAY_COUNT}`),
      ]);

      if (
        tvSectionsRes.status === "fulfilled" &&
        tvSectionsRes.value.ok &&
        tvSectionsRes.value.data?.success
      ) {
        const sections = tvSectionsRes.value.data.sections || {};
        if (Array.isArray(sections.latest) && sections.latest.length > 0) {
          setLatestTvSeries(sections.latest);
        }
        if (Array.isArray(sections.popular) && sections.popular.length > 0) {
          setPopularTvSeries(sections.popular);
        } else {
          setPopularTvSeries([]);
        }
        if (Array.isArray(sections.featured) && sections.featured.length > 0) {
          setFeaturedTvSeries(sections.featured);
        } else {
          setFeaturedTvSeries([]);
        }
      } else {
        setLatestTvSeries([]);
        setPopularTvSeries([]);
        setFeaturedTvSeries([]);
      }
      setTvHomeLoading(false);
    })();
  }, [DISPLAY_COUNT]);

  // Mode switching functions
  const switchToMovies = () => {
    setCurrentMode('movies');
    setActiveCategory('Suggestions');
    // Notify navbar component
    window.dispatchEvent(new CustomEvent('homepageModeChange', { detail: { mode: 'movies' } }));
    localStorage.setItem('homepageMode', 'movies');
  };

  const switchToTV = () => {
    setCurrentMode('tv');
    setActiveCategory('New Releases');
    // Notify navbar component
    window.dispatchEvent(new CustomEvent('homepageModeChange', { detail: { mode: 'tv' } }));
    localStorage.setItem('homepageMode', 'tv');
  };

  const loadAllCategories = async () => {
    setLoading(true);
    try {
      // 1) Fast first paint: load Suggestions first.
      const { ok: suggestionsOk, data: suggestionsData } = await fetchCachedJson(
        `/api/movies/latest?category=suggestions&limit=${DISPLAY_COUNT}`
      );
      if (suggestionsOk && Array.isArray(suggestionsData.movies) && suggestionsData.movies.length > 0) {
        setCategories((prev) => ({ ...prev, Suggestions: suggestionsData.movies }));
        setAllMovies((prev) => (prev && prev.length > 0 ? prev : suggestionsData.movies));
      }
      setLoading(false);

      // 2) Background: load other movie sections.
      const [latestRes] = await Promise.allSettled([
        fetchCachedJson(`/api/movies/latest?category=latest&limit=${DISPLAY_COUNT}`),
      ]);

      if (
        latestRes.status === "fulfilled" &&
        latestRes.value.ok &&
        Array.isArray(latestRes.value.data?.movies)
      ) {
        setLatestMovies(latestRes.value.data.movies);
      }

    } catch (error) {
      console.error('Error loading categories progressively:', error);
      setLoading(false);
    }
  };

  const loadCategoriesIndividually = async () => {
    try {
      const categoriesData: {[key: string]: Movie[]} = {};
      
      for (const category of categoryConfig) {
        // Map category names to API categories
        const apiCategoryMap: {[key: string]: string} = {
          "Suggestions": "suggestions",
          "Trending Now": "trending",
          "Top Rated": "top_rated",
          "TV Shows": "tv_shows"
        };
        
        const apiCategory = apiCategoryMap[category.name] || "latest";
        const { ok: responseOk, data } = await fetchCachedJson(`/api/movies/latest?category=${apiCategory}&limit=${category.count}`);
        
        if (responseOk && data.movies && data.movies.length > 0) {
          console.log(`✅ ${category.name}: ${data.movies.length} movies loaded`);
          categoriesData[category.name] = data.movies;
        } else {
          console.log(`⚠️ ${category.name}: Using fallback - fetching slice from API (no client big file)`);
          const { data: listData } = await fetchCachedJson(`/api/movies/list?offset=${category.startIndex}&limit=${category.count}&order=desc`);
          const movieIds = (listData.imdb_ids || []) as string[];
          const moviesData = movieIds.length ? await getMoviesByImdbIds(movieIds) : [];
          categoriesData[category.name] = moviesData;
        }
      }
      
      // Never overwrite Suggestions if it was already set (e.g. from reference mapping)
      setCategories((prev) => {
        const next = { ...prev, ...categoriesData };
        if (prev.Suggestions) {
          next.Suggestions = prev.Suggestions;
        }
        return next;
      });
      
      // Set initial movies to suggestions only if allMovies is still empty
      if (categoriesData["Suggestions"]) {
        setAllMovies((prev) =>
          prev && prev.length > 0 ? prev : categoriesData["Suggestions"]!
        );
      }
    } catch (error) {
      console.error('Error loading categories individually:', error);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setMovieDisplayCount(14); // Reset to 14 when category changes
    if (categoryName === "TV Shows") {
      // Show coming soon message for TV Shows
      setAllMovies([]);
    } else if (categories[categoryName]) {
      setAllMovies(categories[categoryName]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2]">

      {/* Hero (reference-like card slider look) */}
      <div className="w-full pt-0">
        <div className="bg-white shadow rounded-b overflow-hidden w-full">
          <div className="relative h-[220px] md:h-[320px]">
            <Image
              src="https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg"
              alt="Featured"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block w-full max-w-xl px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentMode === "movies" ? "Featured Movie" : "Featured TV"}
              </h2>
              <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                {currentMode === "movies"
                  ? "Watch HD Movies Online Free"
                  : "Watch HD TV Series Online Free"}
              </p>
              {/* Movies / TV switch (bigger + centered like reference) */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <button
                  onClick={switchToMovies}
                  className={`px-6 py-3 rounded-md font-bold text-base transition-colors ${
                    currentMode === "movies"
                      ? "bg-[#79c142] text-white"
                      : "bg-white/90 text-gray-900 hover:bg-white"
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={switchToTV}
                  className={`px-6 py-3 rounded-md font-bold text-base transition-colors ${
                    currentMode === "tv"
                      ? "bg-[#79c142] text-white"
                      : "bg-white/90 text-gray-900 hover:bg-white"
                  }`}
                >
                  TV Series
                </button>
              </div>
              <Link
                href={currentMode === "movies" ? "/movies" : "/series"}
                className="inline-block bg-[#79c142] hover:bg-[#6bb23a] text-white px-5 py-2 rounded font-semibold"
              >
                Watch Now
              </Link>
            </div>

            {/* Mobile switch (bigger + centered) */}
            <div className="absolute bottom-4 left-4 right-4 md:hidden flex items-center justify-center">
              <div className="w-full max-w-[360px] flex items-center justify-center gap-4">
              <button
                onClick={switchToMovies}
                className={`flex-1 py-3 rounded-md font-bold text-base transition-colors ${
                  currentMode === "movies"
                    ? "bg-[#79c142] text-white"
                    : "bg-white/90 text-gray-900"
                }`}
              >
                Movies
              </button>
              <button
                onClick={switchToTV}
                className={`flex-1 py-3 rounded-md font-bold text-base transition-colors ${
                  currentMode === "tv"
                    ? "bg-[#79c142] text-white"
                    : "bg-white/90 text-gray-900"
                }`}
              >
                TV Series
              </button>
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div key={dot} className="w-2 h-2 bg-white/80 rounded-full opacity-70" />
              ))}
            </div>
          </div>
          <div className="px-4 py-3 text-sm text-gray-700">
            Like and Share our website to support us.
          </div>
        </div>
      </div>

      {/* Ads notice (reference info box) */}
      <div className="w-full mt-3 px-0">
        <div className="bg-[#d1ecf1] text-[#0c5460] text-center rounded-none px-4 py-3 shadow">
          Ads can be a pain, but they are our only way to maintain the server. Your patience is highly appreciated and we hope our service can be worth it.
        </div>
      </div>

      <div className="w-full px-0 py-6">
        {/* Sections like reference site */}
        <div className="space-y-6 px-3 sm:px-4">
          {currentMode === "movies" ? (
            <>
              {/* Suggestions */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Suggestions
                  </div>
                </div>
                {!suggestionsReady ? (
                  <div className={homeGridClass}>
                    {Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
                      <div key={i} className="bg-white rounded shadow overflow-hidden">
                        <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                        <div className="h-8 bg-black/80" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={homeGridClass}>
                    {homeSuggestionMovies.slice(0, DISPLAY_COUNT).map((card, index: number) => (
                      <Link
                        key={`${card.movie.imdb_id}-${index}`}
                        href={generateMovieUrl(card.movie.title, card.movie.imdb_id)}
                        className="group block"
                      >
                        <div className="bg-white rounded shadow overflow-hidden">
                          <div className="relative aspect-[2/3]">
                            <img
                              src={getMovieCardPoster(card.movie)}
                              alt={card.displayTitle || card.movie.title}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              HD
                            </span>
                          </div>
                          <div className="bg-black px-2 py-2">
                            <div className="text-white text-xs font-semibold line-clamp-1">
                              {card.displayTitle || card.movie.title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Latest Movies */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Latest Movies
                  </div>
                </div>
                {!latestMoviesReady ? (
                  <div className={homeGridClass}>
                    {Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
                      <div key={`latest-m-skel-${i}`} className="bg-white rounded shadow overflow-hidden">
                        <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                        <div className="h-8 bg-black/80" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={homeGridClass}>
                    {homeLatestMovies.slice(0, DISPLAY_COUNT).map((card, index: number) => (
                    <Link
                      key={`latest-m-${card.movie.imdb_id ?? index}-${index}`}
                      href={generateMovieUrl(card.movie.title, card.movie.imdb_id)}
                      className="group block"
                    >
                      <div className="bg-white rounded shadow overflow-hidden">
                        <div className="relative aspect-[2/3]">
                          <img
                            src={getMovieCardPoster(card.movie)}
                            alt={card.displayTitle || card.movie.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            HD
                          </span>
                        </div>
                        <div className="bg-black px-2 py-2">
                          <div className="text-white text-xs font-semibold line-clamp-1">
                            {card.displayTitle || card.movie.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Latest TV-Series */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Latest TV-Series
                  </div>
                </div>
                <div className={homeGridClass}>
                  {!latestTvReady
                    ? Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
                        <div key={`tv-m-skel-${i}`} className="bg-white rounded shadow overflow-hidden">
                          <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                          <div className="h-8 bg-black/80" />
                        </div>
                      ))
                    : homeLatestTvSeries.slice(0, DISPLAY_COUNT).map((series: any, index: number) => {
                        const name = series.name || `TV Series ${series.imdb_id || series.tmdb_id || index}`;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                        const href = `/${slug}-${series.tmdb_id || series.tmdbId || series.imdb_id || series.imdbId || ""}`;
                        const eps =
                          series?.seasons?.reduce?.((sum: number, s: any) => sum + (s?.episodes?.length || 0), 0) ||
                          series?.episodeCount ||
                          0;
                        return (
                          <Link key={`tv-latest-moviesmode-${series.tmdb_id ?? series.imdb_id ?? index}-${index}`} href={href} className="group block">
                            <div className="bg-white rounded shadow overflow-hidden">
                              <div className="relative aspect-[2/3]">
                                <img
                                  src={getTvCardPoster(series.poster_path)}
                                  alt={name}
                                  loading="lazy"
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                                <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                  TV
                                </span>
                                {eps > 0 && (
                                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                    Eps {eps}
                                  </span>
                                )}
                              </div>
                              <div className="bg-black px-2 py-2">
                                <div className="text-white text-xs font-semibold line-clamp-1">
                                  {name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Latest TV-Series */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Latest TV-Series
                  </div>
                </div>
                <div className={homeGridClass}>
                  {tvHomeLoading ? (
                    Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
                      <div key={`tv-latest-skel-${i}`} className="bg-white rounded shadow overflow-hidden">
                        <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
                        <div className="h-8 bg-black/80" />
                      </div>
                    ))
                  ) : (
                    latestTvSeries.slice(0, DISPLAY_COUNT).map((series: any, index: number) => {
                        const name = series.name || `TV Series ${series.imdb_id || series.tmdb_id || index}`;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                        const href = `/${slug}-${series.tmdb_id || series.tmdbId || series.imdb_id || series.imdbId || ""}`;
                        const eps =
                          series?.seasons?.reduce?.((sum: number, s: any) => sum + (s?.episodes?.length || 0), 0) ||
                          series?.episodeCount ||
                          0;
                        return (
                          <Link key={`tv-latest-${series.tmdb_id ?? series.imdb_id ?? index}-${index}`} href={href} className="group block">
                            <div className="bg-white rounded shadow overflow-hidden">
                              <div className="relative aspect-[2/3]">
                                <img
                                  src={getTvCardPoster(series.poster_path)}
                                  alt={name}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                                <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                  TV
                                </span>
                                {eps > 0 && (
                                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                    Eps {eps}
                                  </span>
                                )}
                              </div>
                              <div className="bg-black px-2 py-2">
                                <div className="text-white text-xs font-semibold line-clamp-1">
                                  {name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                  )}
                </div>
              </section>

              {/* Popular TV-Series */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Popular TV-Series
                  </div>
                </div>
                <div className={homeGridClass}>
                  {popularTvSeries.length === 0 && !tvHomeLoading ? (
                    <div className="col-span-full rounded bg-white px-4 py-8 text-center text-gray-600">
                      Popular TV-Series abhi load nahi hui, refresh karke check karein.
                    </div>
                  ) : (
                    popularTvSeries.slice(0, DISPLAY_COUNT).map((series: any, index: number) => {
                    const name = series.name || `TV Series ${series.imdb_id || series.tmdb_id || index}`;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    const href = `/${slug}-${series.tmdb_id || series.tmdbId || series.imdb_id || series.imdbId || ""}`;
                    const eps =
                      series?.seasons?.reduce?.((sum: number, s: any) => sum + (s?.episodes?.length || 0), 0) ||
                      series?.episodeCount ||
                      0;
                    return (
                      <Link key={`tv-popular-${series.tmdb_id ?? series.imdb_id ?? index}-${index}`} href={href} className="group block">
                        <div className="bg-white rounded shadow overflow-hidden">
                          <div className="relative aspect-[2/3]">
                            <img
                              src={getTvCardPoster(series.poster_path)}
                              alt={name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              TV
                            </span>
                            {eps > 0 && (
                              <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                Eps {eps}
                              </span>
                            )}
                          </div>
                          <div className="bg-black px-2 py-2">
                            <div className="text-white text-xs font-semibold line-clamp-1">
                              {name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }))}
                </div>
              </section>

              {/* Featured TV-Series */}
              <section>
                <div className="mb-3">
                  <div className="inline-flex items-center bg-[#79c142] text-white text-base md:text-lg font-bold px-4 py-2 rounded">
                    Featured TV-Series
                  </div>
                </div>
                <div className={homeGridClass}>
                  {featuredTvSeries.length === 0 && !tvHomeLoading ? (
                    <div className="col-span-full rounded bg-white px-4 py-8 text-center text-gray-600">
                      Featured TV-Series abhi load nahi hui, refresh karke check karein.
                    </div>
                  ) : (
                    featuredTvSeries.slice(0, DISPLAY_COUNT).map((series: any, index: number) => {
                    const name = series.name || `TV Series ${series.imdb_id || series.tmdb_id || index}`;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    const href = `/${slug}-${series.tmdb_id || series.tmdbId || series.imdb_id || series.imdbId || ""}`;
                    const eps =
                      series?.seasons?.reduce?.((sum: number, s: any) => sum + (s?.episodes?.length || 0), 0) ||
                      series?.episodeCount ||
                      0;
                    return (
                      <Link key={`tv-featured-${series.tmdb_id ?? series.imdb_id ?? index}-${index}`} href={href} className="group block">
                        <div className="bg-white rounded shadow overflow-hidden">
                          <div className="relative aspect-[2/3]">
                            <img
                              src={getTvCardPoster(series.poster_path)}
                              alt={name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <span className="absolute top-2 right-2 bg-[#79c142] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              TV
                            </span>
                            {eps > 0 && (
                              <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                Eps {eps}
                              </span>
                            )}
                          </div>
                          <div className="bg-black px-2 py-2">
                            <div className="text-white text-xs font-semibold line-clamp-1">
                              {name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }))}
                </div>
              </section>
            </>
          )}
        </div>

      </div>

      {/* Footer - 123moviesfree: green logo + same colors */}
      <footer className="bg-[#0d0d0d] border-t border-[#2b2b2b] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SiteLogo href="/" size="footer" tagline="" />
                <div className="w-6 h-6 bg-[#3fae2a] rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Watch your favorite movies and TV shows online for free. 
                High quality streaming with no registration required.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Home</Link></li>
                <li><Link href="/movies" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">All Movies</Link></li>
                <li><Link href="/series-static" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">TV Series</Link></li>
                <li><Link href="/genres" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Genres</Link></li>
                <li><Link href="/country" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Countries</Link></li>
                <li>
                  <button 
                    onClick={() => setIsTVSearchOpen(true)}
                    className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm"
                  >
                    Search TV Series
                  </button>
                </li>
              </ul>
            </div>

            {/* Popular Genres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Popular Genres</h3>
              <ul className="space-y-2">
                <li><Link href="/genre/action" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Action</Link></li>
                <li><Link href="/genre/comedy" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Comedy</Link></li>
                <li><Link href="/genre/drama" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Drama</Link></li>
                <li><Link href="/genre/horror" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Horror</Link></li>
                <li><Link href="/genre/romance" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">Romance</Link></li>
                <li><Link href="/tv-genre/action" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">TV Action</Link></li>
                <li><Link href="/tv-genre/drama" className="text-gray-400 hover:text-[#3fae2a] transition-colors text-sm">TV Drama</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#2b2b2b] mt-8 pt-8">
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                Made with ❤️ for movie lovers
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* TV Search Modal */}
      <TVSearchModal 
        isOpen={isTVSearchOpen} 
        onClose={() => setIsTVSearchOpen(false)} 
      />
    </div>
  );
}


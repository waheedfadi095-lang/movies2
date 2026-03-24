// API Route: TV series listing from IDs source + metadata cache (optional enrich)
import { NextRequest, NextResponse } from "next/server";
import { getSeriesList, getSeriesMeta } from "@/lib/serverSeriesCache";

export const dynamic = "force-dynamic";

function parseIntParam(value: string | null, fallback: number) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseFloatParam(value: string | null, fallback: number) {
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : fallback;
}

function normalizeGenreValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Extra tokens for URL slug ↔ TMDB genre name mismatches (e.g. sci-fi vs Science Fiction). */
const GENRE_SLUG_HINTS: Record<string, string[]> = {
  "sci-fi": ["science fiction", "sci-fi", "sci fi", "science fiction & fantasy"],
  "science-fiction": ["science fiction", "sci-fi", "sci fi"],
  "sci fi": ["science fiction", "sci-fi", "sci fi"],
  "action": ["action", "action & adventure"],
  "adventure": ["adventure", "action & adventure"],
  "animation": ["animation", "anime", "cartoon"],
  "reality": ["reality", "reality tv", "reality-tv"],
};

function buildGenreSearchTerms(genreCsv: string, genreSlug: string): string[] {
  const terms = new Set<string>();
  genreCsv
    .split(",")
    .map((g) => normalizeGenreValue(g))
    .filter(Boolean)
    .forEach((t) => terms.add(t));
  const slug = genreSlug.trim().toLowerCase();
  if (slug) {
    terms.add(normalizeGenreValue(slug.replace(/-/g, " ")));
    const hints = GENRE_SLUG_HINTS[slug] || GENRE_SLUG_HINTS[normalizeGenreValue(slug.replace(/-/g, " "))];
    if (hints) hints.forEach((h) => terms.add(normalizeGenreValue(h)));
  }
  return [...terms];
}

/** Genre match with controlled fuzziness (avoid cross-genre bleed). */
function seriesMatchesGenreTokens(availableRaw: string[], tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const available = availableRaw.map((x) => normalizeGenreValue(String(x))).filter(Boolean);
  return tokens.some((w) =>
    available.some((g) => {
      if (!w || !g) return false;
      if (g === w) return true;
      // allow "science fiction" to match "science fiction & fantasy", etc.
      if (w.length >= 4 && g.includes(w)) return true;
      return false;
    })
  );
}

function seriesPrimaryYear(s: any): number {
  const fa = s.first_air_date ? parseIntParam(String(s.first_air_date).slice(0, 4), 0) : 0;
  if (Number.isFinite(fa) && fa > 0) return fa;
  const la = s.last_air_date ? parseIntParam(String(s.last_air_date).slice(0, 4), 0) : 0;
  if (Number.isFinite(la) && la > 0) return la;
  return 0;
}

function seriesSortTimestamp(s: any): number {
  const fa = s.first_air_date ? Date.parse(s.first_air_date) : NaN;
  if (Number.isFinite(fa)) return fa;
  const la = s.last_air_date ? Date.parse(s.last_air_date) : NaN;
  if (Number.isFinite(la)) return la;
  return 0;
}

async function mapInChunks<T, R>(arr: T[], chunkSize: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    out.push(...(await Promise.all(chunk.map(fn))));
  }
  return out;
}

const MAX_ENRICH_PER_REQUEST = 4;
const RECENT_WARMUP_CANDIDATES = 24;

function isPlaceholderSeries(s: any): boolean {
  return !s.tmdb_id || !s.poster_path || String(s.name || "").startsWith("TV Series tt");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(120, Math.max(1, parseIntParam(searchParams.get("limit"), 100)));
  const pageParam = Math.max(1, parseIntParam(searchParams.get("page"), 1));
  const skipParam = Math.max(0, parseIntParam(searchParams.get("skip"), 0));
  const skip = searchParams.has("skip") ? skipParam : (pageParam - 1) * limit;
  const sortBy = searchParams.get("sortBy") || "first_air_date";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const minRating = parseFloatParam(searchParams.get("minRating"), 0);
  const maxRating = parseFloatParam(searchParams.get("maxRating"), 10);
  const minYear = parseIntParam(searchParams.get("minYear"), 1900);
  const maxYear = parseIntParam(searchParams.get("maxYear"), 2035);
  const year = parseIntParam(searchParams.get("year"), 0);
  const genre = (searchParams.get("genre") || "").trim();
  const genreSlug = (searchParams.get("genreSlug") || "").trim();
  const enrich = searchParams.get("enrich") === "1";
  const genreTokens = buildGenreSearchTerms(genre, genreSlug);

  try {
    const applyFilters = (items: any[]) =>
      items.filter((s) => {
      const rating = Number(s.vote_average || 0);
      if (rating < minRating || rating > maxRating) return false;
      const y = seriesPrimaryYear(s);
      if (year > 0) return y === year;
      // Keep unknown years in generic listings; apply range only when year exists.
      if (y > 0 && (y < minYear || y > maxYear)) return false;
      if (genreTokens.length > 0) {
        const availableGenres = (s.genres || []).map((x: any) => String(x));
        if (!seriesMatchesGenreTokens(availableGenres, genreTokens)) return false;
      }
      return true;
    });

    let data = applyFilters(getSeriesList());

    // Warm up "latest" pages from the tail of IDs so top rows don't get stuck on old cached shows.
    if (enrich && sortBy === "first_air_date" && sortOrder === -1 && skip === 0 && year === 0) {
      const all = getSeriesList();
      const tail = all.slice(-Math.max(RECENT_WARMUP_CANDIDATES * 2, 60));
      const candidates = tail.filter(isPlaceholderSeries).slice(0, RECENT_WARMUP_CANDIDATES);
      if (candidates.length > 0) {
        await mapInChunks(candidates, 6, async (s) => {
          await getSeriesMeta(s.imdb_id, true);
          return null;
        });
        data = applyFilters(getSeriesList());
      }
    }

    // If genre/year specific query returns empty on sparse metadata, enrich a limited window (chunked — less server spike).
    if (data.length === 0 && enrich && (year > 0 || genreTokens.length > 0)) {
      const candidates = getSeriesList()
        .filter((s) => !s.tmdb_id || !s.name || String(s.name).startsWith("TV Series tt"))
        .slice(0, 120);
      if (candidates.length > 0) {
        for (let i = 0; i < candidates.length; i += 8) {
          const chunk = candidates.slice(i, i + 8);
          await Promise.all(chunk.map((s) => getSeriesMeta(s.imdb_id, true)));
        }
        data = applyFilters(getSeriesList());
      }
    }

    data.sort((a: any, b: any) => {
      const da = seriesSortTimestamp(a);
      const db = seriesSortTimestamp(b);
      const va = Number(a.vote_average || 0);
      const vb = Number(b.vote_average || 0);

      if (sortBy === "vote_average") {
        const ratingCmp = sortOrder === -1 ? vb - va : va - vb;
        if (ratingCmp !== 0) return ratingCmp;
        // Tie-break by latest first_air_date, then imdb_id for deterministic ordering.
        if (db !== da) return sortOrder === -1 ? db - da : da - db;
        return String(a.imdb_id || "").localeCompare(String(b.imdb_id || ""));
      }
      // Latest-first by default, then rating, then imdb_id.
      const dateCmp = sortOrder === -1 ? db - da : da - db;
      if (dateCmp !== 0) return dateCmp;
      if (vb !== va) return vb - va;
      return String(a.imdb_id || "").localeCompare(String(b.imdb_id || ""));
    });

    const total = data.length;
    let pageItems = data.slice(skip, skip + limit);

    if (enrich) {
      // Enrich only a small budget per request to keep response time stable.
      let used = 0;
      pageItems = await mapInChunks(pageItems, 6, async (s) => {
        const placeholder = isPlaceholderSeries(s);
        if (!placeholder || used >= MAX_ENRICH_PER_REQUEST) return s;
        used += 1;
        return (await getSeriesMeta(s.imdb_id, true)) || s;
      });
    }

    const pages = Math.ceil(total / limit);
    const page = Math.floor(skip / limit) + 1;
    const hasMore = skip + limit < total;

    return NextResponse.json({
      success: true,
      data: pageItems,
      total,
      page,
      pages,
      totalPages: pages,
      hasMore,
      limit,
      skip,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasMore,
      },
    });
  } catch (err) {
    console.error("TV series fetch failed:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch TV series" }, { status: 500 });
  }
}


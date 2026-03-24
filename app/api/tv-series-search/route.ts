// API Route: Search TV Series (IDs source + metadata cache)
import { NextRequest, NextResponse } from "next/server";
import { getSeriesList, getSeriesMeta } from "@/lib/serverSeriesCache";

export const dynamic = "force-dynamic";

function parseIntParam(value: string | null, fallback: number) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(1, parseIntParam(searchParams.get("page"), 1));
    const limit = Math.min(50, Math.max(1, parseIntParam(searchParams.get("limit"), 20)));
    const skip = (page - 1) * limit;
    const enrich = searchParams.get("enrich") === "1";

    if (query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        hasMore: false,
        pagination: { page, limit, total: 0, pages: 0, hasMore: false },
      });
    }

    const all = getSeriesList();
    const score = (s: any) => {
      const name = String(s.name || "").toLowerCase();
      const overview = String(s.overview || "").toLowerCase();
      const imdb = String(s.imdb_id || "").toLowerCase();
      let value = 0;
      if (name === query) value += 120;
      if (name.startsWith(query)) value += 70;
      if (name.includes(query)) value += 50;
      if (imdb.includes(query)) value += 35;
      if (overview.includes(query)) value += 20;
      value += Number(s.vote_average || 0);
      const d = s.first_air_date ? Date.parse(s.first_air_date) : 0;
      value += d / 1e12; // tiny boost for latest
      return value;
    };

    let filtered = all
      .filter((s) => {
        const name = String(s.name || "").toLowerCase();
        const overview = String(s.overview || "").toLowerCase();
        const imdb = String(s.imdb_id || "").toLowerCase();
        return name.includes(query) || overview.includes(query) || imdb.includes(query);
      })
      .sort((a, b) => {
        const scoreCmp = score(b) - score(a);
        if (scoreCmp !== 0) return scoreCmp;
        return String(a.imdb_id || "").localeCompare(String(b.imdb_id || ""));
      });

    // Metadata-aware fallback: if cache is mostly placeholders and no match found, enrich a small window then retry.
    if (filtered.length === 0) {
      const candidates = all
        .filter((s) => !s.tmdb_id || !s.name || s.name.startsWith("TV Series tt"))
        .slice(0, 80);
      if (candidates.length > 0) {
        await Promise.all(candidates.map(async (s) => getSeriesMeta(s.imdb_id, true)));
        const reloaded = getSeriesList();
        filtered = reloaded
          .filter((s) => {
            const name = String(s.name || "").toLowerCase();
            const overview = String(s.overview || "").toLowerCase();
            const imdb = String(s.imdb_id || "").toLowerCase();
            return name.includes(query) || overview.includes(query) || imdb.includes(query);
          })
          .sort((a, b) => {
            const scoreCmp = score(b) - score(a);
            if (scoreCmp !== 0) return scoreCmp;
            return String(a.imdb_id || "").localeCompare(String(b.imdb_id || ""));
          });
      }
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    let pageItems = filtered.slice(skip, skip + limit);

    if (enrich) {
      pageItems = await Promise.all(
        pageItems.map(async (s) => {
          const enriched = await getSeriesMeta(s.imdb_id, true);
          return enriched || s;
        })
      );
    }

    // Format for search results
    const searchResults = pageItems.map((s) => ({
      imdb_id: s.imdb_id,
      tmdb_id: s.tmdb_id,
      title: s.name,
      name: s.name,
      poster_path: s.poster_path,
      backdrop_path: s.backdrop_path,
      overview: s.overview,
      release_date: s.first_air_date,
      first_air_date: s.first_air_date,
      vote_average: s.vote_average,
      media_type: "tv",
      episode_count:
        s.number_of_episodes ||
        s.seasons?.reduce((sum: number, season: any) => sum + (season?.episodes?.length || 0), 0) ||
        0,
      number_of_seasons: s.number_of_seasons || s.seasons?.length || 0
    }));

    return NextResponse.json({
      success: true,
      data: searchResults,
      total,
      page,
      pages,
      hasMore: page < pages,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasMore: page < pages,
      },
    });

  } catch (error) {
    console.error("Error searching TV series:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search TV series" },
      { status: 500 }
    );
  }
}

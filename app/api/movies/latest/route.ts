import { NextRequest, NextResponse } from "next/server";
import { getServerMovieCache } from "@/lib/serverMovieCache";
import { VID_SRC_LATEST_MOVIES } from "@/data/vidsrcLatestMovies";

function parseLimit(v: string | null, fallback: number) {
  const n = Number.parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(200, n);
}

function parseTimeAdded(s: string): number {
  // vidsrc format: "YYYY-MM-DD HH:mm:ss"
  const iso = s?.includes("T") ? s : String(s || "").replace(" ", "T") + "Z";
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get("category") || "latest").toLowerCase();
    const limit = parseLimit(searchParams.get("limit"), 20);

    const cache = getServerMovieCache();
    if (cache.allMovies.length === 0) {
      return NextResponse.json({
        movies: [],
        message: "Movie data not available yet",
      });
    }

    // Recent added (VidSrc time_added) -> map to our local normalized movie objects.
    const vidsrcSorted = [...VID_SRC_LATEST_MOVIES].sort(
      (a, b) => parseTimeAdded(b.time_added) - parseTimeAdded(a.time_added)
    );
    const vidsrcImdbIds = vidsrcSorted.map((x) => x.imdb_id).filter(Boolean);

    const mapByIds = (ids: string[], max: number) => {
      const out: any[] = [];
      const seen = new Set<string>();
      for (const id of ids) {
        if (!id || seen.has(id)) continue;
        const m = cache.byImdbId.get(id);
        if (!m) continue;
        seen.add(id);
        out.push(m);
        if (out.length >= max) break;
      }
      return out;
    };

    // Get latest movies based on category
    let selectedMovies: any[] = [];

    switch (category) {
      case "suggestions":
      case "latest":
        // Homepage uses recent-added from VidSrc (time_added desc).
        selectedMovies = mapByIds(vidsrcImdbIds, limit);
        break;

      case "trending":
        // Movies from latest 3 years, sorted by rating
        {
          const maxYear = Math.max(...cache.allMovies.map((m: any) => m.year));
          selectedMovies = cache.allMovies
            .filter((movie: any) => movie.year >= maxYear - 2)
            .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))
            .slice(0, limit);
        }
        break;

      case "top_rated":
        // Highest rated movies overall
        selectedMovies = cache.allMovies
          .filter((movie: any) => movie.vote_average && movie.vote_average > 0)
          .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))
          .slice(0, limit);
        break;

      case "action":
        {
          // Keep old behavior but ensure deterministic output.
          const actionMaxYear = Math.max(...cache.allMovies.map((m: any) => m.year));
          selectedMovies = cache.allMovies
            .filter(
              (movie: any) =>
                movie.year >= actionMaxYear - 1 && movie.vote_average && movie.vote_average > 5
            )
            .slice(0, limit);
        }
        break;

      case "tv_shows":
        {
          // Heuristic bucket; not used by homepage snapshot.
          const tvMaxYear = Math.max(...cache.allMovies.map((m: any) => m.year));
          selectedMovies = cache.allMovies
            .filter((movie: any) => {
              const isRecent = movie.year >= tvMaxYear - 3;
              const hasGoodRating = movie.vote_average && movie.vote_average > 5.0;
              const titleIndicatesTV =
                movie.title &&
                (movie.title.toLowerCase().includes("series") ||
                  movie.title.toLowerCase().includes("season") ||
                  movie.title.toLowerCase().includes("episode") ||
                  movie.title.toLowerCase().includes("tv") ||
                  movie.title.toLowerCase().includes("show") ||
                  movie.title.toLowerCase().includes("drama") ||
                  movie.title.toLowerCase().includes("comedy") ||
                  movie.title.toLowerCase().includes("sitcom"));
              return isRecent && hasGoodRating && titleIndicatesTV;
            })
            .slice(0, limit);
        }
        break;

      default:
        // Default to recent-added, then fill from cache.
        selectedMovies = mapByIds(vidsrcImdbIds, limit);
    }

    // If we don't have enough movies for the specific category, fill with latest movies
    if (selectedMovies.length < limit) {
      const already = new Set(selectedMovies.map((m: any) => m?.imdb_id).filter(Boolean));
      const additionalMovies = cache.allMovies
        .filter((movie: any) => movie?.imdb_id && !already.has(movie.imdb_id))
        .slice(0, Math.max(0, limit - selectedMovies.length));
      selectedMovies = [...selectedMovies, ...additionalMovies].slice(0, limit);
    }

    return NextResponse.json({
      movies: selectedMovies.slice(0, limit),
      category,
      totalAvailable: cache.allMovies.length,
      vidsrcCandidates: vidsrcImdbIds.length,
    });

  } catch (error) {
    console.error("Error fetching latest movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest movies" },
      { status: 500 }
    );
  }
}

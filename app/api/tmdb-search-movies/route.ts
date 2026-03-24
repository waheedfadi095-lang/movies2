import { NextRequest, NextResponse } from "next/server";
import { getAllProcessedMovies } from "@/lib/moviesDataServer";

export const dynamic = "force-dynamic";

function scoreMovie(movie: any, q: string) {
  const title = String(movie.title || "").toLowerCase();
  const overview = String(movie.overview || "").toLowerCase();
  const imdb = String(movie.imdb_id || "").toLowerCase();

  let score = 0;
  if (title === q) score += 120;
  if (title.startsWith(q)) score += 80;
  if (title.includes(q)) score += 50;
  if (imdb.includes(q)) score += 40;
  if (overview.includes(q)) score += 20;
  score += Number(movie.vote_average || 0);
  return score;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const skip = (page - 1) * limit;

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        query: q,
        data: [],
        pagination: { page, limit, total: 0, pages: 0, hasMore: false },
      });
    }

    const allMovies = getAllProcessedMovies();
    const filtered = allMovies
      .filter((m) => {
        const title = String(m.title || "").toLowerCase();
        const overview = String(m.overview || "").toLowerCase();
        const imdb = String(m.imdb_id || "").toLowerCase();
        return title.includes(q) || overview.includes(q) || imdb.includes(q);
      })
      .sort((a, b) => scoreMovie(b, q) - scoreMovie(a, q));

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const data = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      query: q,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasMore: page < pages,
      },
    });
  } catch (error) {
    console.error("tmdb-search-movies route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search local movie dataset" },
      { status: 500 }
    );
  }
}


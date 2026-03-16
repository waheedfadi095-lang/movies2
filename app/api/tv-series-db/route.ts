// API Route: Fetch TV Series from MongoDB, fallback to TMDB when DB empty/unavailable
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE = 'https://api.themoviedb.org/3';

export const dynamic = 'force-dynamic';

/** Fetch TV from TMDB and map to same shape as MongoDB docs (for fallback). Sorted by latest first in category. */
async function fetchFromTMDB(
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: number
): Promise<{ data: any[]; total: number }> {
  const pages = [1, 2, 3];
  const allResults: any[] = [];
  for (const page of pages) {
    const res = await fetch(
      `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    if (!res.ok) continue;
    const json = await res.json();
    const results = json.results || [];
    allResults.push(...results);
  }
  const mapped = allResults.map((r: any) => {
    const numEps = r.number_of_episodes ?? 0;
    return {
      imdb_id: null as string | null,
      tmdb_id: r.id,
      name: r.name || `TV Series ${r.id}`,
      overview: r.overview || '',
      poster_path: r.poster_path || null,
      backdrop_path: r.backdrop_path || null,
      first_air_date: r.first_air_date || null,
      vote_average: r.vote_average ?? 0,
      number_of_seasons: r.number_of_seasons ?? 0,
      number_of_episodes: numEps,
      seasons: numEps > 0 ? [{ episodes: Array(numEps) }] : [],
    };
  });
  // Dedupe by tmdb_id
  const byId = new Map<number, any>();
  mapped.forEach((m) => byId.set(m.tmdb_id, m));
  const unique = Array.from(byId.values());
  // Sort by category: latest first (first_air_date desc) or rating (vote_average desc)
  const desc = sortOrder === -1;
  unique.sort((a: any, b: any) => {
    if (sortBy === 'vote_average') {
      const va = a.vote_average ?? 0;
      const vb = b.vote_average ?? 0;
      return desc ? vb - va : va - vb;
    }
    const da = a.first_air_date || '';
    const db = b.first_air_date || '';
    if (da !== db) return desc ? db.localeCompare(da) : da.localeCompare(db);
    return 0;
  });
  const total = Math.min(unique.length, 500);
  const slice = unique.slice(skip, skip + limit);
  return { data: slice, total };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const sortBy = searchParams.get('sortBy') || 'first_air_date';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const maxRating = parseFloat(searchParams.get('maxRating') || '10');
  const minYear = parseInt(searchParams.get('minYear') || '1900');
  const maxYear = parseInt(searchParams.get('maxYear') || '2030');
  const genre = searchParams.get('genre');
  const category = searchParams.get('category');
  const year = parseInt(searchParams.get('year') || '0');

  try {
    const client = await clientPromise;
    if (!client) {
      const fallback = await fetchFromTMDB(limit, skip, sortBy, sortOrder);
      return NextResponse.json({
        success: true,
        data: fallback.data,
        total: fallback.total,
        limit,
        skip
      });
    }
    const db = client.db('moviesDB');
    const collection = db.collection('tvSeries');

    const query: any = {
      name: { $exists: true, $ne: null },
      vote_average: { $gte: minRating, $lte: maxRating }
    };

    if (year > 0) {
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;
      query.first_air_date = { $gte: start, $lte: end };
    } else {
      query.first_air_date = {
        $gte: `${minYear}-01-01`,
        $lte: `${maxYear}-12-31`
      };
    }
    if (genre) query.genres = genre;
    if (category) query.categories = category;

    const total = await collection.countDocuments(query);
    if (total === 0) {
      const fallback = await fetchFromTMDB(limit, skip, sortBy, sortOrder);
      return NextResponse.json({
        success: true,
        data: fallback.data,
        total: fallback.total,
        limit,
        skip
      });
    }

    const series = await collection
      .find(query)
      .sort({ [sortBy]: sortOrder, random_order: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: series,
      total,
      limit,
      skip
    });
  } catch (_) {
    // MongoDB missing/failed – use TMDB fallback so TV section still works
    try {
      const fallback = await fetchFromTMDB(limit, skip, sortBy, sortOrder);
      return NextResponse.json({
        success: true,
        data: fallback.data,
        total: fallback.total,
        limit,
        skip
      });
    } catch (err) {
      console.error('TV series fetch and fallback failed:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch TV series' },
        { status: 500 }
      );
    }
  }
}


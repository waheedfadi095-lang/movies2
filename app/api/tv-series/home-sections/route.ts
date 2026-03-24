import { NextRequest, NextResponse } from "next/server";

type SeriesItem = Record<string, any>;

function uniqKey(x: SeriesItem): string {
  return String(x?.imdb_id || x?.tmdb_id || "");
}

/** Primary order preserved; pad from filler (latest-first) until `max` unique imdb/tmdb ids. */
function mergeUniquePad(primary: SeriesItem[], filler: SeriesItem[], max: number): SeriesItem[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const x of primary) {
    const k = uniqKey(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= max) return out;
  }
  for (const x of filler) {
    const k = uniqKey(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= max) break;
  }
  return out;
}

export async function GET(request: NextRequest) {
  const limit = Math.min(60, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "16", 10)));
  const origin = request.nextUrl.origin;
  // Pull a deeper pool so filters + dedupe still yield up to `limit` (without exploding enrich work).
  const pool = Math.min(64, Math.max(limit, limit * 2));

  try {
    const latestUrl = `${origin}/api/tv-series-db?limit=${pool}&sortBy=first_air_date&sortOrder=desc`;
    // No minYear here — sort is already latest-first; strict year was cutting lists to <16.
    // Keep section identity distinct so rows don't look identical.
    const popularUrl = `${origin}/api/tv-series-db?limit=${pool}&sortBy=first_air_date&sortOrder=desc&minRating=6.5&maxRating=8.4&minYear=2018`;
    const featuredUrl = `${origin}/api/tv-series-db?limit=${pool}&sortBy=first_air_date&sortOrder=desc&minRating=8.5&minYear=2015`;

    const [latestRes, popularRes, featuredRes] = await Promise.all([
      fetch(latestUrl),
      fetch(popularUrl),
      fetch(featuredUrl),
    ]);

    const [latestData, popularData, featuredData] = await Promise.all([
      latestRes.json(),
      popularRes.json(),
      featuredRes.json(),
    ]);

    const latestItems = latestRes.ok && latestData?.success ? latestData.data || [] : [];
    let popularItems = popularRes.ok && popularData?.success ? popularData.data || [] : [];
    let featuredItems = featuredRes.ok && featuredData?.success ? featuredData.data || [] : [];

    // Fallback primaries when empty
    if (popularItems.length === 0 && latestItems.length > 0) {
      popularItems = latestItems.filter((x: any) => Number(x?.vote_average || 0) >= 7);
    }
    if (featuredItems.length === 0 && latestItems.length > 0) {
      featuredItems = latestItems.filter((x: any) => Number(x?.vote_average || 0) >= 8);
    }

    // Pad to `limit` (unique within each section), but avoid top-latest duplication as much as possible.
    const latestTailForPopular = latestItems.slice(limit);
    popularItems = mergeUniquePad(popularItems, latestTailForPopular, limit);
    if (popularItems.length < limit) {
      popularItems = mergeUniquePad(popularItems, latestItems, limit);
    }
    const popularKeys = new Set(popularItems.map((x: SeriesItem) => uniqKey(x)).filter(Boolean));
    const featuredPreferNotPopular = latestItems
      .slice(limit * 2)
      .filter((x: SeriesItem) => !popularKeys.has(uniqKey(x)));
    featuredItems = mergeUniquePad(featuredItems, featuredPreferNotPopular, limit);
    if (featuredItems.length < limit) {
      const latestNoPopular = latestItems.filter((x: SeriesItem) => !popularKeys.has(uniqKey(x)));
      featuredItems = mergeUniquePad(featuredItems, latestNoPopular, limit);
    }

    const latestOut = mergeUniquePad(latestItems, [], limit);

    return NextResponse.json({
      success: true,
      sections: {
        latest: latestOut,
        popular: popularItems,
        featured: featuredItems,
      },
    });
  } catch (error) {
    console.error("Error in /api/tv-series/home-sections:", error);
    return NextResponse.json(
      {
        success: false,
        sections: { latest: [], popular: [], featured: [] },
      },
      { status: 500 }
    );
  }
}

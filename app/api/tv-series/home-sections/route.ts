import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "12", 10);
  const origin = request.nextUrl.origin;

  try {
    const latestUrl = `${origin}/api/tv-series-db?limit=${limit}&sortBy=first_air_date&sortOrder=desc`;
    const popularUrl = `${origin}/api/tv-series-db?limit=${limit}&sortBy=vote_average&sortOrder=desc&minRating=7.0`;
    const featuredUrl = `${origin}/api/tv-series-db?limit=${limit}&sortBy=vote_average&sortOrder=desc&minRating=8.0`;

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

    return NextResponse.json({
      success: true,
      sections: {
        latest: latestRes.ok && latestData?.success ? latestData.data || [] : [],
        popular: popularRes.ok && popularData?.success ? popularData.data || [] : [],
        featured: featuredRes.ok && featuredData?.success ? featuredData.data || [] : [],
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

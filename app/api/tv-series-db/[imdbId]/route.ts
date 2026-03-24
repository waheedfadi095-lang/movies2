// API Route: Fetch single TV series by IMDB ID (IDs source + metadata cache)
import { NextRequest, NextResponse } from "next/server";
import { getAllSeriesIds, getSeriesMeta } from "@/lib/serverSeriesCache";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imdbId: string }> }
) {
  try {
    const { imdbId } = await params;
    const ids = getAllSeriesIds();
    if (!ids.includes(imdbId)) {
      return NextResponse.json(
        { success: false, error: "Series not found" },
        { status: 404 }
      );
    }

    const enrich = request.nextUrl.searchParams.get("enrich") === "1";
    const series = await getSeriesMeta(imdbId, enrich);

    if (!series) {
      return NextResponse.json(
        { success: false, error: "Series not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: series
    });

  } catch (error) {
    console.error("Error fetching TV series:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch TV series" },
      { status: 500 }
    );
  }
}


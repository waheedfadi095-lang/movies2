import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Snapshot = {
  generatedAt: string;
  suggestions: any[];
  latestMovies: any[];
  homeLatestTvSeries: any[];
  tvSections?: {
    latest: any[];
    popular: any[];
    featured: any[];
  };
  referenceFetchedAt?: string | null;
};

const SNAPSHOT_FILE = path.join(process.cwd(), "app", "data", "homeSnapshot.json");

function readSnapshot(): Snapshot | null {
  try {
    if (!fs.existsSync(SNAPSHOT_FILE)) return null;
    const raw = fs.readFileSync(SNAPSHOT_FILE, "utf8");
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

function writeSnapshot(s: Snapshot) {
  const dir = path.dirname(SNAPSHOT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(s, null, 2), "utf8");
}

function dedupeByImdb(items: any[]) {
  const out: any[] = [];
  const seen = new Set<string>();
  for (const m of items || []) {
    const id = String(m?.imdb_id || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(m);
  }
  return out;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "1";

    if (!force) {
      const existing = readSnapshot();
      if (existing) {
        return NextResponse.json(existing, { headers: { "Cache-Control": "public, max-age=60" } });
      }
    }

    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const limit = Number.parseInt(searchParams.get("limit") || "16", 10) || 16;

    const [suggestionsRes, latestRes, tvRes, tvSectionsRes, mappedRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/movies/latest?category=suggestions&limit=${limit}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/movies/latest?category=latest&limit=${Math.max(limit * 2, 32)}`, {
        cache: "no-store",
      }),
      fetch(
        `${baseUrl}/api/tv-series-db?limit=${Math.max(limit * 2, 32)}&skip=0&sortBy=first_air_date&sortOrder=desc`,
        { cache: "no-store" }
      ),
      fetch(`${baseUrl}/api/tv-series/home-sections?limit=${limit}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/reference/home-mapped`, { cache: "no-store" }),
    ]);

    const suggestionsJson =
      suggestionsRes.status === "fulfilled" && suggestionsRes.value.ok
        ? await suggestionsRes.value.json()
        : { movies: [] };
    const latestJson =
      latestRes.status === "fulfilled" && latestRes.value.ok ? await latestRes.value.json() : { movies: [] };
    const tvJson =
      tvRes.status === "fulfilled" && tvRes.value.ok ? await tvRes.value.json() : { success: false, data: [] };

    const tvSectionsJson =
      tvSectionsRes.status === "fulfilled" && tvSectionsRes.value.ok
        ? await tvSectionsRes.value.json()
        : { success: false, sections: { latest: [], popular: [], featured: [] } };

    let referenceFetchedAt: string | null = null;
    try {
      if (mappedRes.status === "fulfilled" && mappedRes.value.ok) {
        const mapped = await mappedRes.value.json();
        referenceFetchedAt = mapped?.fetchedAt || null;
      }
    } catch {
      // ignore
    }

    const suggestions = Array.isArray(suggestionsJson?.movies) ? suggestionsJson.movies.slice(0, limit) : [];
    const latestPool = Array.isArray(latestJson?.movies) ? latestJson.movies : [];
    const suggestionsIds = new Set(suggestions.map((m: any) => String(m?.imdb_id || "")).filter(Boolean));

    const latestMovies = dedupeByImdb(
      latestPool.filter((m: any) => !suggestionsIds.has(String(m?.imdb_id || "")))
    ).slice(0, limit);

    const tvPool = tvJson?.success && Array.isArray(tvJson?.data) ? tvJson.data : [];
    const homeLatestTvSeries = tvPool.slice(0, limit);

    const sections = tvSectionsJson?.success ? tvSectionsJson.sections || {} : {};
    const tvSections = {
      latest: Array.isArray(sections.latest) ? sections.latest.slice(0, limit) : [],
      popular: Array.isArray(sections.popular) ? sections.popular.slice(0, limit) : [],
      featured: Array.isArray(sections.featured) ? sections.featured.slice(0, limit) : [],
    };

    const snapshot: Snapshot = {
      generatedAt: new Date().toISOString(),
      suggestions,
      latestMovies,
      homeLatestTvSeries,
      tvSections,
      referenceFetchedAt,
    };

    writeSnapshot(snapshot);
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("Error building home snapshot:", e);
    return NextResponse.json({ error: "Failed to build snapshot" }, { status: 500 });
  }
}


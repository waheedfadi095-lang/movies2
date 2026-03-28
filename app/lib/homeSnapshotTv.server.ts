import { getTvSeriesList } from "@/lib/tvSeriesStore";

type AnySeries = Record<string, unknown>;

function seriesTs(s: AnySeries): number {
  const fa = s.first_air_date ? Date.parse(String(s.first_air_date)) : NaN;
  if (Number.isFinite(fa)) return fa;
  const la = s.last_air_date ? Date.parse(String(s.last_air_date)) : NaN;
  if (Number.isFinite(la)) return la;
  return 0;
}

function uniqKeyTv(x: AnySeries): string {
  return String(x?.imdb_id || x?.tmdb_id || "");
}

function mergeUniquePad(primary: AnySeries[], filler: AnySeries[], max: number): AnySeries[] {
  const seen = new Set<string>();
  const out: AnySeries[] = [];
  for (const x of primary) {
    const k = uniqKeyTv(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= max) return out;
  }
  for (const x of filler) {
    const k = uniqKeyTv(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= max) break;
  }
  return out;
}

function buildTvHomeSectionsFromPool(latestItems: AnySeries[], limit: number) {
  let popularItems = latestItems.filter((x) => {
    const v = Number(x?.vote_average || 0);
    const y = x?.first_air_date ? parseInt(String(x.first_air_date).slice(0, 4), 10) : 0;
    return v >= 6.5 && v <= 8.4 && y >= 2018;
  });
  let featuredItems = latestItems.filter((x) => {
    const v = Number(x?.vote_average || 0);
    const y = x?.first_air_date ? parseInt(String(x.first_air_date).slice(0, 4), 10) : 0;
    return v >= 8.5 && y >= 2015;
  });
  if (popularItems.length === 0 && latestItems.length > 0) {
    popularItems = latestItems.filter((x) => Number(x?.vote_average || 0) >= 7);
  }
  if (featuredItems.length === 0 && latestItems.length > 0) {
    featuredItems = latestItems.filter((x) => Number(x?.vote_average || 0) >= 8);
  }
  const latestTailForPopular = latestItems.slice(limit);
  popularItems = mergeUniquePad(popularItems, latestTailForPopular, limit);
  if (popularItems.length < limit) {
    popularItems = mergeUniquePad(popularItems, latestItems, limit);
  }
  const popularKeys = new Set(popularItems.map((x) => uniqKeyTv(x)).filter(Boolean));
  const featuredPreferNotPopular = latestItems
    .slice(limit * 2)
    .filter((x) => !popularKeys.has(uniqKeyTv(x)));
  featuredItems = mergeUniquePad(featuredItems, featuredPreferNotPopular, limit);
  if (featuredItems.length < limit) {
    const latestNoPopular = latestItems.filter((x) => !popularKeys.has(uniqKeyTv(x)));
    featuredItems = mergeUniquePad(featuredItems, latestNoPopular, limit);
  }
  const latestOut = mergeUniquePad(latestItems, [], limit);
  return { latest: latestOut, popular: popularItems, featured: featuredItems };
}

/**
 * If homeSnapshot.json has empty TV rows, fill from local tv-series-details (via getTvSeriesList).
 * Runs only on the server when rendering /home — no extra browser requests.
 */
export function augmentHomeSnapshotWithTvIfMissing(snapshot: Record<string, unknown> | null, limit = 16) {
  if (!snapshot) return snapshot;

  const rowOk =
    Array.isArray(snapshot.homeLatestTvSeries) && (snapshot.homeLatestTvSeries as unknown[]).length > 0;
  const ts = snapshot.tvSections as { latest?: unknown[]; popular?: unknown[]; featured?: unknown[] } | undefined;
  const sectionsOk = Boolean(
    ts &&
      ((ts.latest?.length ?? 0) + (ts.popular?.length ?? 0) + (ts.featured?.length ?? 0) > 0)
  );

  if (rowOk && sectionsOk) return snapshot;

  let list = getTvSeriesList() as AnySeries[];
  if (list.length === 0) return snapshot;

  list = [...list].sort((a, b) => seriesTs(b) - seriesTs(a));
  const poolSize = Math.min(64, Math.max(limit, limit * 2));
  const pool = list.slice(0, poolSize);

  const homeLatestTvSeries = rowOk
    ? snapshot.homeLatestTvSeries
    : pool.slice(0, limit);

  const tvSections = sectionsOk ? snapshot.tvSections : buildTvHomeSectionsFromPool(pool, limit);

  return {
    ...snapshot,
    homeLatestTvSeries,
    tvSections,
  };
}

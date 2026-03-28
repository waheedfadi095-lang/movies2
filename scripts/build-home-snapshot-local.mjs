#!/usr/bin/env node
/**
 * Build app/data/homeSnapshot.json without running Next dev server.
 * Mirrors /api/home/snapshot?force=1 enough for homepage offline snapshot.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const LIMIT = Number.parseInt(
  process.argv.find((x) => x.startsWith("--limit="))?.slice("--limit=".length) || "16",
  10
) || 16;

function loadProcessedMovies() {
  const scriptsDir = path.join(ROOT, "scripts");
  const allMovies = [];
  if (!fs.existsSync(scriptsDir)) return allMovies;
  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((f) => f.startsWith("batch-") && f.endsWith("-results.json"))
    .sort((a, b) => {
      const an = Number.parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      const bn = Number.parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      return an - bn;
    });
  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const batchData = JSON.parse(fs.readFileSync(batchPath, "utf8"));
      if (!Array.isArray(batchData)) continue;
      for (const movie of batchData) {
        if (!movie?.year || !movie?.poster) continue;
        allMovies.push({
          id: movie.imdbId || movie.id,
          imdb_id: movie.imdbId,
          title: movie.title,
          year: movie.year,
          poster_path: movie.poster,
          backdrop_path: movie.backdrop,
          overview: movie.overview,
          vote_average: movie.rating,
          release_date: movie.release_date,
          runtime: movie.runtime,
          original_language: movie.language,
          genres: movie.genres || [],
        });
      }
    } catch {
      // skip
    }
  }
  allMovies.sort((a, b) => {
    const ay = a.year || 0;
    const by = b.year || 0;
    if (by !== ay) return by - ay;
    const ad = a.release_date ? Date.parse(a.release_date) : Date.parse(`${ay}-01-01`);
    const bd = b.release_date ? Date.parse(b.release_date) : Date.parse(`${by}-01-01`);
    if (bd !== ad) return bd - ad;
    return (b.vote_average || 0) - (a.vote_average || 0);
  });
  return allMovies;
}

function parseVidsrcLatest() {
  const file = path.join(ROOT, "app", "data", "vidsrcLatestMovies.ts");
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  const items = [];
  const blockRe = /\{\s*imdb_id:\s*"([^"]+)"[\s\S]*?time_added:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(text))) {
    items.push({ imdb_id: m[1], time_added: m[2] });
  }
  const parseTime = (s) => {
    const iso = String(s || "").replace(" ", "T") + "Z";
    const t = Date.parse(iso);
    return Number.isFinite(t) ? t : 0;
  };
  items.sort((a, b) => parseTime(b.time_added) - parseTime(a.time_added));
  return items;
}

function mapMoviesByVidsrcOrder(vidsrcItems, byImdb, max) {
  const out = [];
  const seen = new Set();
  for (const { imdb_id } of vidsrcItems) {
    if (!imdb_id || seen.has(imdb_id)) continue;
    const m = byImdb.get(imdb_id);
    if (!m) continue;
    seen.add(imdb_id);
    out.push(m);
    if (out.length >= max) break;
  }
  return out;
}

function dedupeByImdb(items) {
  const out = [];
  const seen = new Set();
  for (const m of items || []) {
    const id = String(m?.imdb_id || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(m);
  }
  return out;
}

function loadTvSeriesIds() {
  const file = path.join(ROOT, "app", "data", "tvSeriesIds.ts");
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  return [...text.matchAll(/"(tt\d{6,10})"/gi)].map((x) => x[1]);
}

function loadTvDetailsMap() {
  const p = path.join(ROOT, "scripts", "tv-series-details.json");
  const map = new Map();
  if (!fs.existsSync(p)) return map;
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (item?.imdb_id) map.set(item.imdb_id, item);
      }
    } else if (raw && typeof raw === "object") {
      for (const [imdb, item] of Object.entries(raw)) {
        if (item && typeof item === "object") map.set(imdb, { ...item, imdb_id: imdb });
      }
    }
  } catch {
    // ignore
  }
  return map;
}

function normalizeTv(id, detailMap) {
  const d = detailMap.get(id);
  if (d) {
    return {
      imdb_id: id,
      tmdb_id: d.tmdb_id ?? null,
      name: d.name || `TV Series ${id}`,
      poster_path: d.poster_path ?? null,
      backdrop_path: d.backdrop_path ?? null,
      overview: d.overview || "",
      first_air_date: d.first_air_date ?? null,
      last_air_date: d.last_air_date ?? null,
      vote_average: d.vote_average ?? 0,
      number_of_seasons: d.number_of_seasons ?? 0,
      number_of_episodes: d.number_of_episodes ?? 0,
      seasons: d.seasons || [],
    };
  }
  return {
    imdb_id: id,
    tmdb_id: null,
    name: `TV Series ${id}`,
    poster_path: null,
    backdrop_path: null,
    overview: "",
    first_air_date: null,
    last_air_date: null,
    vote_average: 0,
    number_of_seasons: 0,
    number_of_episodes: 0,
    seasons: [],
  };
}

function seriesTs(s) {
  const fa = s.first_air_date ? Date.parse(s.first_air_date) : NaN;
  if (Number.isFinite(fa)) return fa;
  const la = s.last_air_date ? Date.parse(s.last_air_date) : NaN;
  if (Number.isFinite(la)) return la;
  return 0;
}

function uniqKeyTv(x) {
  return String(x?.imdb_id || x?.tmdb_id || "");
}

function mergeUniquePad(primary, filler, max) {
  const seen = new Set();
  const out = [];
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

function buildTvHomeSections(latestItems, limit) {
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

// ---- main ----
const limit = LIMIT;
const allMovies = loadProcessedMovies();
const byImdb = new Map();
for (const m of allMovies) {
  if (m?.imdb_id && !byImdb.has(m.imdb_id)) byImdb.set(m.imdb_id, m);
}

const vidsrc = parseVidsrcLatest();
let suggestions = mapMoviesByVidsrcOrder(vidsrc, byImdb, limit);
let latestPool = mapMoviesByVidsrcOrder(vidsrc, byImdb, Math.max(limit * 2, 32));
if (suggestions.length < limit) {
  const need = limit - suggestions.length;
  suggestions = [...suggestions, ...allMovies.filter((m) => !suggestions.some((s) => s.imdb_id === m.imdb_id))].slice(
    0,
    limit
  );
}
if (latestPool.length < Math.max(limit * 2, 32)) {
  const have = new Set(latestPool.map((m) => m.imdb_id));
  for (const m of allMovies) {
    if (have.has(m.imdb_id)) continue;
    have.add(m.imdb_id);
    latestPool.push(m);
    if (latestPool.length >= Math.max(limit * 2, 32)) break;
  }
}

const suggestionsIds = new Set(suggestions.map((m) => String(m?.imdb_id || "")).filter(Boolean));
let latestMovies = dedupeByImdb(
  latestPool.filter((m) => !suggestionsIds.has(String(m?.imdb_id || "")))
).slice(0, limit);
if (latestMovies.length < limit) {
  const have = new Set([...suggestions.map((m) => m.imdb_id), ...latestMovies.map((m) => m.imdb_id)]);
  for (const m of allMovies) {
    if (have.has(m.imdb_id)) continue;
    have.add(m.imdb_id);
    latestMovies.push(m);
    if (latestMovies.length >= limit) break;
  }
}

let tvIds = loadTvSeriesIds();
const tvDetailMap = loadTvDetailsMap();
if (tvIds.length === 0 && tvDetailMap.size > 0) {
  tvIds = Array.from(tvDetailMap.keys());
}
let tvList = tvIds.map((id) => normalizeTv(id, tvDetailMap));
tvList.sort((a, b) => seriesTs(b) - seriesTs(a));
const poolTv = Math.min(64, Math.max(limit, limit * 2));
const latestTvPool = tvList.slice(0, poolTv);
const homeLatestTvSeries = latestTvPool.slice(0, limit);
const tvSections = buildTvHomeSections(latestTvPool, limit);

const mappedFile = path.join(ROOT, "app", "data", "referenceHomeMapped.json");
let referenceFetchedAt = null;
try {
  if (fs.existsSync(mappedFile)) {
    const j = JSON.parse(fs.readFileSync(mappedFile, "utf8"));
    referenceFetchedAt = j?.fetchedAt ?? null;
  }
} catch {
  // ignore
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  suggestions,
  latestMovies,
  homeLatestTvSeries,
  tvSections,
  referenceFetchedAt,
};

const outFile = path.join(ROOT, "app", "data", "homeSnapshot.json");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2), "utf8");

console.log(`✅ Wrote ${outFile}`);
console.log(`- suggestions: ${snapshot.suggestions.length}`);
console.log(`- latestMovies: ${snapshot.latestMovies.length}`);
console.log(`- homeLatestTvSeries: ${snapshot.homeLatestTvSeries.length}`);
console.log(`- tvSections: latest=${tvSections.latest.length} popular=${tvSections.popular.length} featured=${tvSections.featured.length}`);

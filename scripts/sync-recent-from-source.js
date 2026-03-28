#!/usr/bin/env node
/**
 * Incremental sync from ORIGINAL source pipeline:
 * - Source IDs: app/data/bulkMovieIds.ts
 * - Existing processed data: scripts/batch-*-results.json
 * - Fetch only NEW imdb ids from TMDB /find endpoint
 * - Save new records in next batch file so site automatically includes them
 *
 * Usage:
 *   node scripts/sync-recent-from-source.js
 *   node scripts/sync-recent-from-source.js --limit=500
 */

const fs = require("fs");
const path = require("path");

const TMDB_API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "b31d2e5f33b74ffa7b3b483ff353f760";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_LIMIT = 500;

function argValue(name, fallback) {
  const item = process.argv.find((x) => x.startsWith(`--${name}=`));
  if (!item) return fallback;
  const n = Number.parseInt(item.slice(name.length + 3), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function readBulkIds() {
  const file = path.join(process.cwd(), "app", "data", "bulkMovieIds.ts");
  if (!fs.existsSync(file)) throw new Error("bulkMovieIds.ts not found");
  const content = fs.readFileSync(file, "utf8");
  const m = content.match(/export const BULK_MOVIE_IDS = \[([\s\S]*?)\];/);
  if (!m) throw new Error("Could not parse BULK_MOVIE_IDS");
  return m[1]
    .split(",")
    .map((x) => x.trim().replace(/^['"`]|['"`]$/g, ""))
    .filter((x) => /^tt\d{6,10}$/i.test(x));
}

function getBatchFiles() {
  const scriptsDir = path.join(process.cwd(), "scripts");
  return fs
    .readdirSync(scriptsDir)
    .filter((f) => /^batch-\d+-results\.json$/i.test(f))
    .sort((a, b) => {
      const an = Number((a.match(/^batch-(\d+)-results\.json$/i) || [])[1] || 0);
      const bn = Number((b.match(/^batch-(\d+)-results\.json$/i) || [])[1] || 0);
      return an - bn;
    });
}

function readExistingImdbIds(batchFiles) {
  const scriptsDir = path.join(process.cwd(), "scripts");
  const out = new Set();
  for (const file of batchFiles) {
    try {
      const rows = JSON.parse(fs.readFileSync(path.join(scriptsDir, file), "utf8"));
      if (!Array.isArray(rows)) continue;
      for (const r of rows) {
        const id = String(r?.imdbId || r?.imdb_id || "").trim();
        if (/^tt\d{6,10}$/i.test(id)) out.add(id);
      }
    } catch {
      // ignore broken file
    }
  }
  return out;
}

async function fetchTmdbByImdb(imdbId) {
  const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
            continue;
          }
        }
        return null;
      }
      const data = await res.json();
      const movie =
        Array.isArray(data?.movie_results) && data.movie_results.length > 0 ? data.movie_results[0] : null;
      if (!movie) return null;
      return {
        imdbId,
        title: movie.title || "",
        year: movie.release_date ? Number.parseInt(String(movie.release_date).slice(0, 4), 10) : null,
        overview: movie.overview || "",
        rating: movie.vote_average || 0,
        poster: movie.poster_path || null,
        backdrop: movie.backdrop_path || null,
        genres: Array.isArray(movie.genre_ids) ? movie.genre_ids : [],
        release_date: movie.release_date || null,
        runtime: movie.runtime || null,
        language: movie.original_language || null,
      };
    } catch {
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function main() {
  const limit = argValue("limit", DEFAULT_LIMIT);
  const bulkIds = readBulkIds();
  const batchFiles = getBatchFiles();
  const existing = readExistingImdbIds(batchFiles);

  const newIds = bulkIds.filter((id) => !existing.has(id)).slice(0, limit);
  console.log(`[source-sync] bulk ids: ${bulkIds.length}`);
  console.log(`[source-sync] existing processed: ${existing.size}`);
  console.log(`[source-sync] new candidates: ${newIds.length}`);

  if (newIds.length === 0) {
    console.log("[source-sync] nothing new to add");
    return;
  }

  const added = [];
  let misses = 0;
  for (let i = 0; i < newIds.length; i++) {
    const id = newIds[i];
    if (i > 0) await new Promise((r) => setTimeout(r, 120));
    const row = await fetchTmdbByImdb(id);
    if (row && row.poster && row.year) added.push(row);
    else misses += 1;
    if ((i + 1) % 50 === 0) {
      console.log(
        `[source-sync] processed ${i + 1}/${newIds.length}, added=${added.length}, skipped=${misses}`
      );
    }
  }

  if (added.length === 0) {
    console.log("[source-sync] no valid TMDB rows found");
    return;
  }

  const lastBatchNum =
    batchFiles.length > 0
      ? Number((batchFiles[batchFiles.length - 1].match(/^batch-(\d+)-results\.json$/i) || [])[1] || 0)
      : 0;
  const newBatchNum = lastBatchNum + 1;
  const outFile = path.join(process.cwd(), "scripts", `batch-${newBatchNum}-results.json`);
  fs.writeFileSync(outFile, JSON.stringify(added, null, 2), "utf8");

  console.log(`[source-sync] wrote ${added.length} new movies -> ${outFile}`);
  console.log("[source-sync] done");
}

main().catch((e) => {
  console.error("[source-sync] fatal:", e?.stack || e);
  process.exit(1);
});


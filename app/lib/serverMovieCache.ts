import fs from "fs";
import path from "path";
import { getAllProcessedMovies } from "@/lib/moviesDataServer";

export type ServerMovie = ReturnType<typeof getAllProcessedMovies>[number];

type Cache = {
  at: number;
  fingerprint: string;
  allMovies: ServerMovie[];
  byImdbId: Map<string, ServerMovie>;
};

let cache: Cache | null = null;
const TTL_MS = 10 * 60 * 1000;

function fingerprintBatches(): string {
  try {
    const scriptsDir = path.join(process.cwd(), "scripts");
    if (!fs.existsSync(scriptsDir)) return "no-scripts-dir";
    const files = fs
      .readdirSync(scriptsDir)
      .filter((f) => f.startsWith("batch-") && f.endsWith("-results.json"))
      .sort();
    // A compact fingerprint is enough to detect changes.
    const parts: string[] = [];
    for (const f of files) {
      const p = path.join(scriptsDir, f);
      const st = fs.statSync(p);
      parts.push(`${f}:${st.size}:${st.mtimeMs}`);
    }
    return parts.join("|") || "no-batch-files";
  } catch {
    return "fingerprint-error";
  }
}

export function getServerMovieCache(): Cache {
  const now = Date.now();
  const fp = fingerprintBatches();
  if (cache && now - cache.at < TTL_MS && cache.fingerprint === fp) return cache;

  const allMovies = getAllProcessedMovies();
  const byImdbId = new Map<string, ServerMovie>();
  for (const m of allMovies) {
    const id = (m as any)?.imdb_id;
    if (typeof id === "string" && id.trim() && !byImdbId.has(id)) {
      byImdbId.set(id, m);
    }
  }

  cache = { at: now, fingerprint: fp, allMovies, byImdbId };
  return cache;
}


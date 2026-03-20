import fs from "fs";
import path from "path";

type ProcessedMovie = {
  id: string;
  imdb_id: string;
  title: string;
  year: number;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  original_language?: string;
  genres?: any[];
};

let cache: { at: number; data: ProcessedMovie[] } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

export function getAllProcessedMovies(): ProcessedMovie[] {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  const scriptsDir = path.join(process.cwd(), "scripts");
  if (!fs.existsSync(scriptsDir)) {
    cache = { at: now, data: [] };
    return [];
  }

  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith("batch-") && file.endsWith("-results.json"))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || "0", 10);
      return aNum - bNum;
    });

  const allMovies: ProcessedMovie[] = [];

  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const batchData = JSON.parse(fs.readFileSync(batchPath, "utf8"));

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
    } catch (error) {
      console.error(`Error reading batch file ${batchFile}:`, error);
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

  cache = { at: now, data: allMovies };
  return allMovies;
}


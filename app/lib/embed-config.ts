/**
 * Embed domains: sirf wahi jo "waha" (partner site) use karti hain.
 * Optional: EMBED_CONFIG_URL set ho to wahi se list aati hai.
 */

const CACHE_MS = 60 * 60 * 1000; // 1 hour
let cached: EmbedServer[] | null = null;
let cachedAt = 0;

export interface EmbedServer {
  name: string;
  getMovieUrl: (imdbId: string, tmdbId?: number) => string;
  getTvUrl: (tmdbId: number, season: number, episode: number, seriesImdbId?: string) => string;
}

// Sirf waha jo use ho rahi hain: vsembed.ru (VidSrc), embos.net
function defaultServers(): EmbedServer[] {
  return [
    {
      name: 'Server 1',
      getMovieUrl: (imdbId) => `https://vsembed.ru/embed/movie/${imdbId}`,
      getTvUrl: (tmdbId, s, e, seriesImdbId) =>
        tmdbId
          ? `https://vsembed.ru/embed/tv/${tmdbId}/${s}-${e}?autoplay=1`
          : `https://vsembed.ru/embed/tv/${seriesImdbId || ''}/${s}-${e}?autoplay=1`,
    },
    {
      name: 'Server 2',
      getMovieUrl: (_imdbId, tmdbId) =>
        tmdbId
          ? `https://embos.net/movie/?mid=${tmdbId}`
          : `https://vsembed.ru/embed/movie/${_imdbId}`,
      getTvUrl: (tmdbId, s, e, seriesImdbId) =>
        tmdbId
          ? `https://embos.net/tv/?mid=${tmdbId}&s=${s}&e=${e}`
          : `https://vsembed.ru/embed/tv/${seriesImdbId || ''}/${s}-${e}?autoplay=1`,
    },
  ];
}

function parseConfigJson(json: unknown): EmbedServer[] | null {
  if (!json || typeof json !== 'object' || !Array.isArray((json as any).servers)) return null;
  const servers = (json as { servers: Array<{ name?: string; movieBase?: string; tvBase?: string }> }).servers;
  return servers.slice(0, 5).map((s, i) => ({
    name: s.name || `Server ${i + 1}`,
    getMovieUrl: (imdbId: string) =>
      `${(s.movieBase || s.tvBase || 'https://vsembed.ru').replace(/\/$/, '')}/embed/movie/${imdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) =>
      `${(s.tvBase || s.movieBase || 'https://vsembed.ru').replace(/\/$/, '')}/embed/tv/${tmdbId}/${season}-${episode}?autoplay=1`,
  }));
}

export async function getEmbedServers(): Promise<EmbedServer[]> {
  if (cached && Date.now() - cachedAt < CACHE_MS) return cached;
  const url = process.env.EMBED_CONFIG_URL;
  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      const parsed = parseConfigJson(data);
      if (parsed?.length) {
        cached = parsed;
        cachedAt = Date.now();
        return cached;
      }
    } catch (_) {
      // fallback to defaults
    }
  }
  cached = defaultServers();
  cachedAt = Date.now();
  return cached;
}

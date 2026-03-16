// Episode slug helpers – used by [slug] page and episode content

/** IMDB format: ...-tt33241853_1x1 */
export function extractEpisodeIdFromSlug(slug: string): string | null {
  const match = slug.match(/tt(\d+_\d+x\d+)$/);
  return match ? `tt${match[1]}` : null;
}

/** TMDB fallback format: ...-tmdb-1911-1-1 */
export function extractTmdbEpisodeFromSlug(slug: string): { tmdbId: number; season: number; episode: number } | null {
  const match = slug.match(/tmdb-(\d+)-(\d+)-(\d+)$/);
  if (!match) return null;
  return {
    tmdbId: parseInt(match[1], 10),
    season: parseInt(match[2], 10),
    episode: parseInt(match[3], 10),
  };
}

/** True if slug is an episode slug (IMDB or TMDB format), not movie/series */
export function isEpisodeSlug(slug: string): boolean {
  if (extractEpisodeIdFromSlug(slug)) return true;
  if (extractTmdbEpisodeFromSlug(slug)) return true;
  return false;
}

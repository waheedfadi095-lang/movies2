export function resolvePosterUrl(
  posterPath: string | null | undefined,
  size: "w200" | "w300" | "w500" = "w500",
  fallbackUrl?: string | null
): string {
  if (!posterPath || !posterPath.trim()) {
    return fallbackUrl && fallbackUrl.trim() ? fallbackUrl : "/placeholder.svg";
  }

  // TMDB relative path -> primary source
  if (posterPath.startsWith("/")) {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  // Already an absolute URL
  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) {
    // Keep TMDB absolute URLs as primary.
    if (posterPath.includes("image.tmdb.org")) {
      return posterPath;
    }
    // Non-TMDB absolute URLs are treated as fallback sources.
    return fallbackUrl && fallbackUrl.trim() ? fallbackUrl : posterPath;
  }

  return fallbackUrl && fallbackUrl.trim() ? fallbackUrl : "/placeholder.svg";
}


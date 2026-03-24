function normalizeUrlString(url: string): string {
  const t = url.trim();
  if (t.startsWith("//")) return `https:${t}`;
  return t;
}

export function resolvePosterUrl(
  posterPath: string | null | undefined,
  size: "w200" | "w300" | "w500" = "w500",
  fallbackUrl?: string | null
): string {
  if (!posterPath || !posterPath.trim()) {
    if (fallbackUrl && fallbackUrl.trim()) {
      return normalizeUrlString(fallbackUrl);
    }
    return "/placeholder.svg";
  }

  // TMDB relative path -> primary source
  if (posterPath.startsWith("/")) {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  // Protocol-relative
  if (posterPath.startsWith("//")) {
    return `https:${posterPath}`;
  }

  // Already an absolute URL
  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) {
    // Keep TMDB absolute URLs as primary.
    if (posterPath.includes("image.tmdb.org")) {
      return posterPath;
    }
    // Other absolute URLs (e.g. source CDN) — use as-is for <img> / proxy layer.
    return normalizeUrlString(posterPath);
  }

  return fallbackUrl && fallbackUrl.trim()
    ? normalizeUrlString(fallbackUrl)
    : "/placeholder.svg";
}


import type { CSSProperties } from "react";
import { extendedLandings } from "@/data/extendedKeywordLandings";

/** Same shape as Navbar `keywordPages` entries */
export type KeywordNavSiteInfo = {
  name: string;
  tagline: string;
  logo: { first: string; second: string };
  firstStyle: CSSProperties;
  secondStyle: CSSProperties;
  iconBg: string;
  taglineColor: string;
};

/** Logo split per slug (uppercase display) */
const SLUG_SPLITS: Record<string, [string, string]> = {
  "123movies": ["123", "MOVIES"],
  gostream: ["GO", "STREAM"],
  putlocker: ["PUT", "LOCKER"],
  bflix: ["B", "FLIX"],
  netfree: ["NET", "FREE"],
  filmyhit: ["FILMY", "HIT"],
  "5movierulz": ["5MOVIE", "RULZ"],
  "7starhd": ["7STAR", "HD"],
  hdmovie2: ["HD", "MOVIE2"],
  ssrmovies: ["SSR", "MOVIES"],
  "9xmovies": ["9X", "MOVIES"],
  kuttymovies: ["KUTTY", "MOVIES"],
  sflix: ["S", "FLIX"],
  "9xflix": ["9X", "FLIX"],
  prmovies: ["PR", "MOVIES"],
  filmy4web: ["FILMY4", "WEB"],
  goojara: ["GOO", "JARA"],
  bolly4u: ["BOLLY", "4U"],
  moviesda: ["MOVIES", "DA"],
  filmy4wap: ["FILMY4", "WAP"],
  mp4moviez: ["MP4", "MOVIEZ"],
  ibomma: ["I", "BOMMA"],
  fzmovies: ["FZ", "MOVIES"],
};

function defaultSplit(keyword: string): [string, string] {
  const u = keyword.toUpperCase().replace(/\s+/g, "");
  for (const suf of ["MOVIES", "MOVIE", "FLIX", "WATCH", "DAY"] as const) {
    if (u.endsWith(suf) && u.length > suf.length) {
      return [u.slice(0, -suf.length), suf];
    }
  }
  if (u.length <= 5) return [u, ""];
  const mid = Math.ceil(u.length / 2);
  return [u.slice(0, mid), u.slice(mid)];
}

/** Branding for `/slug` pages backed by `extendedLandings` */
export function getExtendedKeywordNavInfo(pathname: string): KeywordNavSiteInfo | null {
  if (!pathname || pathname === "/") return null;
  const slug = pathname.replace(/^\//, "").toLowerCase();
  const entry = extendedLandings[slug];
  if (!entry) return null;

  const [first, secondRaw] = SLUG_SPLITS[slug] ?? defaultSplit(entry.keyword);
  const second = secondRaw.trim();
  const p = entry.colorTheme.primary;

  const tag =
    entry.description.length > 72 ? `${entry.description.slice(0, 72)}…` : entry.description;

  return {
    name: entry.keyword.toUpperCase().replace(/\s+/g, ""),
    tagline: tag,
    logo: { first, second },
    firstStyle: { color: p, fontWeight: 900 },
    secondStyle: { color: "#ffffff", fontWeight: 700 },
    iconBg: p,
    taglineColor: "#a3a3a3",
  };
}

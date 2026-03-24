import { NextResponse } from "next/server";
import { getReferenceHomeSnapshot, type RefHomePayload } from "@/lib/referenceHomeSnapshot";
import { HOME_DISPLAY_TITLES } from "@/data/homeReferenceDisplayTitles";

const SOURCE_URL = "https://ww8.123moviesfree.net/home/";

let cache: { at: number; data: RefHomePayload } | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 minutes
type RefMovie = RefHomePayload["suggestions"][number];

function isEmptySnapshot(data: RefHomePayload | null | undefined): boolean {
  if (!data) return true;
  const s = Array.isArray(data.suggestions) ? data.suggestions.length : 0;
  const m = Array.isArray(data.latestMovies) ? data.latestMovies.length : 0;
  const t = Array.isArray(data.latestTvSeries) ? data.latestTvSeries.length : 0;
  return s === 0 || m === 0 || t === 0;
}

function buildLocalFallbackSnapshot(): RefHomePayload {
  const toItems = (titles: readonly string[]): RefMovie[] =>
    titles.map((title) => ({
      title,
      href: "",
      poster: null,
      badge: null,
    }));
  return {
    source: "local-fallback://home-display-titles",
    fetchedAt: new Date().toISOString(),
    suggestions: toItems(HOME_DISPLAY_TITLES.suggestions),
    latestMovies: toItems(HOME_DISPLAY_TITLES.latestMovies),
    latestTvSeries: toItems(HOME_DISPLAY_TITLES.latestTvSeries),
  };
}

function extractSection(html: string, title: string): string | null {
  const marker = `<div class="fs-6 list-title">${title}</div>`;
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const after = html.slice(start + marker.length);
  // Next section marker
  const next = after.indexOf(`<div class="fs-6 list-title">`);
  return next === -1 ? after : after.slice(0, next);
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRe = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(tag))) {
    const key = (m[1] || "").toLowerCase();
    if (!key || key === "a" || key === "img") continue;
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    attrs[key] = value;
  }
  return attrs;
}

function classContains(classValue: string, className: string): boolean {
  return classValue
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .includes(className);
}

function parseItems(sectionHtml: string): RefMovie[] {
  const items: RefMovie[] = [];

  // Capture anchor blocks regardless of attribute order or quote style.
  const linkRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(sectionHtml))) {
    const openAttrs = parseAttributes(m[1] || "");
    const className = openAttrs.class || "";
    if (!classContains(className, "poster")) continue;

    const href = openAttrs.href || "";
    if (!href) continue;
    const inner = m[2] || "";

    const imgTag = inner.match(/<img\b([^>]*)>/i)?.[1] || "";
    const imgAttrs = parseAttributes(imgTag);
    const alt = imgAttrs.alt || null;
    const h2 = inner.match(/<h2[^>]*>\s*([^<]+)\s*<\/h2>/i)?.[1] ?? null;
    const title = (alt || h2 || "").trim();
    if (!title) continue;

    const poster = imgAttrs["data-src"] || imgAttrs.src || null;

    const badge =
      inner.match(/<span class="mlbq">\s*([^<\s]+)\s*<\/span>/i)?.[1] ??
      inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]?.trim()
        ? `Eps${inner.match(/<span class="mlbe">\s*Eps<i>\s*(\d+)\s*<\/i>\s*<\/span>/i)?.[1]}`
        : null;

    items.push({ title, href, poster, badge });
  }

  // Dedup by title keeping order
  const seen = new Set<string>();
  return items.filter((it) => {
    const key = it.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: Request) {
  try {
    const refresh = new URL(request.url).searchParams.get("refresh");
    const shouldRefresh = refresh === "1";
    const snapshot = getReferenceHomeSnapshot();
    const snapshotEmpty = isEmptySnapshot(snapshot);

    if (!shouldRefresh && !snapshotEmpty && cache && Date.now() - cache.at < TTL_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }
    if (!shouldRefresh && !snapshotEmpty) {
      cache = { at: Date.now(), data: snapshot };
      return NextResponse.json(snapshot, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }
    if (!shouldRefresh && snapshotEmpty) {
      const fallback = buildLocalFallbackSnapshot();
      cache = { at: Date.now(), data: fallback };
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    const res = await fetch(SOURCE_URL, {
      // avoid edge caching oddities
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; movies-site-bot/1.0; +https://example.invalid)",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      // Refresh failed: keep serving local snapshot (stable homepage).
      return NextResponse.json(snapshot, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }
    const html = await res.text();

    const suggestionsHtml = extractSection(html, "Suggestions") || "";
    const latestMoviesHtml = extractSection(html, "Latest Movies") || "";
    const latestTvHtml = extractSection(html, "Latest TV-Series") || "";

    const data: RefHomePayload = {
      source: SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      suggestions: parseItems(suggestionsHtml).slice(0, 60),
      latestMovies: parseItems(latestMoviesHtml).slice(0, 60),
      latestTvSeries: parseItems(latestTvHtml).slice(0, 60),
    };

    cache = { at: Date.now(), data };
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    console.error("Error in /api/reference/home:", e);
    return NextResponse.json(getReferenceHomeSnapshot(), {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  }
}


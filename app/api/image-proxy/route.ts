import { NextResponse } from "next/server";

/** Hosts we allow to proxy (hotlink / referrer issues on client). */
const ALLOWED_HOSTS = new Set([
  "img.icdn.my.id",
  "image.tmdb.org",
  "ww8.123moviesfree.net",
  "www.123moviesfree.net",
  "123moviesfree.net",
]);

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw?.trim()) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  const trimmed = raw.trim();
  let target: URL;
  try {
    target = new URL(trimmed);
  } catch {
    try {
      target = new URL(decodeURIComponent(trimmed));
    } catch {
      return NextResponse.json({ error: "invalid url" }, { status: 400 });
    }
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      cache: "no-store",
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://ww8.123moviesfree.net/",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      return NextResponse.json({ error: "not an image" }, { status: 502 });
    }

    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    console.error("image-proxy:", e);
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}

/** Sirf yahan default domain change karein – baaki sab isi se aata hai */
const DEFAULT_SITE_URL = 'https://ww1.n123movie.me';

/**
 * Get the current domain dynamically based on the request
 */
export function getCurrentDomain(request?: Request): string {
  if (request) {
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return DEFAULT_SITE_URL;
}

/**
 * Get the current domain for use in metadata generation
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  }
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * Build time / canonical ke liye – .env mein NEXT_PUBLIC_SITE_URL set karein, warna DEFAULT_SITE_URL use hogi
 */
export function getBaseUrlForBuild(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

/**
 * Request host se canonical base – localhost pe localhost, production pe wahi domain.
 * Use in generateMetadata() / layouts so canonicals match the URL you're viewing.
 */
export async function getCanonicalBase(): Promise<string> {
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const host = h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto');
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
      const protocol = proto || (isLocal ? 'http' : 'https');
      return `${protocol}://${host}`;
    }
  } catch {
    // no request context (e.g. build)
  }
  return getBaseUrlForBuild();
}

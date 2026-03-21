import { NextResponse } from 'next/server';
import { getBaseUrlForBuild } from '@/lib/domain';
import { extendedLandings } from '@/data/extendedKeywordLandings';

const DOMAIN = getBaseUrlForBuild();

const LEGACY_STYLE_LANDING_SLUGS = [
  'fmovies',
  'gomovies',
  'hurawatch',
  'lookmovie',
  'popcornflix',
  'soap2day',
  'solarmovie',
  'yesmovies',
] as const;

export async function GET() {
  try {
    const lastmod = new Date().toISOString();

    const extendedSlugs = Object.keys(extendedLandings);
    const allLandingPaths = [...new Set([...extendedSlugs, ...LEGACY_STYLE_LANDING_SLUGS])];

    const pages = [
      { url: DOMAIN, priority: '1.0', changefreq: 'daily' },
      ...allLandingPaths.map((slug) => ({
        url: `${DOMAIN}/${slug}`,
        priority: '0.8',
        changefreq: 'weekly',
      })),
    ];
    
    const urlEntries = pages
      .map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
      .join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating landing pages sitemap:', error);
    return new NextResponse('Error generating landing pages sitemap', { status: 500 });
  }
}


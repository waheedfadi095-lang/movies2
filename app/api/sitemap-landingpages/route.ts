import { NextResponse } from 'next/server';
import { getBaseUrlForBuild } from '@/lib/domain';

const DOMAIN = getBaseUrlForBuild();

export async function GET() {
  try {
    const lastmod = new Date().toISOString();
    
    // Main page + Landing variant pages (9 pages total)
    const pages = [
      { url: DOMAIN, priority: '1.0', changefreq: 'daily' },
      { url: `${DOMAIN}/fmovies`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/gomovies`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/hurawatch`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/lookmovie`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/popcornflix`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/soap2day`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/solarmovie`, priority: '0.8', changefreq: 'weekly' },
      { url: `${DOMAIN}/yesmovies`, priority: '0.8', changefreq: 'weekly' },
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


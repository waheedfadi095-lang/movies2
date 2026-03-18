import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getBaseUrlForBuild } from '@/lib/domain';

const DOMAIN = getBaseUrlForBuild();
const ITEMS_PER_SITEMAP = 50000; // 50k per sitemap

function countMoviesFromBatches(): number {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    return 0;
  }

  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith('batch-') && file.endsWith('-results.json'));

  let count = 0;

  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const raw = fs.readFileSync(batchPath, 'utf8');
      const batchData = JSON.parse(raw) as any[];

      batchData.forEach((movie) => {
        const imdbId = movie.imdb_id || movie.imdbId;
        if (imdbId && movie.title && movie.year && movie.poster) {
          count += 1;
        }
      });
    } catch (err) {
      console.error(`Error counting movies in batch file for sitemap index: ${batchFile}`, err);
    }
  }

  return count;
}

export async function GET() {
  try {
    const totalMovies = countMoviesFromBatches();
    const numberOfMovieSitemaps = Math.max(
      1,
      Math.ceil(totalMovies / ITEMS_PER_SITEMAP)
    );

    const lastmod = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({ length: numberOfMovieSitemaps }, (_, i) => `  <sitemap>
    <loc>${DOMAIN}/api/sitemap-movies/${i + 1}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating movie sitemap index:', error);
    return new NextResponse('Error generating movie sitemap index', { status: 500 });
  }
}



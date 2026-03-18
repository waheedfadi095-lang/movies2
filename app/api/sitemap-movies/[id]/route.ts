import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateMovieUrl } from '@/lib/slug';
import { getBaseUrlForBuild } from '@/lib/domain';

const DOMAIN = getBaseUrlForBuild();
const MOVIES_PER_SITEMAP = 50000; // 50k per sitemap batch

type BatchMovie = {
  imdbId?: string;
  imdb_id?: string;
  title?: string;
  year?: number;
  poster?: string;
};

function loadAllBatchMovies(): { imdb_id: string; title: string }[] {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    return [];
  }

  const batchFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.startsWith('batch-') && file.endsWith('-results.json'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      const bNum = parseInt(b.match(/batch-(\d+)-results\.json/)?.[1] || '0', 10);
      return aNum - bNum;
    });

  const allMovies: { imdb_id: string; title: string }[] = [];

  for (const batchFile of batchFiles) {
    try {
      const batchPath = path.join(scriptsDir, batchFile);
      const raw = fs.readFileSync(batchPath, 'utf8');
      const batchData = JSON.parse(raw) as BatchMovie[];

      batchData.forEach((movie) => {
        const imdbId = movie.imdb_id || movie.imdbId;
        if (!imdbId || !movie.title || !movie.year || !movie.poster) {
          return;
        }
        allMovies.push({
          imdb_id: imdbId,
          title: movie.title,
        });
      });
    } catch (err) {
      console.error(`Error reading batch file for sitemap: ${batchFile}`, err);
    }
  }

  return allMovies;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sitemapNumber = parseInt(id, 10);
    
    if (isNaN(sitemapNumber) || sitemapNumber < 1) {
      return new NextResponse('Invalid sitemap number', { status: 400 });
    }

    // Load the same movies that power the site UI (from batch JSON files)
    const allMovies = loadAllBatchMovies();
    const totalMovies = allMovies.length;
    
    // Calculate start and end indices for this sitemap
    const startIndex = (sitemapNumber - 1) * MOVIES_PER_SITEMAP;
    const endIndex = Math.min(startIndex + MOVIES_PER_SITEMAP, totalMovies);
    
    // Check if sitemap number is valid
    if (startIndex >= totalMovies) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    
    // Get movies for this chunk
    const moviesChunk = allMovies.slice(startIndex, endIndex);
    
    console.log(
      `Generating sitemap ${sitemapNumber}: Movies ${startIndex}-${endIndex} (${moviesChunk.length} movies)`
    );
    
    // Generate sitemap XML directly from movie IDs (without TMDB API call for speed)
    const lastmod = new Date().toISOString();
    
    // Generate sitemap XML with actual movie URLs (title-slug format)
    const urlEntries = moviesChunk
      .filter((movie) => movie.imdb_id && movie.title)
      .map((movie) => {
        const url = generateMovieUrl(movie.title, movie.imdb_id);
        return `  <url>
    <loc>${DOMAIN}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    
    const urlEntriesString = urlEntries.join('\n');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntriesString}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
    
  } catch (error) {
    console.error('Error generating movie sitemap:', error);
    return new NextResponse('Error generating movie sitemap', { status: 500 });
  }
}



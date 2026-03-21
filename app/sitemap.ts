import { MetadataRoute } from 'next';

import { getBaseUrlForBuild } from '@/lib/domain';
import { TV_SERIES_IDS } from '@/data/tvSeriesIds';

const DOMAIN = getBaseUrlForBuild();

/**
 * Main sitemap - redirects to sitemap index
 * For the full sitemap structure, visit /api/sitemap-index.xml
 * 
 * This provides a basic fallback sitemap with essential pages
 * The complete sitemap with all 95k+ movies is available via the sitemap index
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SERIES_PER_SITEMAP = 1000;
  const totalSeries = TV_SERIES_IDS.length;
  const numberOfSeriesSitemaps = Math.ceil(totalSeries / SERIES_PER_SITEMAP);
  // Main static pages - basic fallback
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/genres`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/years`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/country`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Keyword / SEO landing guides
    ...[
      '123movies',
      'gostream',
      'putlocker',
      'bflix',
      'netfree',
      'filmyhit',
      '5movierulz',
      '7starhd',
      'hdmovie2',
      'ssrmovies',
      '9xmovies',
      'kuttymovies',
      'sflix',
      '9xflix',
      'prmovies',
      'filmy4web',
      'goojara',
      'bolly4u',
      'moviesda',
      'filmy4wap',
      'mp4moviez',
      'ibomma',
      'fzmovies',
      'fmovies',
      'gomovies',
      'hurawatch',
      'soap2day',
      'lookmovie',
      'popcornflix',
      'solarmovie',
      'yesmovies',
    ].map((path) => ({
      url: `${DOMAIN}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    })),
  ];

  // Also expose all sitemap XML endpoints as URLs inside sitemap.xml
  const sitemapXmlLinks: MetadataRoute.Sitemap = [
    // Dynamic sitemap index (movies + TV series + pages, years, genres, countries, landing pages)
    {
      url: `${DOMAIN}/api/sitemap-index.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Static XML sitemap files under /sitemaps (movies)
    {
      url: `${DOMAIN}/sitemaps/sitemap-index.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/sitemaps/sitemap-pages.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/sitemaps/sitemap-years.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/sitemaps/sitemap-genres.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/sitemaps/sitemap-countries.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Pre-generated movie sitemap XML files
    ...Array.from({ length: 10 }, (_, i) => ({
      url: `${DOMAIN}/sitemaps/sitemap-movies-${i + 1}.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Dynamic TV series sitemap endpoints (covering all 17k+ series)
    ...Array.from({ length: numberOfSeriesSitemaps }, (_, i) => ({
      url: `${DOMAIN}/api/sitemap-series/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...sitemapXmlLinks];
}
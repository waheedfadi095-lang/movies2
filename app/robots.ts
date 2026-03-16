import { MetadataRoute } from 'next';
import { getBaseUrlForBuild } from '@/lib/domain';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrlForBuild();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/test-*/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/test-*/',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/api/sitemap-index.xml`,
    ],
    host: baseUrl,
  };
}

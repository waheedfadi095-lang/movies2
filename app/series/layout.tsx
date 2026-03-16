import { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/series`;
  return {
    title: 'TV Series - Watch TV Shows Online',
    description: 'Browse and watch thousands of TV series online. Stream your favorite TV shows in HD quality.',
    alternates: { canonical: url },
    openGraph: {
      title: 'TV Series - Watch TV Shows Online',
      description: 'Browse and watch thousands of TV series online. Stream your favorite TV shows in HD quality.',
      url,
      type: 'website',
    },
  };
}

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}



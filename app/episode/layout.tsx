import { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/episode`;
  return {
    title: 'TV Episodes - Watch Episodes Online',
    description: 'Watch TV episodes online. Stream your favorite TV show episodes in HD quality.',
    alternates: { canonical: url },
    openGraph: {
      title: 'TV Episodes - Watch Episodes Online',
      description: 'Watch TV episodes online. Stream your favorite TV show episodes in HD quality.',
      url,
      type: 'website',
    },
  };
}

export default function EpisodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}



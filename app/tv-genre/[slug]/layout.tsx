import { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

interface TVGenreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TVGenreLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const base = await getCanonicalBase();
  return {
    alternates: {
      canonical: `${base}/tv-genre/${slug}`,
    },
  };
}

export default function TVGenreLayout({ children }: TVGenreLayoutProps) {
  return children;
}

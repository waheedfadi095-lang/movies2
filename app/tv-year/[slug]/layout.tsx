import { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

interface TVYearLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TVYearLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const base = await getCanonicalBase();
  return {
    alternates: {
      canonical: `${base}/tv-year/${slug}`,
    },
  };
}

export default function TVYearLayout({ children }: TVYearLayoutProps) {
  return children;
}

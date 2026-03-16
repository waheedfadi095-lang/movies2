import { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

interface YearLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: YearLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const base = await getCanonicalBase();
  return {
    alternates: {
      canonical: `${base}/year/${slug}`,
    },
  };
}

export default function YearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

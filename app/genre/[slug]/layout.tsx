import { generateGenrePageSEO, generateMovieMetadata } from "../../lib/seo";
import { getCanonicalBase } from "../../lib/domain";

interface GenreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GenreLayoutProps) {
  const { slug } = await params;
  const base = await getCanonicalBase();
  const genreName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const seoConfig = generateGenrePageSEO(genreName, `${base}/genre/${slug}`);
  return {
    ...generateMovieMetadata(seoConfig),
    alternates: {
      canonical: `${base}/genre/${slug}`,
    },
  };
}

export default function GenreLayout({ children }: GenreLayoutProps) {
  return <>{children}</>;
}

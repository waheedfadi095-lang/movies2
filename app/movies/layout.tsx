import { Metadata } from "next";
import { getCanonicalBase } from "../lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/movies`;
  return {
    title: 'All Movies | Watch Movies Online Free | 123Movies',
    description: 'Browse thousands of movies online for free. Watch latest releases, classic films, and discover your favorite movies. No registration required.',
    keywords: 'all movies, watch movies online, free movies, movie streaming, browse movies, movie collection',
    alternates: { canonical: url },
    openGraph: {
      title: 'All Movies | Watch Movies Online Free | 123Movies',
      description: 'Browse thousands of movies online for free.',
      url,
      type: 'website',
    },
  };
}

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

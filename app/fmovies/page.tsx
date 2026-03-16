import LandingVariant1 from "../components/LandingVariant1";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/fmovies`;
  return {
    title: "Fmovies - Stream Movies and TV Shows Online Free",
    description: "Fmovies offers unlimited streaming of movies and TV series in HD quality. Watch the latest releases and classic films without any subscription fees.",
    keywords: "fmovies, free movies online, stream movies, HD streaming, watch TV shows, online streaming",
    alternates: { canonical: url },
    openGraph: {
      title: "Fmovies - Stream Movies and TV Shows Online Free",
      description: "Fmovies offers unlimited streaming of movies and TV series in HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Fmovies - Watch Free Movies and TV Series Online",
  intro: [
    "Welcome to Fmovies, where streaming entertainment is completely free and accessible to everyone. Dive into our massive collection of movies and TV shows without paying a single penny. From the latest Hollywood releases to timeless classics, we've gathered everything you need for unlimited entertainment.",
    "No registration required, no credit card needed – just click and watch. Our platform is designed for movie lovers who want instant access to quality content without barriers. Start streaming your favorite movies and discover new ones every day."
  ],
  sections: [
    {
      title: "Why Fmovies is the Best Choice for Free Streaming",
      paragraphs: [
        "Fmovies has become one of the most popular destinations for free movie streaming worldwide. With thousands of movies and TV series available at your fingertips, you'll never run out of entertainment options. We update our library daily with the latest releases, ensuring you're always up to date with trending content.",
        "Our platform works on all devices - watch on your smartphone, tablet, laptop, or desktop computer. The responsive design ensures perfect viewing experience regardless of screen size. Switch between devices seamlessly and continue watching where you left off."
      ]
    },
    {
      title: "Massive Library of Movies and TV Shows",
      paragraphs: [
        "Browse through an incredible selection of content spanning all genres and decades. Action, comedy, drama, horror, romance, sci-fi, thriller - we have it all. From brand new releases to golden oldies, from Hollywood blockbusters to independent films, Fmovies covers every taste and preference.",
        "TV show enthusiasts will find complete seasons of popular series, including the latest episodes. Binge-watch entire series or catch up on missed episodes. Our collection includes both ongoing shows and completed series, giving you endless hours of entertainment."
      ]
    },
    {
      title: "Fast Streaming with HD Quality",
      paragraphs: [
        "Experience smooth, buffer-free streaming with our optimized servers. Watch movies in high definition quality with clear audio and sharp video. Our advanced streaming technology ensures minimal loading time and maximum viewing pleasure.",
        "Multiple server options provide backup if one is slow or unavailable. The player automatically adjusts quality based on your internet connection speed, preventing annoying buffering interruptions while maintaining the best possible picture quality."
      ]
    },
    {
      title: "100% Free - No Hidden Costs",
      paragraphs: [
        "Fmovies is completely free to use. No subscription fees, no registration required, no credit card information needed. Simply visit the site, search for your favorite content, and start watching immediately. It's that simple and straightforward.",
        "We believe everyone deserves access to quality entertainment without financial barriers. That's why Fmovies will always remain free. Enjoy unlimited streaming without worrying about bills, trials that expire, or surprise charges."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#3b82f6',      // Blue
  secondary: '#8b5cf6',    // Purple
  accent: '#6366f1',       // Indigo
  buttonBg: '#3b82f6',
  buttonHover: '#2563eb',
  searchBorder: '#3b82f6',
  searchFocus: '#2563eb',
  cardHover: '#3b82f6',
  playButton: '#3b82f6',
  textAccent: '#3b82f6'
};

export default function FmoviesPage() {
  return (
    <LandingVariant1
      keyword="Fmovies"
      description="Unlimited Streaming of Movies and TV Series"
      colorTheme={colorTheme}
      content={content}
    />
  );
}


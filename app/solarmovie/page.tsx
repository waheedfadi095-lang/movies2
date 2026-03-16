import LandingVariant6 from "../components/LandingVariant6";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/solarmovie`;
  return {
    title: "Solarmovie - Watch Free Movies and TV Shows Online",
    description: "Solarmovie brings you unlimited streaming of movies and TV series. High-quality playback with no subscription fees. Your entertainment hub.",
    keywords: "solarmovie, free movies, online streaming, TV shows free, HD streaming, watch series",
    alternates: { canonical: url },
    openGraph: {
      title: "Solarmovie - Watch Free Movies and TV Shows Online",
      description: "Solarmovie brings you unlimited streaming of movies and TV series in HD.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Solarmovie - Free Movie and TV Series Streaming Platform",
  intro: [
    "Solarmovie shines as one of the premier destinations for free online streaming. Watch an incredible selection of movies and TV shows without spending a dime. Our platform offers instant access to thousands of titles across all genres, ready to stream in excellent quality whenever you want.",
    "No registration hassles, no subscription fees, no payment information required. Solarmovie keeps streaming simple and straightforward. Just browse our extensive library, pick what you want to watch, and start streaming immediately. It's entertainment made easy and accessible for everyone."
  ],
  sections: [
    {
      title: "Your Free Streaming Destination",
      paragraphs: [
        "Solarmovie has built a reputation as a trusted platform for free entertainment. We provide unrestricted access to a vast collection of movies and TV series without any cost barriers. Whether you're a casual viewer or a dedicated binge-watcher, Solarmovie welcomes you with open arms and endless content.",
        "Our mission is simple: make quality entertainment accessible to everyone, everywhere. No paywalls, no premium tiers, no hidden charges. Everything you see on Solarmovie is completely free to stream. This commitment to accessibility has made us a favorite among millions of viewers worldwide."
      ]
    },
    {
      title: "Extensive Movie and TV Library",
      paragraphs: [
        "Explore thousands of movies spanning every genre and decade. From latest releases to golden-age classics, from Hollywood blockbusters to international cinema, Solarmovie's library is designed to satisfy all tastes. Action, comedy, drama, horror, romance, sci-fi, thriller – we have comprehensive coverage of every category.",
        "TV series fans will appreciate our complete collection of popular shows. Watch full seasons of your favorite series, discover new shows to love, or revisit classic episodes. Both current ongoing series and completed shows are available, giving you total freedom in how you consume content."
      ]
    },
    {
      title: "Quality Streaming Experience",
      paragraphs: [
        "Solarmovie prioritizes delivering smooth, high-quality streams. Watch movies and shows with clear picture quality and excellent sound. Our servers are optimized for reliable performance, ensuring minimal interruptions and maximum enjoyment during your viewing sessions.",
        "Smart streaming technology adapts to your internet connection, automatically adjusting quality to prevent buffering while maintaining the best possible picture. Multiple server options provide backup choices if one is experiencing issues, ensuring you can always find a working stream."
      ]
    },
    {
      title: "Easy Access Across All Devices",
      paragraphs: [
        "Solarmovie works seamlessly on any device with a web browser. Stream on your smartphone while commuting, watch on your tablet from bed, or enjoy the full experience on your laptop or desktop computer. No apps to download, no installations required – just open your browser and start watching.",
        "The responsive design ensures optimal viewing experience regardless of screen size. Whether you're on a small phone screen or a large desktop monitor, Solarmovie adapts perfectly to provide comfortable navigation and excellent playback quality. Entertainment is truly portable with Solarmovie."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#f97316',      // Orange
  secondary: '#fb923c',    // Orange-400
  accent: '#ea580c',       // Orange-600
  buttonBg: '#f97316',
  buttonHover: '#ea580c',
  searchBorder: '#f97316',
  searchFocus: '#ea580c',
  cardHover: '#f97316',
  playButton: '#f97316',
  textAccent: '#f97316'
};

export default function SolarmoviesPage() {
  return (
    <LandingVariant6
      keyword="Solarmovie"
      description="Streaming Sunshine for Movie Lovers"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

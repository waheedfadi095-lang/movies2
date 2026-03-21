import PopcornflixStyleLanding from "../components/keyword-landings/PopcornflixStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/popcornflix`;
  return {
    title: "Popcornflix - Free Movie Streaming Platform Online",
    description: "Popcornflix delivers free streaming of popular movies and series. No subscription required. Enjoy unlimited entertainment in excellent quality anytime.",
    keywords: "popcornflix, free movie platform, stream online, watch movies, TV series free, entertainment hub",
    alternates: { canonical: url },
    openGraph: {
      title: "Popcornflix - Free Movie Streaming Platform Online",
      description: "Popcornflix delivers free streaming of popular movies and series.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Popcornflix - Stream Free Movies and Shows Online",
  intro: [
    "Grab your popcorn and settle in for unlimited entertainment with Popcornflix! Our platform brings you a fantastic selection of movies and TV shows, all available to stream for free. No subscriptions, no sign-ups, no payment required – just instant access to thousands of hours of entertainment.",
    "Popcornflix makes movie night every night with our easy-to-use streaming platform. Whether you're in the mood for action, comedy, drama, or anything in between, our diverse library has something perfect for every viewer. Start watching immediately and discover your next favorite film or series."
  ],
  sections: [
    {
      title: "Free Entertainment for All",
      paragraphs: [
        "Popcornflix believes great movies and shows should be available to everyone, which is why we offer completely free streaming. No subscription plans to choose from, no trial periods that expire, no credit card information needed. Simply visit Popcornflix, find what you want to watch, and start streaming instantly.",
        "Our commitment to free entertainment means you can enjoy unlimited viewing without worrying about costs. Watch as many movies and shows as you want, whenever you want. Popcornflix is here to provide quality entertainment without financial barriers, making cinema accessible to all."
      ]
    },
    {
      title: "Diverse Content Library",
      paragraphs: [
        "Dive into our carefully curated collection of movies spanning all genres and styles. Action-packed blockbusters, hilarious comedies, gripping dramas, scary horror films, heartwarming romances – Popcornflix offers variety that keeps every viewing session fresh and exciting. From mainstream hits to hidden gems, there's always something new to discover.",
        "TV series enthusiasts will find plenty to love with our selection of complete seasons and popular shows. Binge-watch entire series over a weekend or savor them episode by episode. Our library includes both classic series that defined television and newer shows that are currently trending."
      ]
    },
    {
      title: "Simple, Fast Streaming",
      paragraphs: [
        "Popcornflix is designed for hassle-free streaming. The intuitive interface makes finding content quick and easy. Browse by genre, search for specific titles, or explore featured collections. Everything is organized logically to help you find exactly what you're looking for without frustration.",
        "Our optimized streaming technology ensures smooth playback with minimal buffering. Videos load quickly and play reliably, letting you focus on enjoying the content rather than dealing with technical issues. Multiple quality options allow you to balance picture clarity with your internet speed."
      ]
    },
    {
      title: "Watch Anywhere, Anytime",
      paragraphs: [
        "Popcornflix works perfectly across all your devices. Stream on your phone during your daily commute, watch on your tablet while relaxing, or enjoy the big-screen experience on your computer. The responsive platform adapts seamlessly to any screen size for optimal viewing.",
        "No apps or downloads required – Popcornflix runs directly in your web browser. This means instant access from any device with internet connectivity. Whether you're at home, at work, or traveling, your entertainment is always just a click away with Popcornflix."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#dc2626',      // Red-600
  secondary: '#fbbf24',    // Amber-400  
  accent: '#b91c1c',       // Red-700
  buttonBg: '#dc2626',
  buttonHover: '#b91c1c',
  searchBorder: '#dc2626',
  searchFocus: '#b91c1c',
  cardHover: '#dc2626',
  playButton: '#dc2626',
  textAccent: '#dc2626'
};

export default function PopcornflixPage() {
  return (
    <PopcornflixStyleLanding
      keyword="Popcornflix"
      description="Pop Some Corn and Start Streaming"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

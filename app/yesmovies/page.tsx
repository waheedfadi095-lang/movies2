import YesmoviesStyleLanding from "../components/keyword-landings/YesmoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/yesmovies`;
  return {
    title: "Yesmovies - Free Online Movie Streaming in High Quality",
    description: "Yesmovies provides free access to movies and TV series. Stream in HD with no buffering, no registration needed. Your ultimate movie streaming destination.",
    keywords: "yesmovies, free streaming platform, HD movies, online series, movie streaming, watch free",
    alternates: { canonical: url },
    openGraph: {
      title: "Yesmovies - Free Online Movie Streaming in High Quality",
      description: "Yesmovies provides free access to movies and TV series in HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Yesmovies - Watch Free Movies and TV Shows Online",
  intro: [
    "Say yes to unlimited entertainment with Yesmovies! Our platform delivers an extensive collection of movies and TV series, all available to stream instantly and completely free. No registration required, no hidden fees – just straightforward access to thousands of hours of quality content.",
    "Yesmovies makes streaming simple and enjoyable. Whether you're looking for the latest releases or want to revisit classic favorites, our well-organized library has you covered. Start watching within seconds and discover why millions choose Yesmovies for their entertainment needs."
  ],
  sections: [
    {
      title: "Why Choose Yesmovies",
      paragraphs: [
        "Yesmovies stands out as a reliable, user-friendly streaming platform that puts viewers first. We've eliminated all the frustrating barriers that plague other streaming sites. No forced sign-ups, no payment walls, no complicated navigation – just pure, uninterrupted entertainment available at your fingertips.",
        "Our platform is built around you and your viewing preferences. The clean interface makes finding content effortless, while our powerful search functionality helps you locate specific titles in seconds. Yesmovies respects your time by providing direct access to what you want to watch."
      ]
    },
    {
      title: "Endless Entertainment Options",
      paragraphs: [
        "Dive into a massive library featuring movies from every genre and era. Action-packed adventures, heartwarming romances, spine-tingling horrors, laugh-out-loud comedies – Yesmovies has it all. From Hollywood blockbusters to independent films, from mainstream hits to cult classics, our diverse collection ensures you'll never run out of options.",
        "TV series enthusiasts will love our comprehensive collection of complete seasons. Binge-watch your favorite shows, discover new series to follow, or catch up on episodes you missed. Both ongoing series and completed shows are available, giving you the freedom to watch at your own pace."
      ]
    },
    {
      title: "High-Quality Streaming",
      paragraphs: [
        "Enjoy movies and shows in excellent quality with Yesmovies. Our streams are optimized to deliver clear picture and crisp audio, ensuring an immersive viewing experience. We understand that quality matters, which is why we prioritize delivering the best possible streams for every title.",
        "Smart adaptive streaming technology adjusts to your internet connection speed, preventing buffering while maintaining optimal quality. Whether you're on high-speed broadband or mobile data, Yesmovies provides smooth, consistent playback that keeps you engaged in the story."
      ]
    },
    {
      title: "Always Free, Always Accessible",
      paragraphs: [
        "Yesmovies is committed to keeping entertainment free and accessible for everyone. No subscription fees today, tomorrow, or ever. No premium tiers or hidden costs. Everything you see on Yesmovies is available to watch immediately without spending a penny.",
        "Access Yesmovies from any device with a web browser. Watch on your phone, tablet, laptop, or desktop – the platform works seamlessly across all devices. No apps to install, no compatibility issues to worry about. Just open your browser and start streaming instantly."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#f59e0b',      // Darker Amber - Better contrast
  secondary: '#d97706',    // Amber-600
  accent: '#b45309',       // Amber-700 - Much more readable
  buttonBg: '#f59e0b',
  buttonHover: '#d97706',
  searchBorder: '#f59e0b',
  searchFocus: '#d97706',
  cardHover: '#f59e0b',
  playButton: '#f59e0b',
  textAccent: '#d97706'
};

export default function YesmoviesPage() {
  return (
    <YesmoviesStyleLanding
      keyword="Yesmovies"
      description="Say Yes to Free Entertainment"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

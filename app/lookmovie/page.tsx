import LookmovieStyleLanding from "../components/keyword-landings/LookmovieStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/lookmovie`;
  return {
    title: "Lookmovie - Stream HD Movies and Shows Instantly",
    description: "Lookmovie offers instant streaming of movies and TV series in superb quality. Browse thousands of titles and watch immediately without any fees.",
    keywords: "lookmovie, instant streaming, HD movies, watch shows, free platform, online entertainment",
    alternates: { canonical: url },
    openGraph: {
      title: "Lookmovie - Stream HD Movies and Shows Instantly",
      description: "Lookmovie offers instant streaming of movies and TV series in superb quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Lookmovie - Watch Free Movies and TV Series Online",
  intro: [
    "Look no further than Lookmovie for all your streaming entertainment needs! Our platform provides instant access to thousands of movies and TV shows, all available to watch completely free. No registration barriers, no subscription fees – just pure entertainment ready to stream whenever you want it.",
    "Lookmovie combines a massive content library with user-friendly design to create the perfect streaming experience. Whether you're searching for the latest releases or classic favorites, our organized platform makes finding and watching content effortless. Start streaming now and see why viewers choose Lookmovie."
  ],
  sections: [
    {
      title: "Instant Streaming Access",
      paragraphs: [
        "Lookmovie delivers on its promise of instant entertainment. Click on any movie or show and start watching within seconds. No waiting for downloads, no buffering delays, no complicated setup. Our fast servers and optimized streaming technology ensure you spend more time watching and less time waiting.",
        "The streamlined platform eliminates all unnecessary steps between you and your entertainment. No account creation forms to fill out, no email verification to complete, no payment information to provide. Lookmovie respects your time by offering direct access to content immediately."
      ]
    },
    {
      title: "Comprehensive Entertainment Library",
      paragraphs: [
        "Browse through thousands of carefully selected titles covering every genre and style. Lookmovie's extensive library includes latest releases, timeless classics, popular TV series, and hidden gems waiting to be discovered. From Hollywood blockbusters to international films, from mainstream shows to cult favorites, we have something for everyone.",
        "Our collection is constantly updated with fresh content. New movies and TV episodes are added regularly, ensuring there's always something new to watch. Use our advanced search and filter options to quickly find exactly what you're in the mood for, whether that's a specific title or just something in a particular genre."
      ]
    },
    {
      title: "High-Quality Viewing Experience",
      paragraphs: [
        "Lookmovie prioritizes streaming quality to ensure you enjoy every movie and show at its best. Watch in high definition with clear picture and excellent sound quality. Our platform is optimized to deliver smooth playback that does justice to the content creators' vision.",
        "Smart adaptive streaming adjusts video quality based on your internet connection, maintaining smooth playback while maximizing picture clarity. Multiple server options ensure you always have alternatives if one is experiencing issues, guaranteeing reliable access to your chosen entertainment."
      ]
    },
    {
      title: "Free and Always Accessible",
      paragraphs: [
        "Lookmovie is completely free now and will remain free forever. No premium memberships, no subscription tiers, no hidden costs. Every movie and show you see is available to watch immediately without spending anything. We believe in making entertainment accessible to all, regardless of financial circumstances.",
        "Access Lookmovie from any device – smartphone, tablet, laptop, or desktop. The responsive design works flawlessly across all screen sizes and operating systems. No apps to install means you can start streaming immediately from any device with a web browser and internet connection."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#a855f7',      // Purple-500
  secondary: '#c084fc',    // Purple-400
  accent: '#9333ea',       // Purple-600
  buttonBg: '#a855f7',
  buttonHover: '#9333ea',
  searchBorder: '#a855f7',
  searchFocus: '#9333ea',
  cardHover: '#a855f7',
  playButton: '#a855f7',
  textAccent: '#a855f7'
};

export default function LookmoviePage() {
  return (
    <LookmovieStyleLanding
      keyword="Lookmovie"
      description="Look and Stream - Entertainment Made Easy"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

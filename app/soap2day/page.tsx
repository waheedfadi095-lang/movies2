import Soap2dayStyleLanding from "../components/keyword-landings/Soap2dayStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/soap2day`;
  return {
    title: "Soap2Day - Watch Free Movies Online in HD Quality",
    description: "Soap2Day provides instant access to thousands of movies and shows in stunning HD quality. Stream your favorite content without registration or fees.",
    keywords: "soap2day, free streaming, HD movies, watch online, tv series streaming, no registration",
    alternates: { canonical: url },
    openGraph: {
      title: "Soap2Day - Watch Free Movies Online in HD Quality",
      description: "Soap2Day provides instant access to thousands of movies and shows in stunning HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Soap2Day - Watch Movies and TV Shows Free Online",
  intro: [
    "Soap2Day brings you an incredible selection of movies and TV series, all available to stream for free. No sign-up hassles, no payment required – just pure entertainment at your fingertips. Our easy-to-use platform makes finding and watching your favorite content effortless.",
    "Join millions of viewers who choose Soap2Day for their daily entertainment fix. Whether you're looking for the newest movie releases or want to catch up on trending TV series, we've got you covered with high-quality streams and a constantly updated library."
  ],
  sections: [
    {
      title: "What Makes Soap2Day Special",
      paragraphs: [
        "Soap2Day has earned its reputation as a trusted streaming destination through consistent quality and reliability. Our platform offers instant access to thousands of movies and shows without requiring account creation. Simply browse, click, and enjoy – it's that straightforward.",
        "We pride ourselves on maintaining an extensive, well-organized library that caters to all tastes. From action-packed blockbusters to heartwarming dramas, from comedy series to documentary specials, Soap2Day delivers variety that keeps viewers coming back daily."
      ]
    },
    {
      title: "Watch Anywhere, Anytime",
      paragraphs: [
        "Soap2Day works perfectly across all your devices. Whether you're on your phone during a commute, relaxing with a tablet, or enjoying the big screen experience on your laptop, our responsive platform adapts seamlessly. No apps to download, no complicated setup required.",
        "The intuitive interface makes navigation a breeze even for first-time users. Search for specific titles, browse by category, or explore what's trending. Our clean design puts content front and center, eliminating distractions and making your viewing experience smooth and enjoyable."
      ]
    },
    {
      title: "High-Quality Streaming",
      paragraphs: [
        "Enjoy your favorite movies and shows in crisp, clear quality. Soap2Day optimizes streaming to deliver the best possible viewing experience based on your internet connection. Our servers are designed to minimize buffering and provide consistent playback quality.",
        "Multiple streaming links ensure you always have options if one server is busy or slow. The smart player technology adjusts video quality automatically, balancing picture clarity with smooth playback to prevent interruptions during your favorite scenes."
      ]
    },
    {
      title: "Always Free, Always Updated",
      paragraphs: [
        "Soap2Day remains committed to providing free entertainment for everyone. No subscriptions, no trials, no hidden fees – ever. Our mission is to make quality content accessible to all viewers regardless of their financial situation.",
        "Fresh content arrives regularly as we continuously expand our library. New movie releases, latest TV episodes, and classic titles are added frequently. Check back often to discover new additions and never miss out on trending entertainment."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#10b981',      // Green
  secondary: '#14b8a6',    // Teal
  accent: '#059669',       // Emerald
  buttonBg: '#10b981',
  buttonHover: '#059669',
  searchBorder: '#10b981',
  searchFocus: '#059669',
  cardHover: '#10b981',
  playButton: '#10b981',
  textAccent: '#10b981'
};

export default function Soap2DayPage() {
  return (
    <Soap2dayStyleLanding
      keyword="Soap2Day"
      description="Instant Access to Premium Entertainment"
      colorTheme={colorTheme}
      content={content}
    />
  );
}


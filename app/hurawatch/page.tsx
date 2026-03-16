import LandingVariant4 from "../components/LandingVariant4";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/hurawatch`;
  return {
    title: "Hurawatch - Watch Movies Online Free in HD 1080p",
    description: "Hurawatch offers premium movie streaming with HD quality. Access thousands of movies and TV shows instantly without any subscription or registration.",
    keywords: "hurawatch, HD movies, 1080p streaming, free movies, watch online, premium streaming",
    alternates: { canonical: url },
    openGraph: {
      title: "Hurawatch - Watch Movies Online Free in HD 1080p",
      description: "Hurawatch offers premium movie streaming with HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Hurawatch - Stream HD Movies and Series Online Free",
  intro: [
    "Hurawatch brings you premium streaming quality without the premium price tag. Watch thousands of movies and TV shows in stunning HD resolution, all completely free. Our platform is designed for viewers who demand quality and convenience without compromises.",
    "No account creation needed, no subscription fees to worry about. Hurawatch provides instant access to a vast entertainment library that's updated daily. From the latest blockbusters to beloved classics, find everything you want to watch in one convenient place."
  ],
  sections: [
    {
      title: "Premium HD Streaming Experience",
      paragraphs: [
        "Hurawatch specializes in delivering high-definition content that showcases movies and shows exactly as directors intended. Watch in crisp 1080p resolution with excellent audio quality that immerses you in every scene. Our commitment to quality means you never have to settle for poor picture or sound.",
        "Advanced streaming infrastructure ensures fast loading and smooth playback. Our servers are optimized to deliver consistent HD quality even during peak viewing times. Experience cinema-level quality from the comfort of your home, without the expensive theater tickets."
      ]
    },
    {
      title: "Massive Entertainment Library",
      paragraphs: [
        "Explore thousands of titles across every genre imaginable. Hurawatch's extensive catalog includes the latest theatrical releases, trending TV series, timeless classics, and hidden gems waiting to be discovered. Whether you're a casual viewer or a dedicated cinephile, our library has something special for you.",
        "Regular updates mean fresh content arrives daily. New movie releases, latest TV episodes, and recently added classics keep the selection exciting and current. Use our intuitive search and filter tools to quickly find exactly what you're in the mood to watch."
      ]
    },
    {
      title: "Simple, Fast, and Free",
      paragraphs: [
        "Hurawatch eliminates all the barriers between you and great entertainment. No registration forms, no email verification, no payment information required. Simply visit the site, find your content, and start streaming within seconds. It's entertainment made easy.",
        "Our clean, intuitive interface makes navigation effortless. Browse by genre, search for specific titles, or explore what's trending. The streamlined design puts focus on content discovery and watching, removing all unnecessary clutter and complications."
      ]
    },
    {
      title: "Watch Anytime, Anywhere",
      paragraphs: [
        "Hurawatch works perfectly on all your devices. Stream on smartphones, tablets, laptops, or desktop computers without any limitations. Our responsive platform adapts seamlessly to different screen sizes, ensuring optimal viewing experience regardless of your device.",
        "No downloads or installations needed – Hurawatch runs directly in your browser. This means you can start watching immediately on any device with internet access. Enjoy your favorite movies and shows at home, on the go, or anywhere in between."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#06b6d4',      // Cyan
  secondary: '#0891b2',    // Cyan-600
  accent: '#0e7490',       // Cyan-700
  buttonBg: '#06b6d4',
  buttonHover: '#0891b2',
  searchBorder: '#06b6d4',
  searchFocus: '#0891b2',
  cardHover: '#06b6d4',
  playButton: '#06b6d4',
  textAccent: '#06b6d4'
};

export default function HurawatchPage() {
  return (
    <LandingVariant4
      keyword="Hurawatch"
      description="Free HD Streaming Without Limits"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

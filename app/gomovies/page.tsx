import GomoviesStyleLanding from "../components/keyword-landings/GomoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/gomovies`;
  return {
    title: "Gomovies - Stream Latest Movies and Series Free Online",
    description: "Gomovies brings you the latest movies and TV series in crystal clear HD. No ads interruptions, no sign-up required. Just pure entertainment.",
    keywords: "gomovies, stream movies free, latest movies, HD series, free tv shows, online cinema",
    alternates: { canonical: url },
    openGraph: {
      title: "Gomovies - Stream Latest Movies and Series Free Online",
      description: "Gomovies brings you the latest movies and TV series in crystal clear HD.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Gomovies - Free Movie and TV Series Streaming",
  intro: [
    "Welcome to Gomovies, your go-to destination for streaming the latest movies and TV shows online. Our extensive collection features everything from new releases to all-time favorites, all available to watch instantly without any cost. No registration barriers, no premium memberships – just click and enjoy.",
    "Experience seamless streaming with our user-friendly platform. Whether you're in the mood for action, comedy, drama, or anything in between, Gomovies has thousands of titles ready to watch. Updated regularly with fresh content, you'll always find something new and exciting to stream."
  ],
  sections: [
    {
      title: "Free Streaming for Everyone",
      paragraphs: [
        "Gomovies is built on the principle that great entertainment should be accessible to all. That's why everything on our platform is completely free. No hidden charges, no subscription plans, no payment details required. Simply visit, search, and start watching your chosen movie or series instantly.",
        "Unlike other platforms that bombard you with ads or force you to create accounts, Gomovies keeps things simple and straightforward. We respect your time and privacy, providing direct access to content without unnecessary obstacles or registration forms to fill out."
      ]
    },
    {
      title: "Huge Selection of Movies and Shows",
      paragraphs: [
        "Dive into our massive library containing thousands of movies across all genres. Action enthusiasts will find explosive blockbusters, horror fans can enjoy spine-chilling thrillers, and rom-com lovers have endless options for feel-good entertainment. From Hollywood hits to international cinema, Gomovies covers it all.",
        "TV series fans are equally well-served with complete seasons of popular shows. Binge-watch entire series over the weekend or catch up on episodes you missed. Our collection includes everything from classic sitcoms to the latest trending drama series, ensuring there's always something perfect for your mood."
      ]
    },
    {
      title: "HD Quality Streaming",
      paragraphs: [
        "Quality matters when it comes to enjoying movies and shows. Gomovies delivers high-definition streaming that brings out the best in every scene. Watch with crystal-clear picture quality and excellent sound, making you feel like you're right in the action.",
        "Our adaptive streaming technology ensures smooth playback regardless of your internet speed. The platform automatically optimizes video quality for your connection, preventing annoying buffering while maintaining the best possible viewing experience. Multiple server options provide alternatives if needed."
      ]
    },
    {
      title: "Watch on Any Device",
      paragraphs: [
        "Gomovies works flawlessly across all your devices. Stream on your smartphone while traveling, watch on your tablet from the comfort of your bed, or enjoy the big-screen experience on your laptop or desktop. Our responsive design adapts perfectly to any screen size.",
        "No special apps or software required – Gomovies runs directly in your web browser. This means you can start watching within seconds on any device with internet access. The same great experience is available whether you're on Windows, Mac, Android, or iOS."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#ef4444',      // Red
  secondary: '#f97316',    // Orange
  accent: '#dc2626',       // Red-600
  buttonBg: '#ef4444',
  buttonHover: '#dc2626',
  searchBorder: '#ef4444',
  searchFocus: '#dc2626',
  cardHover: '#ef4444',
  playButton: '#ef4444',
  textAccent: '#ef4444'
};

export default function GomoviesPage() {
  return (
    <GomoviesStyleLanding
      keyword="Gomovies"
      description="Watch Free Movies and TV Shows in HD"
      colorTheme={colorTheme}
      content={content}
    />
  );
}

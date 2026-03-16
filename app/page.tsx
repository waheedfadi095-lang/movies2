import SimpleLandingPage from "./components/SimpleLandingPage";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  return { alternates: { canonical: base } };
}

export default function Home() {
  return <SimpleLandingPage />;
}
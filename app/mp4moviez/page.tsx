import OfficialBrandStyleLanding from "@/components/keyword-landings/OfficialBrandStyleLanding";
import { extendedLandings } from "@/data/extendedKeywordLandings";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

const slug = "mp4moviez" as const;

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const cfg = extendedLandings[slug];
  const url = `${base}/${slug}`;
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    keywords: cfg.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      type: "website",
      url,
    },
  };
}

export default function Mp4moviezPage() {
  const cfg = extendedLandings[slug];
  return (
    <OfficialBrandStyleLanding
      preset={cfg.preset}
      keyword={cfg.keyword}
      description={cfg.description}
      colorTheme={cfg.colorTheme}
      content={cfg.content}
    />
  );
}

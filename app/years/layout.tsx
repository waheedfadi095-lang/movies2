import { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  return { alternates: { canonical: `${base}/years` } };
}

export default function YearsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

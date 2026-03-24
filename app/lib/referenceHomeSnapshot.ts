import snapshot from "@/data/referenceHomeSnapshot.json";

export type RefMovie = {
  title: string;
  href: string;
  poster: string | null;
  badge: string | null;
};

export type RefHomePayload = {
  source: string;
  fetchedAt: string;
  suggestions: RefMovie[];
  latestMovies: RefMovie[];
  latestTvSeries: RefMovie[];
};

export function getReferenceHomeSnapshot(): RefHomePayload {
  return snapshot as RefHomePayload;
}


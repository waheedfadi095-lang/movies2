import Link from "next/link";
import Image from "next/image";
import { getAllProcessedMovies } from "@/lib/moviesDataServer";
import { generateMovieUrl } from "@/lib/slug";
import { resolvePosterUrl } from "@/lib/poster";

type Props = {
  count?: number;
  /** Outer wrapper (default: centered + top margin + max width) */
  className?: string;
  /** e.g. "grid grid-cols-2 gap-3 sm:grid-cols-4" */
  gridClassName?: string;
};

const defaultWrap = "mx-auto mt-10 max-w-3xl";

/**
 * Real movie posters from local catalog — replaces empty gradient placeholders on landings.
 */
export default async function LandingMovieThumbnails({
  count = 8,
  className,
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-4",
}: Props) {
  const wrapClass = className ?? defaultWrap;
  const all = getAllProcessedMovies();
  const picks = all.filter((m) => m.poster_path && m.imdb_id).slice(0, count);

  if (picks.length === 0) {
    return (
      <div className={wrapClass}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Link
            href="/movies"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Latest movies
          </Link>
          <Link
            href="/series"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            TV series
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Search
          </Link>
          <Link
            href="/genres"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Genres
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">Browse the catalog — posters load when movie data is available.</p>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className={gridClassName}>
        {picks.map((m) => (
          <Link
            key={m.imdb_id}
            href={generateMovieUrl(m.title, m.imdb_id)}
            className="group block overflow-hidden rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/5 transition hover:ring-violet-400/60"
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={resolvePosterUrl(m.poster_path, "w300")}
                alt={m.title}
                fill
                className="object-cover transition group-hover:opacity-95"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <p className="line-clamp-2 px-1.5 py-1.5 text-center text-[11px] font-medium leading-tight text-neutral-800 group-hover:text-violet-700">
              {m.title}
              {m.year ? <span className="text-neutral-500"> ({m.year})</span> : null}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTVImageUrl } from "@/api/tmdb-tv";

type SeriesItem = {
  imdb_id: string;
  tmdb_id?: number;
  name: string;
  poster_path?: string;
  first_air_date?: string;
  vote_average?: number;
  number_of_seasons?: number;
  seasons?: Array<{ episodes?: any[] }>;
};

function createSeriesSlug(name: string, id: string | number) {
  const slug = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}-${id}`;
}

export default function AllTVSeriesClient() {
  const [items, setItems] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 28;

  const fetchPage = async (skip: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const response = await fetch(
        `/api/tv-series-db?limit=${LIMIT}&skip=${skip}&sortBy=first_air_date&sortOrder=desc&enrich=1`
      );
      const result = await response.json();
      if (response.ok && result.success && Array.isArray(result.data)) {
        const totalCount = Number(result.total || 0);
        setItems((prev) => (append ? [...prev, ...result.data] : result.data));
        setTotal(totalCount);
        setHasMore(
          Boolean(
            result.hasMore ??
              (append ? skip + result.data.length < totalCount : result.data.length < totalCount)
          )
        );
      }
    } catch (e) {
      console.error("AllTVSeriesClient fetch failed:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(0, false);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-pulse">📺</div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading TV Series...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((series, index) => {
          const id = series.tmdb_id || series.imdb_id || `idx-${index}`;
          const epCount =
            series.number_of_episodes ||
            series.seasons?.reduce((sum: number, season: any) => sum + (season?.episodes?.length || 0), 0) || 0;
          return (
            <Link key={`${id}-${index}`} href={`/${createSeriesSlug(series.name, id)}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                <div className="relative aspect-[2/3] bg-gray-700">
                  <Image
                    src={getTVImageUrl(series.poster_path, "w500")}
                    alt={series.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {epCount} eps
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-400 transition-colors">
                    {series.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{series.first_air_date?.split("-")[0] || "N/A"}</span>
                    <span>⭐ {series.vote_average ? series.vote_average.toFixed(1) : "N/A"}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm mb-3">
          Showing {items.length} of {total.toLocaleString()} series
        </p>
        {hasMore && (
          <button
            onClick={() => fetchPage(items.length, true)}
            disabled={loadingMore}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            {loadingMore ? "Loading..." : `Load More (${Math.max(0, total - items.length)} remaining)`}
          </button>
        )}
      </div>
    </>
  );
}


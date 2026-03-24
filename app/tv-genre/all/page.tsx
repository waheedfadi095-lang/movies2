import Link from "next/link";
import type { Metadata } from 'next';
import { getTvSeriesCount } from "@/lib/tvSeriesStore";
import AllTVSeriesClient from "./AllTVSeriesClient";

export const metadata: Metadata = {
  title: 'All TV Series - Browse Complete Collection',
  description: 'Browse our complete collection of TV series and shows online.',
};

export default async function AllTVSeriesPage() {
  const totalSeries = getTvSeriesCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/series" className="text-purple-400 hover:text-purple-300">
              ← Back to Featured Series
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">All TV Series</h1>
          <p className="text-gray-400">Complete collection of {totalSeries.toLocaleString()} TV shows</p>
          <p className="text-yellow-400 text-sm mt-2">Latest-first ordering • paginated loading</p>
        </div>

        <AllTVSeriesClient />

        {/* Footer Info */}
        <div className="text-center mt-12 py-8 border-t border-gray-700">
          <p className="text-gray-400">
            🎉 Complete collection available: {totalSeries.toLocaleString()} TV series.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Use TV Genres menu for faster browsing by category
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getYear } from "@/api/tmdb";
import type { Movie } from "@/api/tmdb";
import { generateMovieUrl } from "@/lib/slug";
import { resolvePosterUrl } from "@/lib/poster";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchType?: 'movies' | 'tv'; // Allow parent to set search type
}

export default function SearchModal({ isOpen, onClose, searchType = 'movies' }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const LIMIT = 8;

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSuggestions([]);
      setPage(1);
      setTotal(0);
      setPages(0);
      setHasMore(false);
    }
  }, [isOpen]);

  const fetchSuggestions = async (targetPage: number, append: boolean) => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setTotal(0);
      setPages(0);
      setHasMore(false);
      return;
    }

    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      if (searchType === "tv") {
        const response = await fetch(
          `/api/tv-series-search?q=${encodeURIComponent(searchTerm)}&page=${targetPage}&limit=${LIMIT}&enrich=1`
        );
        const result = await response.json();
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        setSuggestions((prev) => (append ? [...prev, ...list] : list));
        const p = result.pagination || {};
        setPage(p.page || targetPage);
        setTotal(p.total || list.length);
        setPages(p.pages || 1);
        setHasMore(Boolean(p.hasMore));
      } else {
        const response = await fetch(
          `/api/tmdb-search-movies?q=${encodeURIComponent(searchTerm)}&page=${targetPage}&limit=${LIMIT}`
        );
        const result = await response.json();
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        setSuggestions((prev) => (append ? [...prev, ...list] : list));
        const p = result.pagination || {};
        setPage(p.page || targetPage);
        setTotal(p.total || list.length);
        setPages(p.pages || 1);
        setHasMore(Boolean(p.hasMore));
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (!append) setSuggestions([]);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(1, false);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If in TV mode, redirect to series page or show first result
      // If in movies mode, redirect to movies search page
      if (searchType === 'tv') {
        // For TV mode, if there are suggestions, go to first one
        // Otherwise stay on current page (user can click suggestions)
        if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        }
      } else {
        // For movies mode, go to search page
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        onClose();
      }
    }
  };

  const handleSuggestionClick = (item: any) => {
    if (searchType === 'tv') {
      // Navigate to series page with clean URL
      const seriesSlug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${item.tmdb_id || item.imdb_id}`;
      router.push(`/${seriesSlug}`);
    } else {
      // Navigate to movie page
      router.push(generateMovieUrl(item.title, item.imdb_id || ''));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSearch} className="bg-gray-900 px-4 pt-5 pb-4 sm:p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchType === 'tv' ? 'Search TV Series' : 'Search Movies'}
              </h3>
              <p className="text-gray-400">
                {searchType === 'tv' ? 'Find your favorite TV series in our collection' : 'Find your favorite movies in our collection'}
              </p>
            </div>
            
            {/* Search input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder={searchType === 'tv' ? 'Enter TV series name...' : 'Enter movie title...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Live Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-purple-400 font-semibold mb-3">💡 Suggestions:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <button
                      key={`${item.imdb_id || item.tmdb_id}-${index}`}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <div className="relative w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={resolvePosterUrl(item.poster_path, "w500")}
                          alt={item.title || item.name}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-medium truncate">{item.title || item.name}</h5>
                        <p className="text-gray-400 text-sm">
                          {searchType === 'tv' 
                            ? (item.first_air_date ? getYear(item.first_air_date) : 'N/A')
                            : getYear(item.release_date)
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-gray-400 text-xs">
                          {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Showing {suggestions.length} of {total}
                  </span>
                  {hasMore && (
                    <button
                      onClick={() => fetchSuggestions(page + 1, true)}
                      disabled={loadingMore}
                      className="rounded bg-purple-600 px-3 py-1 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : `Load More (${page + 1}/${Math.max(1, pages)})`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Search tips */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
              <h4 className="text-purple-400 font-semibold mb-2">💡 Search Tips:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {searchType === 'tv' ? (
                  <>
                    <li>• Use TV series names (e.g., &quot;Breaking Bad&quot;)</li>
                    <li>• Try partial names (e.g., &quot;Game of&quot;)</li>
                    <li>• Search by genre (e.g., &quot;Comedy&quot;)</li>
                    <li>• Use show year (e.g., &quot;2020&quot;)</li>
                  </>
                ) : (
                  <>
                    <li>• Use movie titles (e.g., &quot;The Godfather&quot;)</li>
                    <li>• Try partial names (e.g., &quot;Batman&quot;)</li>
                    <li>• Search by year (e.g., &quot;2023&quot;)</li>
                    <li>• Use actor names (e.g., &quot;Tom Hanks&quot;)</li>
                  </>
                )}
              </ul>
            </div>
          </form>

          {/* Modal footer */}
          <div className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              {searchType === 'tv' ? 'Search TV Series' : 'Search Movies'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import clientPromise from '@/lib/mongodb-client';
import EmbedPlayer from '@/components/EmbedPlayer';
import { getEmbedServers } from '@/lib/embed-config';
import { getSeasonEpisodes, getTVSeriesById } from '@/api/tmdb-tv';
import { extractEpisodeIdFromSlug, extractTmdbEpisodeFromSlug } from '@/lib/episode-slug';
import type { Metadata } from 'next';
import { getCanonicalBase } from '@/lib/domain';

export async function getEpisodeData(slug: string) {
  const episodeId = extractEpisodeIdFromSlug(slug);
  const tmdbParams = extractTmdbEpisodeFromSlug(slug);

  let episode: {
    episode_imdb_id: string;
    episode_name: string;
    season_number: number;
    episode_number: number;
    still_path?: string | null;
    overview?: string;
    air_date?: string;
    vote_average?: number;
    runtime?: number;
    series_imdb_id?: string;
  } | null = null;
  let series: {
    name: string;
    tmdb_id?: number;
    poster_path?: string | null;
    genres?: any[];
    imdb_id?: string;
  } | null = null;

  if (episodeId) {
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db('moviesDB');
        const episodesCollection = db.collection('episodes');
        const seriesCollection = db.collection('tvSeries');
        const found = await episodesCollection.findOne({ episode_imdb_id: episodeId });
        if (found) {
          episode = {
            episode_imdb_id: found.episode_imdb_id,
            episode_name: found.episode_name,
            season_number: found.season_number,
            episode_number: found.episode_number,
            still_path: found.still_path,
            overview: found.overview,
            air_date: found.air_date,
            vote_average: found.vote_average,
            runtime: found.runtime,
            series_imdb_id: found.series_imdb_id,
          };
          const seriesDoc = await seriesCollection.findOne({ imdb_id: found.series_imdb_id });
          if (seriesDoc) {
            series = {
              name: seriesDoc.name,
              tmdb_id: seriesDoc.tmdb_id,
              poster_path: seriesDoc.poster_path,
              genres: seriesDoc.genres,
              imdb_id: seriesDoc.imdb_id,
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching episode data:', error);
    }
  }

  if (!episode && tmdbParams) {
    const list = await getSeasonEpisodes(tmdbParams.tmdbId, tmdbParams.season);
    const ep = list.find((e) => e.episode_number === tmdbParams.episode);
    if (ep) {
      episode = {
        episode_imdb_id: ep.imdb_id || `tmdb-${tmdbParams.tmdbId}-${tmdbParams.season}-${tmdbParams.episode}`,
        episode_name: ep.name,
        season_number: ep.season_number,
        episode_number: ep.episode_number,
        still_path: ep.still_path,
        overview: ep.overview,
        air_date: ep.air_date,
        vote_average: ep.vote_average,
        runtime: ep.runtime,
        series_imdb_id: ep.series_imdb_id,
      };
      const seriesDetails = await getTVSeriesById(tmdbParams.tmdbId);
      series = {
        name: ep.series_name,
        tmdb_id: ep.series_id,
        poster_path: seriesDetails?.poster_path ?? null,
        genres: seriesDetails?.genres ?? [],
        imdb_id: seriesDetails?.imdb_id ?? ep.series_imdb_id,
      };
    }
  }

  return { episode, series };
}

export async function getEpisodeMetadata(slug: string): Promise<Metadata> {
  const episodeId = extractEpisodeIdFromSlug(slug);
  const tmdbParams = extractTmdbEpisodeFromSlug(slug);
  let episodeTitle = 'Episode Not Found';
  let episodeDescription = 'The requested episode could not be found.';

  if (episodeId) {
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db('moviesDB');
        const episodesCollection = db.collection('episodes');
        const seriesCollection = db.collection('tvSeries');
        const episode = await episodesCollection.findOne({ episode_imdb_id: episodeId });
        if (episode) {
          const series = await seriesCollection.findOne({ imdb_id: episode.series_imdb_id });
          episodeTitle = `${episode.episode_name} - ${series?.name || 'TV Series'} S${episode.season_number}E${episode.episode_number}`;
          episodeDescription = episode.overview || `Watch ${episode.episode_name} from ${series?.name || 'TV Series'} Season ${episode.season_number}.`;
        }
      }
    } catch (_) {}
  }

  if (episodeTitle === 'Episode Not Found' && tmdbParams) {
    const list = await getSeasonEpisodes(tmdbParams.tmdbId, tmdbParams.season);
    const ep = list.find((e) => e.episode_number === tmdbParams.episode);
    if (ep) {
      episodeTitle = `${ep.name} - ${ep.series_name} S${ep.season_number}E${ep.episode_number}`;
      episodeDescription = ep.overview || `Watch ${ep.name} from ${ep.series_name} Season ${ep.season_number}.`;
    }
  }

  const baseUrl = await getCanonicalBase();
  return {
    title: episodeTitle,
    description: episodeDescription,
    alternates: { canonical: `${baseUrl}/${slug}` },
    openGraph: {
      title: episodeTitle,
      description: episodeDescription,
      url: `${baseUrl}/${slug}`,
      type: 'video.episode',
      siteName: '123Movies',
    },
    twitter: {
      card: 'summary_large_image',
      title: episodeTitle,
      description: episodeDescription,
    },
  };
}

export default async function EpisodePageContent({ slug }: { slug: string }) {
  const { episode, series } = await getEpisodeData(slug);
  if (!episode) notFound();

  const seriesSlug = series ? `${series.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${series.tmdb_id}` : '';
  const embedServersList = await getEmbedServers();
  const tmdbId = series?.tmdb_id ?? 0;
  const embedServers = embedServersList.map((server) => ({
    name: server.name,
    url: server.getTvUrl(tmdbId, episode.season_number, episode.episode_number, episode.series_imdb_id),
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-3/4 space-y-4">
            <EmbedPlayer
              servers={embedServers}
              title={`${episode.episode_name} - ${series?.name || 'TV Series'} S${episode.season_number}E${episode.episode_number}`}
            />
            <div className="bg-gray-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-32 md:w-48">
                    <Image
                      src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : (series?.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : '/placeholder.svg')}
                      alt={`${episode.episode_name} episode still`}
                      width={192}
                      height={288}
                      className="rounded-lg w-full h-auto"
                    />
                    <Link
                      href={`/${seriesSlug}/season-${episode.season_number}`}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-center block transition-colors"
                    >
                      Back to Season
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-black mb-3">
                    {episode.episode_number}. {episode.episode_name}
                  </h1>
                  {series && (
                    <h2 className="text-lg text-gray-700 mb-3">
                      {series.name} • Season {episode.season_number}
                    </h2>
                  )}
                  {episode.overview && (
                    <p className="text-black italic mb-4 leading-relaxed">{episode.overview}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex">
                      <span className="font-bold text-black w-20">Genre:</span>
                      <span className="text-green-500 ml-2">
                        {series?.genres?.slice(0, 3).map((genre: any, index: number) =>
                          `${typeof genre === 'object' ? genre.name : genre}${index < Math.min(series?.genres?.length || 0, 3) - 1 ? ', ' : ''}`
                        ).join('') || 'TV Series'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold text-black w-20">Duration:</span>
                      <span className="text-green-500 ml-2">
                        {episode.runtime ? `${Math.floor(episode.runtime / 60)}h ${episode.runtime % 60}m` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold text-black w-20">Aired:</span>
                      <span className="text-green-500 ml-2">
                        {episode.air_date ? new Date(episode.air_date).getFullYear().toString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-bold text-black w-20">Episode:</span>
                      <span className="text-green-500 ml-2">S{episode.season_number}E{episode.episode_number}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/" className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-center block transition-colors">
                      Trailer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-black mb-4">Related Episodes</h3>
              <div className="space-y-3">
                <Link href={`/${seriesSlug}/season-${episode.season_number}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                  <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden">
                    <Image
                      src={series?.poster_path ? `https://image.tmdb.org/t/p/w300${series.poster_path}` : '/placeholder.svg'}
                      alt={`Season ${episode.season_number}`}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-black line-clamp-2">Season {episode.season_number} Episodes</h4>
                  </div>
                </Link>
                {series && (
                  <Link href={`/${seriesSlug}`} className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="w-16 h-20 rounded flex-shrink-0 overflow-hidden">
                      <Image
                        src={series.poster_path ? `https://image.tmdb.org/t/p/w300${series.poster_path}` : '/placeholder.svg'}
                        alt={series.name}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-black line-clamp-2">{series.name}</h4>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

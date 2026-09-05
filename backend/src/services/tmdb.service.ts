import { withCache } from "./cache.service.js";

const TMDB_BASE_URL = "https://api.tmdb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";

const DISCOVER_CACHE_TTL_MS = 10 * 60 * 1000;
const DETAILS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const DISCOVER_MAX_PAGE = 10;
const DISCOVER_MAX_ATTEMPTS = 3;

export interface TmdbCandidate {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  vote_average: number;
  release_date: string;
  runtime: number;
}

interface TmdbDiscoverResponseItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TmdbDiscoverResponse {
  page: number;
  results: TmdbDiscoverResponseItem[];
  total_pages: number;
}

async function fetchDiscoverPage(options: {
  genreId?: number;
  minVoteAverage: number;
  minVoteCount: number;
  page: number;
  region?: string;
  language?: string;
}): Promise<TmdbDiscoverResponseItem[]> {
  const { genreId, minVoteAverage, minVoteCount, page, region, language } = options;

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    sort_by: "popularity.desc",
    "vote_average.gte": String(minVoteAverage),
    "vote_count.gte": String(minVoteCount),
    include_adult: "false",
    page: String(page),
  });

  if (genreId) {
    params.append("with_genres", String(genreId));
  }
  if (region) {
    params.append("region", region);
  }
  if (language) {
    params.append("language", language);
  }

  const cacheKey = `discover:${params.toString()}`;

  return withCache(cacheKey, DISCOVER_CACHE_TTL_MS, async () => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`);

    if (!res.ok) {
      throw new Error(`TMDB discover failed: ${res.statusText}`);
    }

    const data = (await res.json()) as TmdbDiscoverResponse;
    return data.results;
  });
}

export async function discoverMovies(options: {
  genreId?: number;
  minVoteAverage?: number;
  minVoteCount?: number;
  poolSize: number;
  excludeIds?: ReadonlySet<number>;
  region?: string;
  language?: string;
}): Promise<TmdbCandidate[]> {
  const {
    genreId,
    minVoteAverage = 6,
    minVoteCount = 100,
    poolSize,
    excludeIds,
    region,
    language,
  } = options;

  const startPage = Math.floor(Math.random() * DISCOVER_MAX_PAGE) + 1;
  const candidates: TmdbCandidate[] = [];
  const seen = new Set<number>();

  for (
    let attempt = 0;
    attempt < DISCOVER_MAX_ATTEMPTS && candidates.length < poolSize;
    attempt++
  ) {
    const page = ((startPage - 1 + attempt) % DISCOVER_MAX_PAGE) + 1;
    const results = await fetchDiscoverPage({
      genreId,
      minVoteAverage,
      minVoteCount,
      page,
      region,
      language,
    });

    for (const movie of results) {
      if (seen.has(movie.id) || excludeIds?.has(movie.id)) {
        continue;
      }
      seen.add(movie.id);
      candidates.push({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
      });
      if (candidates.length >= poolSize) {
        break;
      }
    }
  }

  return candidates;
}

export async function getMovieDetails(
  movieId: number,
  language?: string,
): Promise<TmdbMovieDetails> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  if (language) {
    params.append("language", language);
  }

  const cacheKey = `details:${movieId}:${language ?? "default"}`;

  return withCache(cacheKey, DETAILS_CACHE_TTL_MS, async () => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?${params}`);

    if (!res.ok) {
      throw new Error(`TMDB movie details fetch failed: ${res.statusText}`);
    }

    return (await res.json()) as TmdbMovieDetails;
  });
}

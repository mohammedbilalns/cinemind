const TMDB_BASE_URL = "https://api.tmdb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";

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

export async function discoverMovies(options: {
  genreId?: number;
  minVoteAverage?: number;
  minVoteCount?: number;
  poolSize: number;
}): Promise<TmdbCandidate[]> {
  const { genreId, minVoteAverage = 6, minVoteCount = 100, poolSize } = options;

  const maxPage = 10;
  const page = Math.floor(Math.random() * maxPage) + 1;

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

  const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`);

  if (!res.ok) {
    throw new Error(`TMDB discover failed: ${res.statusText}`);
  }

  const data = (await res.json()) as TmdbDiscoverResponse;

  return data.results.slice(0, poolSize).map((movie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  }));
}

export async function getMovieDetails(
  movieId: number,
): Promise<TmdbMovieDetails> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?${params}`
  );

  if (!res.ok) {
    throw new Error(`TMDB movie details fetch failed: ${res.statusText}`);
  }

  return (await res.json()) as TmdbMovieDetails;
}

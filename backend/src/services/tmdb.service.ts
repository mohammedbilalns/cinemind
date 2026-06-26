const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";

export interface Recommendation {
  title: string;
  releaseYear: number;
  reason: string;
}

export async function searchMovie(
  title: string,
  year?: number,
) {
  const params = new URLSearchParams({
    query: title,
    api_key: TMDB_API_KEY,
  });

  if (year) {
    params.append("year", String(year));
  }

  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?${params}`
  );

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.results?.[0];
}

export async function getMovieDetails(
  movieId: number,
) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?${params}`
  );

  if (!res.ok) {
    throw new Error(`TMDB movie details fetch failed: ${res.statusText}`);
  }

  return res.json();
}

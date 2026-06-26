import { getMovieDetails, Recommendation, searchMovie } from "./tmdb.service.js";

export async function enrichRecommendation(
  recommendation: Recommendation,
) {
  const movie = await searchMovie(
    recommendation.title,
    recommendation.releaseYear,
  );

  if (!movie) {
    return null;
  }

  const details = await getMovieDetails(movie.id);

  return {
    tmdbId: details.id,
    title: details.title,
    overview: details.overview,
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    genres: details.genres,
    voteAverage: details.vote_average,
    releaseDate: details.release_date,
    runtime: details.runtime,
    reason: recommendation.reason,
  };
}

export async function enrichRecommendations(
  recommendations: Recommendation[],
) {
  const movies = await Promise.all(
    recommendations.map(enrichRecommendation),
  );

  return movies.filter(Boolean);
}

import { getMovieDetails } from "./tmdb.service.js";
import { Movie } from "../schemas/movie.schema.js";

export async function enrichRecommendation(
  recommendation: Movie,
) {
  const details = await getMovieDetails(recommendation.tmdbId);

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
  recommendations: Movie[],
) {
  const movies = await Promise.all(
    recommendations.map(enrichRecommendation),
  );

  return movies;
}

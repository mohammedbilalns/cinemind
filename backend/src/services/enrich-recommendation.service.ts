import { getMovieDetails } from "./tmdb.service.js";
import { Movie } from "../schemas/movie.schema.js";

export async function enrichRecommendation(
  recommendation: Movie,
  language?: string,
) {
  const details = await getMovieDetails(recommendation.tmdbId, language);

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
    originalLanguage: details.original_language,
    reason: recommendation.reason,
    director: details.credits?.crew.find(c => c.job === "Director")?.name || null,
    cast: details.credits?.cast.slice(0, 4).map(c => ({
      name: c.name,
      character: c.character,
      profilePath: c.profile_path
    })) || [],
  };
}

export async function enrichRecommendations(
  recommendations: Movie[],
  language?: string,
) {
  const movies = await Promise.all(
    recommendations.map((recommendation) => enrichRecommendation(recommendation, language)),
  );

  return movies;
}

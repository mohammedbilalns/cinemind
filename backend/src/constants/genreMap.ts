export const GENRE_TO_TMDB_ID: Record<string, number> = {
  action: 28,
  adventure: 12,
  comedy: 35,
  crime: 80,
  drama: 18,
  fantasy: 14,
  horror: 27,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
  western: 37,
};

export function resolveGenreId(genre: string): number | undefined {
  return GENRE_TO_TMDB_ID[genre.trim().toLowerCase()];
}

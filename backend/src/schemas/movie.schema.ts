import z from "zod";

export const LlmMovieSuggestionSchema = z.object({
  title: z.string().describe("The exact title of the recommended movie"),
  year: z.number().describe("The release year of the movie, to ensure we find the correct one"),
  reason: z.string().describe("Why this matches the user's mood and preferences"),
});

export const LlmRecommendationsSchema = z.object({
  movies: z.array(LlmMovieSuggestionSchema).describe("List of recommended movies")
});

export type LlmMovieSuggestion = z.infer<typeof LlmMovieSuggestionSchema>;

export const MovieSchema = z.object({
  tmdbId: z.number().describe("The tmdb id of the chosen movie"),
  reason: z.string().describe("Why this matches user's mood and preference"),
})

export const RecommendedMoviesSchema = z.object({
  movies : z.array(MovieSchema).describe("List of recommended movies")
})

export type Movie = z.infer<typeof MovieSchema>

export type RecomendedMovies = z.infer<typeof RecommendedMoviesSchema>

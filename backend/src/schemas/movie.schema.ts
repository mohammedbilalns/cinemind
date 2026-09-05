import z from "zod";

export const MovieSchema = z.object({
  tmdbId: z.number().describe("The id field of the chosen movie from the candidate list"),
  reason: z.string().describe("Why this matches user's mood and preference"),
})

export const RecommendedMoviesSchema = z.object({
  movies : z.array(MovieSchema).describe("List of recommended movies, chosen only from the given candidates")
})

export type Movie = z.infer<typeof MovieSchema>

export type RecomendedMovies = z.infer<typeof RecommendedMoviesSchema>

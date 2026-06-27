import z from "zod";

export const MovieSchema = z.object({
  title : z.string().describe("Movie title"),
  year: z.number().describe("Release year"),
  reason: z.string().describe("Why this matches user's mood and preference"),
})

export const RecommendedMoviesSchema = z.object({
  movies : z.array(MovieSchema).describe("List of recommended movies")
})

export type Movie = z.infer<typeof MovieSchema>

export type RecomendedMovies = z.infer<typeof RecommendedMoviesSchema>

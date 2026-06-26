import z from "zod";

export const MovieSchema = z.object({
  title : z.string().describe("Movie title"),
  year: z.number().describe("Release year"),
  // genre : z.array(z.string()).describe("List of genre"),
  // cast : z.array(z.string()).describe("List of cast"),
  reason: z.string().describe("Why this matches user's mood and preference"),
  //rating: z.number().min(1).max(10).describe("IMDB rating out of 10")
})

export const RecommendedMoviesSchema = z.object({
  movies : z.array(MovieSchema).describe("List of recommended movies")
})

export type Movie = z.infer<typeof MovieSchema>

export type RecomendedMovies = z.infer<typeof RecommendedMoviesSchema>

import { FastifyRequest, FastifyReply } from "fastify";
import { getStructuredRecommendations } from "../services/langchain.service.js";
import { enrichRecommendations } from "../services/enrich-recommendation.service.js";
import { RANDOM_CONTEXTS, RANDOM_GENRES, RANDOM_MOODS } from "../constants/randomOptions.js";
import { resolveGenreId } from "../constants/genreMap.js";
import { discoverMovies } from "../services/tmdb.service.js";

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function recommendedMovies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = request.body as {
      userPrompt?: string;
      genre?: string;
      mood?: string;
      count?: number;
    };

    const hasUserInput = body.userPrompt?.trim() || body.genre?.trim() || body.mood?.trim();

    let userPrompt: string;
    let genre: string;
    let mood: string;
    let isRandom = false;

    if (hasUserInput) {
      userPrompt = body.userPrompt?.trim() || "Suggest movie for a rainy night";
      genre = body.genre?.trim() || "thriller";
      mood = body.mood?.trim() || "relaxed";
    } else {
      userPrompt = getRandomElement(RANDOM_CONTEXTS);
      genre = getRandomElement(RANDOM_GENRES);
      mood = getRandomElement(RANDOM_MOODS);
      isRandom = true;
    }

    const count = body.count ?? 2;

    const candidates = await discoverMovies({
      genreId: resolveGenreId(genre),
      poolSize: Math.max(count * 4, 20),
    });

    const result = await getStructuredRecommendations({
      userPrompt,
      mood,
      count,
      candidates,
    });

    const candidateIds = new Set(candidates.map((c) => c.id));
    const seenIds = new Set<number>();
    const validPicks = result.movies.filter((movie) => {
      if (!candidateIds.has(movie.tmdbId) || seenIds.has(movie.tmdbId)) {
        return false;
      }
      seenIds.add(movie.tmdbId);
      return true;
    });

    const enrichedResult = await enrichRecommendations(validPicks);

    return { movies: enrichedResult, isRandom, randomContext: { userPrompt, genre, mood } };

  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      error: "Something went wrong"
    });
  }
}

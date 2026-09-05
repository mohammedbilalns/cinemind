import { FastifyRequest, FastifyReply } from "fastify";
import { getStructuredRecommendations } from "../services/langchain.service.js";
import { enrichRecommendations } from "../services/enrich-recommendation.service.js";
import { RANDOM_CONTEXTS, RANDOM_GENRES, RANDOM_MOODS } from "../constants/randomOptions.js";
import { resolveGenreId } from "../constants/genreMap.js";
import { discoverMovies, TmdbCandidate } from "../services/tmdb.service.js";
import { getShownMovieIds, recordShownMovieIds } from "../services/session-tracking.service.js";
import { Movie } from "../schemas/movie.schema.js";

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function backfillPicks(
  picks: Movie[],
  candidates: TmdbCandidate[],
  usedIds: Set<number>,
  count: number,
): Movie[] {
  if (picks.length >= count) {
    return picks;
  }

  const backfilled = [...picks];
  const ranked = candidates
    .filter((candidate) => !usedIds.has(candidate.id))
    .sort((a, b) => b.voteAverage - a.voteAverage);

  for (const candidate of ranked) {
    if (backfilled.length >= count) {
      break;
    }
    backfilled.push({
      tmdbId: candidate.id,
      reason: "A highly rated match for your preferences.",
    });
    usedIds.add(candidate.id);
  }

  return backfilled;
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
      sessionId?: string;
      region?: string;
      language?: string;
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
    const shownIds = getShownMovieIds(body.sessionId);

    const candidates = await discoverMovies({
      genreId: resolveGenreId(genre),
      poolSize: Math.max(count * 4, 20),
      excludeIds: shownIds,
      region: body.region,
      language: body.language,
    });

    const result = await getStructuredRecommendations({
      userPrompt,
      mood,
      count,
      candidates,
    });

    const candidateIds = new Set(candidates.map((c) => c.id));
    const usedIds = new Set<number>();
    const validPicks = result.movies.filter((movie) => {
      if (!candidateIds.has(movie.tmdbId) || usedIds.has(movie.tmdbId)) {
        return false;
      }
      usedIds.add(movie.tmdbId);
      return true;
    });

    const finalPicks = backfillPicks(validPicks, candidates, usedIds, count);

    const enrichedResult = await enrichRecommendations(finalPicks, body.language);

    recordShownMovieIds(body.sessionId, enrichedResult.map((movie) => movie.tmdbId));

    return { movies: enrichedResult, isRandom, randomContext: { userPrompt, genre, mood } };

  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      error: "Something went wrong"
    });
  }
}

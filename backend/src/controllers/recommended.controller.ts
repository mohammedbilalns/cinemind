import { FastifyRequest, FastifyReply } from "fastify";
import { getMovieSuggestions } from "../services/langchain.service.js";
import { enrichRecommendations } from "../services/enrich-recommendation.service.js";
import { RANDOM_CONTEXTS, RANDOM_GENRES, RANDOM_MOODS } from "../constants/randomOptions.js";
import { resolveGenreId } from "../constants/genreMap.js";
import { discoverMovies, searchMovie, TmdbCandidate } from "../services/tmdb.service.js";
import { getShownMovieIds, recordShownMovieIds } from "../services/session-tracking.service.js";
import { Movie } from "../schemas/movie.schema.js";
import { getLanguageLabel } from "../constants/languageMap.js";

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
      count?: number;
      sessionId?: string;
      language?: string[];
    };

    const hasUserInput = body.userPrompt?.trim();

    let userPrompt = "";
    let isRandom = false;

    if (hasUserInput) {
      userPrompt = body.userPrompt?.trim() || "";
    } else {
      userPrompt = getRandomElement(RANDOM_CONTEXTS);
      isRandom = true;
    }

    const count = body.count ?? 2;
    const shownIds = getShownMovieIds(body.sessionId);

    const fullPromptParts = [];
    if (userPrompt) fullPromptParts.push(`User Prompt: ${userPrompt}`);
    
    if (body.language && body.language.length > 0) {
      const labels = body.language.map(l => getLanguageLabel(l) || l).join(" OR ");
      fullPromptParts.push(`CRITICAL REQUIREMENT - Original Language: MUST be ONE OF the following: ${labels}`);
    }
    const fullPrompt = fullPromptParts.join('\n');

    const result = await getMovieSuggestions({
      userPrompt: fullPrompt,
      mood: "",
      count: count + 2, 
    });

    const validPicks: Movie[] = [];
    const usedIds = new Set<number>();

    // For TMDB search, we just pass the first language to localize the API response
    const uiLanguage = body.language && body.language.length > 0 ? body.language[0] : undefined;

    for (const suggestion of result.movies) {
      if (validPicks.length >= count) break;
      const movie = await searchMovie(suggestion.title, suggestion.year, uiLanguage);
      
      if (movie && !shownIds.has(movie.id) && !usedIds.has(movie.id)) {
        // Strict language filter to prevent LLM hallucinations from leaking through
        if (body.language && body.language.length > 0) {
          const requestedOriginalLanguages = body.language.map(l => l.split('-')[0]);
          if (!requestedOriginalLanguages.includes(movie.originalLanguage)) {
            continue; // Skip it, the LLM hallucinated a movie from another language
          }
        }

        usedIds.add(movie.id);
        validPicks.push({
          tmdbId: movie.id,
          reason: suggestion.reason,
        });
      }
    }

    let finalPicks = validPicks;
    if (finalPicks.length < count) {
      const candidates = await discoverMovies({
        poolSize: count * 2,
        excludeIds: shownIds,
        language: body.language,
      });
      finalPicks = backfillPicks(finalPicks, candidates, usedIds, count);
    }

    const enrichedResult = await enrichRecommendations(finalPicks, uiLanguage);

    recordShownMovieIds(body.sessionId, enrichedResult.map((movie) => movie.tmdbId));

    return { movies: enrichedResult, isRandom, randomContext: { userPrompt, genre: "", mood: "" } };

  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      error: "Something went wrong"
    });
  }
}

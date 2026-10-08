import {
  RecommendationRequest,
  RecommendationResponse,
  Movie,
  RandomContext,
  Genre
} from "@movie-recommendation/shared";

// Re-export types so existing imports still work
export type { Movie, RecommendationResponse, RecommendationRequest, RandomContext, Genre };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRecommendations(
  params: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_URL}/api/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userPrompt: params.userPrompt?.trim() || undefined,
      genre: params.genre || undefined,
      mood: params.mood || undefined,
      count: params.count || undefined,
      sessionId: params.sessionId || undefined,
      language: params.language || undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Something went wrong while fetching recommendations";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

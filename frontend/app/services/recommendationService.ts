export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genres: Genre[];
  voteAverage: number;
  releaseDate: string;
  runtime: number | null;
  reason: string;
}

export interface RecommendationResponse {
  movies: Movie[];
}

export interface RecommendationRequest {
  userPrompt?: string;
  genre?: string;
  mood?: string;
  count?: number;
}

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

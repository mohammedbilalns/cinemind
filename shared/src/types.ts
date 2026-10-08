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
  originalLanguage: string;
  director: string | null;
  cast: { name: string; character: string; profilePath: string | null; }[];
}

export interface RandomContext {
  userPrompt: string;
  genre: string;
  mood: string;
}

export interface RecommendationRequest {
  userPrompt?: string;
  genre?: string;
  mood?: string;
  count?: number;
  sessionId?: string;
  language?: string[];
}

export interface RecommendationResponse {
  movies: Movie[];
  isRandom?: boolean;
  randomContext?: RandomContext;
}

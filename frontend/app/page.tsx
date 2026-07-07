"use client";

import { useState } from "react";
import { getRecommendations, Movie, RecommendationResponse } from "./services/recommendationService";
import HeroSection from "./components/HeroSection";
import VibeCustomizer from "./components/VibeCustomizer";
import ResultsShowcase from "./components/ResultsShowcase";

export default function Home() {
const [userPrompt, setUserPrompt] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [count, setCount] = useState(3);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [randomContext, setRandomContext] = useState<RecommendationResponse["randomContext"]>(undefined);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasGenerated(true);
    setIsRandom(false);
    setRandomContext(undefined);
    try {
      const response = await getRecommendations({
        userPrompt: userPrompt || undefined,
        genre: selectedGenre || undefined,
        mood: selectedMood || undefined,
        count: count,
      });
      setMovies(response.movies || []);
      setIsRandom(response.isRandom || false);
      setRandomContext(response.randomContext);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        errorMessage ||
          "Could not connect to the recommendation engine. Please ensure the backend server is running."
      );
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserPrompt("");
    setSelectedGenre("");
    setSelectedMood("");
    setCount(3);
    setMovies([]);
    setError(null);
    setHasGenerated(false);
    setIsRandom(false);
    setRandomContext(undefined);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      {/* Hero Header Banner */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
        {/* Intro / Instruction Header */}
        <div className="mb-8 max-w-3xl animate-fade-in">
          <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            Personalized Movie Recommendations
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            AI-powered movie curation. Describe your current vibe, select a favorite genre or mood, and decide how many movies you want to get an instantly curated list of films matching your criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
          
          {/* Preferences Form Column (Left - 5 cols) */}
          <div className="lg:col-span-5">
            <VibeCustomizer
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              count={count}
              setCount={setCount}
              onSubmit={handleGenerate}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>

          {/* Results Showcase Column (Right - 7 cols) */}
          <div className="lg:col-span-7 flex-1 flex flex-col">
            <ResultsShowcase
              movies={movies}
              isLoading={isLoading}
              error={error}
              hasGenerated={hasGenerated}
              onRetry={handleGenerate}
              isRandom={isRandom}
              randomContext={randomContext}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

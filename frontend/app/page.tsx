"use client";

import { useState } from "react";
import { getRecommendations, Movie } from "./services/recommendationService";
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasGenerated(true);
    try {
      const response = await getRecommendations({
        userPrompt: userPrompt || undefined,
        genre: selectedGenre || undefined,
        mood: selectedMood || undefined,
        count: count,
      });
      setMovies(response.movies || []);
    } catch (err: any) {
      setError(
        err.message ||
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
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Hero Header Banner */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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
          <div className="lg:col-span-7 min-h-[500px] flex flex-col">
            <ResultsShowcase
              movies={movies}
              isLoading={isLoading}
              error={error}
              hasGenerated={hasGenerated}
              onRetry={handleGenerate}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-900 py-8 bg-zinc-950 text-center">
        <p className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">
          CineMind Recommendation Engine &copy; 2026. Powered by Gemini &amp; Antigravity.
        </p>
      </footer>
    </div>
  );
}

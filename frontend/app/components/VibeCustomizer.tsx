import React from "react";

const GENRE_OPTIONS = [
  "Thriller",
  "Action",
  "Comedy",
  "Adventure",
  "Drama",
  "Sci-fi",
  "Romance",
  "Horror",
  "Fantasy",
  "Mystery",
  "Crime",
  "Western",
];

const MOOD_OPTIONS = [
  "Relaxed",
  "Energetic",
  "Excited",
  "Joyful",
  "Calm",
  "Thoughtful",
];

interface VibeCustomizerProps {
  userPrompt: string;
  setUserPrompt: (val: string) => void;
  selectedGenre: string;
  setSelectedGenre: (val: string) => void;
  selectedMood: string;
  setSelectedMood: (val: string) => void;
  count: number;
  setCount: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function VibeCustomizer({
  userPrompt,
  setUserPrompt,
  selectedGenre,
  setSelectedGenre,
  selectedMood,
  setSelectedMood,
  count,
  setCount,
  onSubmit,
  onReset,
  isLoading,
}: VibeCustomizerProps) {
  const hasUserInput = userPrompt.trim() !== "" || selectedGenre !== "" || selectedMood !== "";
  const buttonLabel = hasUserInput ? "Generate Picks" : "Generate Random";

  return (
    <section className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 md:p-6 shadow-xl sticky top-20">
      {/* Title */}
      <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-zinc-900 select-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Customize Vibe
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Custom prompt input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            What are you in the mood for?
          </label>
          <input
            type="text"
            maxLength={100}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A rainy night mystery..."
            className="w-full bg-zinc-950/80 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs"
          />
        </div>

        {/* Favorite Genre Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Favorite Genre
          </label>
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-855 rounded-xl px-3.5 py-2.5 text-zinc-300 focus:text-zinc-105 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs appearance-none cursor-pointer"
            >
              <option value="" className="bg-zinc-950">Select a genre...</option>
              {GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre} className="bg-zinc-950 text-zinc-300">
                  {genre}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Current Mood Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Current Vibe / Mood
          </label>
          <div className="relative">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-855 rounded-xl px-3.5 py-2.5 text-zinc-300 focus:text-zinc-105 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs appearance-none cursor-pointer"
            >
              <option value="" className="bg-zinc-950">Select a mood...</option>
              {MOOD_OPTIONS.map((mood) => (
                <option key={mood} value={mood} className="bg-zinc-950 text-zinc-300">
                  {mood}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Count Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Recommendations Count
            </label>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {count} movies
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
            <span>1 Movie</span>
            <span>10 Movies</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-205"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/15 transition-all duration-205 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                {buttonLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

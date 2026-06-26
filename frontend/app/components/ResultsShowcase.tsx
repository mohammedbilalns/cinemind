import { Movie } from "../services/recommendationService";
import MovieCard from "./MovieCard";

interface ResultsShowcaseProps {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  hasGenerated: boolean;
  onRetry: (e: React.FormEvent) => void;
}

export default function ResultsShowcase({
  movies,
  isLoading,
  error,
  hasGenerated,
  onRetry,
}: ResultsShowcaseProps) {
  
  // 1. Initial State (No recommendations requested yet)
  if (!hasGenerated && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl p-8 text-center bg-zinc-950/20">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mb-5 text-zinc-500 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500/80">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M17 3v18" />
            <path d="M3 7h4" />
            <path d="M3 12h18" />
            <path d="M3 17h4" />
            <path d="M17 17h4" />
            <path d="M17 7h4" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Awaiting your direction</h3>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
          Configure your preferred mood, genres, and custom prompt in the panel, then click &ldquo;Generate Picks&rdquo; to start.
        </p>
      </div>
    );
  }

  // 2. Loading State (AI thinking & pulsing skeletons)
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-12 space-y-6">
        {/* Cinema reel spinner animation */}
        <div className="relative w-24 h-24 select-none">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/20 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-400/40 animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-zinc-900 shadow-lg shadow-emerald-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 animate-spin-slow">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="2" />
              <path d="m18 8-2 2" />
              <path d="m14 6-2 2" />
              <path d="M12 2v2" />
              <path d="m8 6 2 2" />
              <path d="m6 8 2 2" />
              <path d="M2 12h2" />
              <path d="m6 16 2-2" />
              <path d="m8 18 2-2" />
              <path d="M12 20v2" />
              <path d="m14 16 2 2" />
              <path d="m18 16-2-2" />
              <path d="M20 12h2" />
            </svg>
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <h4 className="text-base font-bold text-white tracking-wide">Consulting the CineMind oracle...</h4>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            AI is analyzing recommendations matching your unique mood, genre, and prompt criteria.
          </p>
        </div>

        {/* Pulse Skeletons */}
        <div className="w-full space-y-4 pt-6">
          {[1, 2].map((i) => (
            <div key={i} className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-800 rounded-md w-44" />
                  <div className="h-3.5 bg-zinc-800 rounded-md w-28" />
                </div>
                <div className="h-6 bg-zinc-800 rounded-full w-12" />
              </div>
              <div className="h-16 bg-zinc-850 rounded-xl w-full" />
              <div className="flex gap-2">
                <div className="h-5 bg-zinc-800 rounded-full w-14" />
                <div className="h-5 bg-zinc-800 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-red-950/10 border border-red-900/30 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-red-400">Recommendation Service Interrupted</h3>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={(e) => onRetry(e)}
          className="bg-red-950/30 hover:bg-red-950/50 text-red-300 border border-red-900/30 text-xs font-bold px-4.5 py-2 rounded-xl transition-all"
        >
          Retry Request
        </button>
      </div>
    );
  }

  // 4. Successful Results Showcase List
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Curated Movie Recommendations
        </h3>
        <span className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider">
          Found {movies.length} results
        </span>
      </div>

      {movies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl p-8 text-center bg-zinc-950/20">
          <p className="text-sm text-zinc-500 max-w-xs">
            No cinematic recommendations matched your exact settings. Please try adjusting your parameters or custom vibe.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

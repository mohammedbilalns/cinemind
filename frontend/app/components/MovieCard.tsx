import { Movie } from "../services/recommendationService";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5">
      {/* Header details: Title, Year, Rating */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-200 flex flex-wrap items-center gap-x-2.5 leading-snug">
            {movie.title}
            <span className="text-xs font-normal text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
              {movie.year}
            </span>
          </h4>
          
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {movie.genre.map((g, i) => (
              <span
                key={i}
                className="text-[10px] bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded-md font-semibold tracking-wide"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-extrabold shadow-inner shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {movie.rating.toFixed(1)}
        </div>
      </div>

      {/* Recommendation Explanation Block */}
      <p className="mt-4 text-sm text-zinc-300 leading-relaxed bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-4 italic group-hover:bg-zinc-950/60 transition-all duration-300">
        &ldquo;{movie.reason}&rdquo;
      </p>

      {/* Cast Pills */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-zinc-900/80 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Cast:</span>
          <div className="flex flex-wrap gap-1">
            {movie.cast.map((actor, i) => (
              <span
                key={i}
                className="text-[10px] text-zinc-400 bg-zinc-900/80 hover:bg-zinc-850 px-2.5 py-0.5 rounded-md border border-zinc-900/50 transition-colors"
              >
                {actor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

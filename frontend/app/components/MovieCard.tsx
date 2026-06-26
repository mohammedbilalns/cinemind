import { Movie } from "../services/recommendationService";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <a
      href={movie.imdbUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900 rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Movie Image Thumbnail */}
        {movie.titleImage && (
          <div className="relative w-full sm:w-32 h-44 sm:h-auto min-h-[140px] shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 select-none">
            <img
              src={movie.titleImage}
              alt={`${movie.title} Poster`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              onError={(e) => {
                // Defensive fallback to a high-quality cinematic stock photo if the AI-generated link fails
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=60";
              }}
            />
          </div>
        )}

        {/* Movie Info Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Header details: Title, Year, Rating */}
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1.5 min-w-0">
                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors duration-250 flex flex-wrap items-center gap-x-2.5 leading-snug">
                  <span className="truncate">{movie.title}</span>
                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 shrink-0">
                    {movie.year}
                  </span>
                </h4>
                
                {/* Genre Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {movie.genre.map((g, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded font-bold tracking-wide"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-extrabold shadow-inner shrink-0 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {movie.rating.toFixed(1)}
              </div>
            </div>

            {/* Recommendation Explanation Block */}
            <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3.5 italic group-hover:bg-zinc-950/60 transition-all duration-300">
              &ldquo;{movie.reason}&rdquo;
            </p>
          </div>

          {/* Cast Pills */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-zinc-900/80 flex flex-wrap items-center gap-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider select-none">Cast:</span>
              <div className="flex flex-wrap gap-1">
                {movie.cast.map((actor, i) => (
                  <span
                    key={i}
                    className="text-[9px] text-zinc-400 bg-zinc-900/80 hover:bg-zinc-850 px-2 py-0.5 rounded border border-zinc-900/50 transition-colors"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

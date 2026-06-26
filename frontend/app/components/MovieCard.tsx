import { Movie } from "../services/recommendationService";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.tmdbId}`;
  
  const releaseYear = movie.releaseDate ? movie.releaseDate.split("-")[0] : "N/A";
  
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const runtimeStr = formatRuntime(movie.runtime);

  return (
    <a
      href={tmdbUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900 rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 cursor-pointer overflow-hidden"
    >
      {/* Premium Backdrop Watermark Background */}
      {movie.backdropPath && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdropPath})`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col sm:flex-row gap-5">
        {/* Movie Poster Thumbnail */}
        <div className="relative w-full sm:w-32 h-48 sm:h-auto min-h-[160px] shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 select-none flex items-center justify-center">
          {movie.posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={`${movie.title} Poster`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 animate-fade-in"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector(".poster-fallback");
                  if (fallback) fallback.classList.remove("hidden");
                }
              }}
            />
          ) : null}
          <div className={`poster-fallback flex flex-col items-center justify-center text-center p-3 gap-2 ${movie.posterPath ? "hidden absolute inset-0 bg-zinc-950" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-650">
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
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-tight">No Poster</span>
          </div>
        </div>

        {/* Movie Info Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Header details: Title, Year, Rating */}
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1.5 min-w-0">
                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors duration-250 flex flex-wrap items-center gap-x-2.5 leading-snug">
                  <span className="truncate">{movie.title}</span>
                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 shrink-0">
                    {releaseYear}
                  </span>
                  {runtimeStr && (
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900/40 shrink-0">
                      {runtimeStr}
                    </span>
                  )}
                </h4>
                
                {/* Genre Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres && movie.genres.length > 0 ? (
                    movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="text-[9px] bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded font-bold tracking-wide"
                      >
                        {g.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold tracking-wide">
                      Movie
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-extrabold shadow-inner shrink-0 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}
              </div>
            </div>

            {/* Movie Overview/Description */}
            {movie.overview && (
              <p className="mt-3 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* Recommendation Explanation Block */}
            <p className="mt-3.5 text-xs text-zinc-350 leading-relaxed bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3.5 italic group-hover:bg-zinc-950/60 transition-all duration-300">
              &ldquo;{movie.reason}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

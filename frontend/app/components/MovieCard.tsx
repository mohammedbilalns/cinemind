import Image from "next/image";
import { useState, useEffect } from "react";
import { Movie } from "../services/recommendationService";
import { getLanguageName } from "../utils/languageMap";

interface MovieCardProps {
  movie: Movie;
}

interface TrailerResponse {
  key: string;
  name: string;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailer, setTrailer] = useState<TrailerResponse | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState<string | null>(null);

  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.tmdbId}`;
  const releaseYear = movie.releaseDate ? movie.releaseDate.split("-")[0] : "N/A";
  
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const runtimeStr = formatRuntime(movie.runtime);
  const langStr = movie.originalLanguage ? getLanguageName(movie.originalLanguage) : null;

  useEffect(() => {
    if (isTrailerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTrailerOpen]);

  const handlePlayTrailer = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTrailerOpen(true);
    
    if (trailer || trailerError) return; // already fetched

    setTrailerLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/movies/${movie.tmdbId}/trailer`);
      if (!res.ok) {
        throw new Error("Failed to fetch trailer");
      }
      const data = await res.json();
      setTrailer(data);
    } catch (err) {
      setTrailerError("Trailer not available for this movie.");
    } finally {
      setTrailerLoading(false);
    }
  };

  return (
    <>
      <div className="group relative block bg-linear-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900 rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] overflow-hidden">
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
          <a href={tmdbUrl} target="_blank" rel="noopener noreferrer" className="relative w-full sm:w-32 h-48 sm:h-auto min-h-40 shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 select-none flex items-center justify-center cursor-pointer block">
            {movie.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={`${movie.title} Poster`}
                fill
                sizes="(min-width: 640px) 8rem, 100vw"
                loading="lazy"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300 animate-fade-in"
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
          </a>

          {/* Movie Info Details */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              {/* Header details: Title, Year, Rating */}
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1.5 min-w-0">
                  <a href={tmdbUrl} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-white hover:text-emerald-400 transition-colors duration-250 flex flex-wrap items-center gap-x-2.5 leading-snug">
                    <span className="truncate">{movie.title}</span>
                    <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 shrink-0">
                      {releaseYear}
                    </span>
                    {runtimeStr && (
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900/40 shrink-0">
                        {runtimeStr}
                      </span>
                    )}
                    {langStr && (
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0 uppercase tracking-wider">
                        {langStr}
                      </span>
                    )}
                  </a>
                  
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
              <p className="mt-3.5 text-xs text-zinc-350 leading-relaxed bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3.5 italic group-hover:bg-zinc-950/60 transition-all duration-300 mb-4">
                &ldquo;{movie.reason}&rdquo;
              </p>
              
              <div className="flex gap-3 mt-auto flex-wrap">
                <button 
                  onClick={handlePlayTrailer}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-colors border border-emerald-500/20 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Play Trailer
                </button>
                <a 
                  href={`https://letterboxd.com/tmdb/${movie.tmdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
                  Letterboxd
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal Popup */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white truncate px-2">{movie.title} - Trailer</h3>
              <button 
                onClick={() => setIsTrailerOpen(false)}
                className="text-zinc-400 hover:text-white p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {trailerLoading ? (
                <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : trailerError || !trailer ? (
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-4 mx-auto"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1-1.565 1.214m-1.4-1.84a8.75 8.75 0 0 0-11.96-3.72M2 2l20 20"/></svg>
                  <h3 className="text-lg font-bold text-white mb-2">Trailer Unavailable</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">We couldn't find a YouTube trailer for this movie.</p>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title={trailer.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
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
    if (isTrailerOpen || isDetailsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTrailerOpen, isDetailsOpen]);

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
              
              <div className="flex gap-2 mt-auto flex-wrap">
                <button 
                  onClick={handlePlayTrailer}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-colors border border-emerald-500/20 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Play Trailer
                </button>
                <button 
                  onClick={() => setIsDetailsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  View Details
                </button>
                <a 
                  href={`https://letterboxd.com/tmdb/${movie.tmdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
                  Letterboxd
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal Popup */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 shrink-0">
              <h3 className="text-lg font-bold text-white truncate px-2">{movie.title}</h3>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="text-zinc-400 hover:text-white p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Poster in Modal */}
                {movie.posterPath && (
                  <div className="w-full sm:w-48 shrink-0 rounded-xl overflow-hidden border border-zinc-800 shadow-xl self-start">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={`${movie.title} Poster`}
                      width={192}
                      height={288}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                      {releaseYear}
                    </span>
                    {runtimeStr && (
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
                        {runtimeStr}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-emerald-400 text-xs font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handlePlayTrailer}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-900/20 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Play Trailer
                    </button>
                    
                    <a 
                      href={`https://cineby.rocks/movie/${movie.tmdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors border border-zinc-700"
                    >
                      <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                      </div>
                      Watch on Cineby
                    </a>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {movie.genres && movie.genres.length > 0 && movie.genres.map((g) => (
                      <span key={g.id} className="text-xs bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Full Overview */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-white mb-2">Overview</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation Reason */}
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Why this movie?</h4>
                <p className="text-sm text-zinc-300 italic">
                  &ldquo;{movie.reason}&rdquo;
                </p>
              </div>

              {/* Cast & Crew in Modal */}
              {(movie.cast && movie.cast.length > 0) || movie.director ? (
                <div className="border-t border-zinc-800 pt-6">
                  <div className="flex justify-between items-end mb-4">
                    <h4 className="text-sm font-bold text-white">Cast & Crew</h4>
                    {movie.director && (
                      <span className="text-xs text-zinc-400"><span className="font-semibold text-zinc-300">Director:</span> {movie.director}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {movie.cast && movie.cast.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                          {c.profilePath ? (
                            <img src={`https://image.tmdb.org/t/p/w185${c.profilePath}`} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 truncate">{c.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{c.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </div>
          </div>
        </div>
      )}

      {/* Trailer Modal Popup */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
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

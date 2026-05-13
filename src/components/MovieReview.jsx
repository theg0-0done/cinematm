import { TbFolderPlus, TbFolderMinus } from "react-icons/tb";
import { FaPlay, FaStar } from "react-icons/fa";
import { useContext } from "react";
import { CinemaContext } from "../context/CinemaContext";
import { Link } from "react-router-dom";

function MovieReview({ movie, onPrev, onNext }) {
  const { setWatchlist, watchlist, tvGenres, mvGenres } = useContext(CinemaContext);

  if (!movie.v_backdrop) return null;

  const inWatchlist = watchlist.some((m) => m.id === movie.id);
  const mediaType = movie.media_type || "movie";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "";
  const year = movie.first_air_date?.split("-")[0] || movie.release_date?.split("-")[0];

  const toggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist((prev) =>
      inWatchlist
        ? prev.filter((item) => item.id !== movie.id)
        : [...prev, { id: movie.id, media_type: mediaType }]
    );
  };

  const allGenres = [...(mvGenres || []), ...(tvGenres || [])];
  const genreNames = (movie.genre_ids || [])
    .map((id) => allGenres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="relative w-full h-full flex flex-col justify-end lg:justify-center pb-12 lg:pb-24 isolate">
      {/* Background images: Backdrop for Desktop, Poster for Mobile */}
      <div
        className="absolute inset-0 -z-[2] bg-cover bg-[center_20%] bg-no-repeat hidden md:block"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.v_backdrop})`,
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
        }}
      />
      <div
        className="absolute inset-0 -z-[2] bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 -z-[1] bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 -z-[1] bg-gradient-to-r from-[#080810]/90 via-[#080810]/30 to-transparent pointer-events-none hidden md:block" />

      {/* Left / Right nav chevrons */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute lg:hidden left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
          aria-label="Previous"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute lg:hidden right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
          aria-label="Next"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Content overlay — bottom-aligned */}
      <div className="relative z-10 px-5 pb-6 md:px-14 md:pb-14 max-w-[780px] animate-fadeIn">
        {/* Title */}
        <h1 className="text-[1.9rem] md:text-[3rem] font-extrabold leading-[1.1] text-white mb-3 line-clamp-2">
          {movie.title || movie.name}
        </h1>

        {/* Rating + Year row */}
        <div className="flex items-center gap-3 mb-3 text-sm text-white">
          {rating && (
            <span className="flex items-center gap-1 font-semibold">
              <FaStar className="text-[#ffd700]" size={13} />
              {rating}
            </span>
          )}
          {year && (
            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-[4px] text-xs font-medium">
              {year}
            </span>
          )}
        </div>

        {/* Genres ships */}
        {genreNames.length > 0 && (
          <div className="flex gap-2 mb-3">
            {genreNames.map((genre) => (
              <span key={genre} className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium">
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        {movie.overview && (
          <p className="hidden lg:block text-white text-sm mb-3 max-w-3xl line-clamp-3">{movie.overview}</p>
        )}

        {/* CTA buttons — horizontal row */}
        <div className="flex gap-3 flex-wrap">
          <Link
            to={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-2 bg-[#00c3ff] text-[#080810] px-5 py-2.5 rounded-full font-bold text-[0.9rem] no-underline transition-all hover:bg-[#00d8ff] hover:scale-105 active:scale-95"
          >
            <FaPlay size={12} /> Watch Now
          </Link>
          <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[0.9rem] border transition-all hover:scale-105 active:scale-95 ${
              inWatchlist
                ? "bg-white/20 border-white/30 text-white"
                : "bg-white/10 border-white/20 text-white hover:bg-white/15"
            }`}
          >
            {inWatchlist ? (
              <><TbFolderMinus size={17} /> Saved</>
            ) : (
              <><TbFolderPlus size={17} /> Watchlist</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieReview;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { CinemaContext } from "../context/CinemaContext";
import { FaPlus, FaCheck, FaTimes, FaPlay } from "react-icons/fa";

function MovieCard({ movie, layout = "vertical", showRemove = false }) {
  const { setWatchlist, watchlist } = useContext(CinemaContext);

  if (!movie.poster_path) return null;

  const inWatchlist = watchlist.some((m) => m.id === movie.id);
  const mediaType = movie.media_type || "movie";
  const title = movie.title || movie.name || "";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist((prev) =>
      inWatchlist ? prev.filter((m) => m.id !== movie.id) : [...prev, movie]
    );
  };

  // Grid layout for AllMoviesPage/Search results
  // Vertical layout for carousels
  // Horizontal layout for Hero sections
  
  if (layout === "horizontal") {
    return (
      <div className="group/card relative w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[15px] overflow-hidden bg-[#0b0c10] border border-white/5 transition-all duration-500 snap-center">
        <Link to={`/${mediaType}/${movie.id}`} className="block w-full h-full relative">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.v_backdrop || movie.backdrop_path || movie.poster_path}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </Link>
        <button
          onClick={toggleWatchlist}
          className={`absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer backdrop-blur-md z-10
            ${inWatchlist ? "bg-[#00c3ff] border-[#00c3ff] text-white" : "bg-black/30 border-white/20 text-white hover:border-[#00c3ff]"}`}
        >
          {inWatchlist ? <FaCheck size={16} /> : <FaPlus size={16} />}
        </button>
      </div>
    );
  }

  if (layout === "recently_watched") {
    return (
      <div className="group/card flex flex-col gap-3 transition-all duration-300 cursor-pointer w-[240px] shrink-0 snap-center">
        <Link 
          to={`/${mediaType}/${movie.id}`}
          className="relative aspect-video rounded-[10px] overflow-hidden bg-[#1a1c23] border border-white/[0.05] shadow-lg transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:border-[#00c3ff]/30 group-hover/card:shadow-[0_12px_24px_rgba(0,195,255,0.15)]"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
            loading="lazy"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/10 transition-colors duration-300" />
          
          {/* Play button in the middle */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white pl-1">
              <FaPlay size={18} />
            </div>
          </div>
        </Link>

        {/* Info area underneath */}
        <div className="flex items-center justify-between gap-2 px-1">
          <Link to={`/${mediaType}/${movie.id}`} className="flex-1 min-w-0 no-underline">
            <h4 className="m-0 text-[0.95rem] font-semibold text-white leading-tight truncate transition-colors group-hover/card:text-[#00c3ff]">
              {title}
            </h4>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`group/card flex flex-col gap-2 transition-all duration-300 cursor-pointer ${layout === "grid" ? "w-full" : "w-[160px] min-w-[160px]"}`}>
      {/* Poster Container */}
      <Link 
        to={`/${mediaType}/${movie.id}`}
        className="relative aspect-[2/3] rounded-[10px] overflow-hidden bg-[#1a1c23] border border-white/[0.05] shadow-lg transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:border-[#00c3ff]/30 group-hover/card:shadow-[0_12px_24px_rgba(0,195,255,0.15)]"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
          loading="lazy"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        
        {/* Remove button */}
        {showRemove && (
          <button
            onClick={toggleWatchlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:bg-red-600 hover:border-red-600 z-20 group/remove shadow-lg active:scale-90"
            title="Remove from watchlist"
          >
            <FaTimes size={14} className="transition-transform group-hover/remove:rotate-90" />
          </button>
        )}
      </Link>

      {/* Info area */}
      <div className="flex items-center justify-between gap-2 px-1">
        <Link to={`/${mediaType}/${movie.id}`} className="flex-1 min-w-0 no-underline">
          <h4 className="m-0 text-[0.85rem] font-semibold text-white leading-tight truncate transition-colors group-hover/card:text-[#00c3ff]">
            {title}
          </h4>
          <span className="text-[0.7rem] text-gray-500 font-medium tracking-tight">
            {year}
          </span>
        </Link>
        
        
      </div>
    </div>
  );
}

export default MovieCard;

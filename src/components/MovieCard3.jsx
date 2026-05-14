import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";
import { useContext } from "react";
import { CinemaContext } from "../context/CinemaContext";

function MovieCard3({ movie }) {
  const { mediaType } = useParams();
  const { setWatchlist } = useContext(CinemaContext);

  return (
    movie.poster_path && (
      <div className="flex flex-col gap-2 group">
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] border border-white/10">
          {mediaType === "watchlist" ? (
            <div
              className="absolute right-2 top-2 bg-red-500/80 backdrop-blur-sm p-1.5 rounded-full cursor-pointer z-10 transition-colors lg:hover:bg-red-600"
              title="Remove from watchlist"
              onClick={() =>
                setWatchlist((prev) =>
                  Array.isArray(prev)
                    ? prev.filter((item) => item.id !== movie.id)
                    : []
                )
              }
            >
              <MdBookmark className="text-white" size={20} />
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 z-10 border border-white/10">
              {(movie.vote_average / 2).toFixed(1)}{" "}
              <FaStar className="text-yellow-400" size={14} />{" "}
            </div>
          )}
          <Link
            to={`/${movie.media_type}/${movie.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block h-full"
          >
            <img
              className="w-full h-full object-cover lg:group-hover:scale-110 transition-transform duration-500"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
            />
          </Link>
        </div>

        <p className="font-semibold text-sm truncate lg:group-hover:text-[#00c3ff] transition-colors">{movie.title || movie.name}</p>
      </div>
    )
  );
}

export default MovieCard3;

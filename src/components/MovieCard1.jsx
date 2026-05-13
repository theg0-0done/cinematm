```javascript
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CinemaContext } from "../context/CinemaContext";
import { FaStar } from "react-icons/fa";

function MovieCard1({ movie }) {
  const { formatDate } = useContext(CinemaContext);

  return (
    movie.poster_path && (
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {movie.vote_average ? (
          <p className="flex items-center gap-1 text-sm font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md w-fit">
            {(movie.vote_average / 2).toFixed(1)}
            <FaStar className="text-yellow-400" />
          </p>
        ) : (
          ""
        )}
        <Link
          to={movie.media_type && `/${movie.media_type}/${movie.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="overflow-hidden rounded-lg block"
        >
          <img
            className="w-full aspect-[2/3] object-cover hover:scale-105 transition-transform duration-300"
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title || movie.name}
          />
        </Link>
        <p className="font-semibold text-sm truncate">{movie.title || movie.name}</p>

        <div className="flex justify-between flex-wrap text-xs text-white/80">
          {movie.air_date && (
            <p>{formatDate(movie.air_date)}</p>
          )}
          {movie.episode_count && (
            <p>{movie.episode_count} Ep</p>
          )}
        </div>
      </div>
    )
  );
}

export default MovieCard1;

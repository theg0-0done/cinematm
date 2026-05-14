import { useContext } from "react";
import { Link } from "react-router-dom";
import { CinemaContext } from "../context/CinemaContext";

function MovieCard2({ movie }) {
  const {formatDate} = useContext(CinemaContext)

  return (
    movie.poster_path && (
      <div className="flex flex-col gap-3 w-full">
        <div className="relative group overflow-hidden rounded-xl border border-white/10">
          <p className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white z-10 border border-white/10">
            {formatDate(movie.release_date)}
          </p>
          <Link
            to={`/${movie.media_type}/${movie.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block"
          >
            <img
              src={`https://image.tmdb.org/t/p/w780${movie.v_backdrop}`}
              alt={movie.title || movie.name}
              className="w-full aspect-video object-cover lg:group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>
        <div className="px-1">
          <h4 className="font-bold text-lg truncate text-white/90 lg:group-hover:text-white transition-colors">{movie.title || movie.name}</h4>
        </div>
      </div>
    )
  );
}

export default MovieCard2;

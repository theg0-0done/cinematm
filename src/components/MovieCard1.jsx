import { useContext } from "react";
import { Link } from "react-router-dom";
import { CenimaContext } from "../context/CenimaContext";
import { FaStar } from "react-icons/fa";

function MovieCard1({ movie }) {
  const { formatDate } = useContext(CenimaContext);

  return (
    movie.poster_path && (
      <div className="trend-movie">
        {movie.vote_average ? (
          <p
            className="rating"
            style={{
              display: "flex",
              gap: "4px",
            }}
          >
            {(movie.vote_average / 2).toFixed(1)}
            <FaStar color="yellow" />
          </p>
        ) : (
          ""
        )}
        <Link
          to={movie.media_type && `/${movie.media_type}/${movie.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            className="trend-movie-poster"
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt=""
          />
        </Link>
        <p>{movie.title || movie.name}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {movie.air_date && (
            <p style={{ opacity: "0.8" }}>{formatDate(movie.air_date)}</p>
          )}
          {movie.episode_count && (
            <p style={{ opacity: "0.8" }}>{movie.episode_count} Ep</p>
          )}
        </div>
      </div>
    )
  );
}

export default MovieCard1;

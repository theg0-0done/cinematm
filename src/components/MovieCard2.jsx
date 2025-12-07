import { useContext } from "react";
import { Link } from "react-router-dom";
import { CenimaContext } from "../context/cenimaContext";

function MovieCard2({ movie }) {
  const {formatDate} = useContext(CenimaContext)

  return (
    movie.poster_path && (
      <div className="upcoming-movie">
        <div className="poster-container">
          <p style={{ right: "2rem" }} className="rating">
            {formatDate(movie.release_date)}
          </p>
          <Link
            to={`/${movie.media_type}/${movie.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.v_backdrop}`}
              alt=""
            />
          </Link>
        </div>
        <div>
          <h4>{movie.title || movie.name}</h4>
        </div>
      </div>
    )
  );
}

export default MovieCard2;

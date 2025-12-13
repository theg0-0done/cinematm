import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";
import { useContext } from "react";
import { CenimaContext } from "../context/CenimaContext";

function MovieCard3({ movie }) {
  const { mediaType } = useParams();
  const { setWatchlist } = useContext(CenimaContext);

  return (
    movie.poster_path && (
      <div className="all-movie">
        <div style={{ position: "relative" }}>
          {mediaType === "watchlist" ? (
            <div
              className="rating"
              style={{
                right: "4px",
                top: "4px",
                padding: "4px",
                cursor: "pointer",
              }}
              title="Remove from watchlist"
              onClick={() =>
                setWatchlist((prev) =>
                  Array.isArray(prev)
                    ? prev.filter((item) => item.id !== movie.id)
                    : []
                )
              }
            >
              <MdBookmark color="white" size={22} />
            </div>
          ) : (
            <div className="rating">
              {(movie.vote_average / 2).toFixed(1)}{" "}
              <FaStar color="yellow" size={18} />{" "}
            </div>
          )}
          <Link
            to={`/${movie.media_type}/${movie.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              className="all-movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt=""
            />
          </Link>
        </div>

        <p>{movie.title || movie.name}</p>
      </div>
    )
  );
}

export default MovieCard3;

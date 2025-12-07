import { TbFolderPlus } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";
import ReactStars from "react-stars";
import { allGenres } from "../assets/allGenres";
import { useContext } from "react";
import { CenimaContext } from "../context/cenimaContext";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

function MovieReview({ movie }) {
  const { setWatchlist } = useContext(CenimaContext);
  return (
    movie.v_backdrop && (
      <div
        className="movie-background"
        key={movie.id}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.v_backdrop})`,
        }}
      >
        <div className="movie-container">
          <div className="poster-container">
            <Link to={`${movie.media_type}/${movie.id}`}>
              <img
                className="poster-img"
                src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                alt="movie poster"
              />
            </Link>
          </div>
          <div className="movie-details">
            <h1>{movie.title || movie.name}</h1>
            <p className="movie-details-overview">{movie.overview}</p>
            <div className="genres-container">
              {allGenres
                .filter((genre) => movie.genre_ids.includes(genre.id))
                .map((g) => (
                  <button key={g.id}>{g.name}</button>
                ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <ReactStars
                count={5}
                size={26}
                value={movie.vote_average / 2}
                isHalf={true}
                edit={false}
              />
              <p>|</p>
              <p style={{ fontSize: "1.4rem" }}>
                {movie.first_air_date?.split("-")[0] ||
                  movie.release_date?.split("-")[0]}
              </p>
            </div>
            <div className="buttons-container">
              <button
                onClick={() => {
                  setWatchlist((prev) =>
                    prev.includes(movie)
                      ? prev.filter((m) => m === movie)
                      : [...prev, movie]
                  );
                }}
              >
                Add To Watchlist <TbFolderPlus color="#57EBDE" size={26} />
              </button>
              <a
                href={`https://youtube.com/watch?v=${movie.trailer}`}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <button>
                  Watch Trailer <BiMoviePlay color="#57EBDE" size={26} />
                </button>
              </a>
              <Link to={`${movie.media_type}/${movie.id}`} className="see-more">
                <button>
                  See More{" "}
                  <IoIosArrowForward
                    style={{ textDecoration: "none" }}
                    color="#57EBDE"
                    size={26}
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default MovieReview;

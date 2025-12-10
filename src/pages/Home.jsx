import { useContext } from "react";
import { CenimaContext } from "../context/CenimaContext";
import { trendGenres } from "../assets/trendGenres";
import MovieCard1 from "../components/MovieCard1";
import MovieCard2 from "../components/MovieCard2";
import MovieReview from "../components/MovieReview";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

function Home() {
  const {
    containerRef,
    trendMovies,
    trendShows,
    trendActors,
    inCinema,
    upComing,
    trendAll,
    topMovies,
    topTv,
    watchlist
  } = useContext(CenimaContext);

  // console.log(watchlist);

  return (
    <section className="home-section">
      <div className="movieS-container" ref={containerRef}>
        {trendAll.map((m) => {
          return <MovieReview key={m.name} movie={m} />;
        })}
      </div>

      <div className="trend-container">
        <div className="trending-header">
          <h3>TRENDING MOVIES:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="movies/trending-lately"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>

        <div className="trend-movieS">
          {trendMovies.map((movie) => {
            return <MovieCard1 key={movie.id} movie={movie} />;
          })}
        </div>
      </div>

      <div className="trend-container">
        <div className="trending-header">
          <h3>TRENDING TV Shows:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="tv-shows/trending-lately"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>

        <div className="trend-movieS">
          {trendShows.map((movie) => {
            return <MovieCard1 key={movie.id} movie={movie} />;
          })}
        </div>
      </div>

      <div className="trend-genres">
        {trendGenres.map((genre) => (
          <div
            key={genre.id}
            className="genre"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${genre.background})`,
            }}
          >
            <p>{genre.name}</p>
          </div>
        ))}
      </div>

      <div className="trend-container">
        <div className="trending-header">
          <h3>Top-rated Movies:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="movies/top-rated"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>

        <div className="trend-movieS">
          {topMovies.map((movie) => {
            return <MovieCard1 key={movie.id} movie={movie} />;
          })}
        </div>
      </div>

      <div className="trend-container">
        <div className="trending-header">
          <h3>Top-rated TV Shows:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="tv-shows/top-rated"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>

        <div className="trend-movieS">
          {topTv.map((movie) => {
            return <MovieCard1 key={movie.id} movie={movie} />;
          })}
        </div>
      </div>

      <div className="upcoming-container">
        <div className="trending-header">
          <h3>IN CINEMA:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="movies/in-cinema"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>
        <div className="upcoming-movieS">
          {inCinema.map((movie) => (
            <MovieCard2 movie={movie} />
          ))}
        </div>
      </div>

      <div className="trend-container">
        <div className="trending-header">
          <h3>TRENDING ACTORS:</h3>
        </div>

        <div className="trend-movieS">
          {trendActors.map(
            (actor) =>
              actor.profile_path &&
              actor.known_for_department === "Acting" && (
                <div className="trend-actor">
                  <img
                    className="actor-avatar"
                    src={`https://image.tmdb.org/t/p/w1280/${actor.profile_path}`}
                    alt=""
                  />
                  <p>{actor.name}</p>
                </div>
              )
          )}
        </div>
      </div>

      <div className="upcoming-container">
        <div className="trending-header">
          <h3>UPCOMING MOVIES:</h3>
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to="movies/coming-soon"
            className="see-all"
          >
            See All <IoIosArrowForward />
          </Link>
        </div>
        <div className="upcoming-movieS">
          {upComing.map((movie) => (
            <MovieCard2 movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;

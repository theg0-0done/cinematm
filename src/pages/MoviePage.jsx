import { useParams } from "react-router-dom";
import ReactStars from "react-stars";
import { BiMoviePlay } from "react-icons/bi";
import { TbFolderPlus } from "react-icons/tb";
import MovieCard1 from "../components/MovieCard1";
import { useContext, useEffect, useState } from "react";
import { API_KEY } from "../context/api";
import { CenimaContext } from "../context/CenimaContext";

function MoviePage() {
  const [movieData, setMovieData] = useState(null);
  const { id } = useParams();

  const { formatDate, setWatchlist } = useContext(CenimaContext);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits,reviews,similar,recommendations
`
        );

        if (!response.ok) {
          throw new Error("Could not fetch resource.");
        }

        const data = await response.json();
        setMovieData({
          ...data,
          similar: {
            ...data.similar,
            results:
              data.similar?.results?.map((m) => ({
                ...m,
                media_type: "movie",
              })) || [],
          },
          recommendations: {
            ...data.recommendations,
            results:
              data.recommendations?.results?.map((m) => ({
                ...m,
                media_type: "movie",
              })) || [],
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (!movieData) return <p className="no-items-yet">Loading...</p>;

  const movieLanguageName = new Intl.DisplayNames(["en"], {
    type: "language",
  }).of(movieData.original_language);

  const movieCountry = movieData.origin_country?.length
    ? movieData.origin_country.map((code) =>
        new Intl.DisplayNames(["en"], { type: "region" }).of(code)
      )
    : ["Unknown"];

  function shortNumber(num) {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
  }

  // console.log(watchlist?.length);
  

  return (
    <section className="movie-page">
      <div
        className="movie-page-background"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movieData.backdrop_path})`,
        }}
      />
      <div className="movie-page-container">
        <div className="movie-page-details">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movieData.poster_path}`}
            alt={movieData.title}
          />
          <div className="movie-page-details2">
            <h1>{movieData.title}</h1>
            <h4>{movieData.tagline}</h4>

            <div className="large-screen-elements">
              <p className="overview">Genres:</p>
              <div className="genres-container">
                {movieData.genres?.map((genre) => (
                  <button key={genre.id}>{genre.name}</button>
                ))}
              </div>
            </div>

            <div className="movie-page-infos">
              {movieData.vote_average ? (
                <ReactStars
                  className="movie-page-rating"
                  count={5}
                  size={18}
                  value={movieData.vote_average / 2}
                  isHalf={true}
                  edit={false}
                  activeColor="yellow"
                  color="rgba(255,255,255,0.3)"
                />
              ) : (
                <p>Unavailable</p>
              )}
              <p>|</p>
              <p> {movieData.runtime} min </p>
              {movieData.revenue ? (
                <>
                  <p>|</p>
                  <p>${shortNumber(movieData.revenue)}</p>
                </>
              ) : (
                ""
              )}
            </div>

            <div className="moviePage-buttons-container">
              <button
                onClick={() => {
                  setWatchlist((prev) =>
                    prev.includes(movieData)
                      ? prev.filter((m) => m === movieData)
                      : [...prev, movieData]
                  );
                }}
              >
                Add To Watchlist <TbFolderPlus color="#57EBDE" size={18} />
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${
                  movieData.videos.results.find(
                    (v) => v.type.toLowerCase() === "trailer"
                  )?.key || movieData.videos.results[0]?.key
                }`}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <button>
                  Watch Trailer <BiMoviePlay color="#57EBDE" size={18} />
                </button>
              </a>
            </div>
          </div>
        </div>

        <div className="small-screen-elements">
          <p className="overview">Genres:</p>
          <div className="genres-container">
            {movieData.genres?.map((genre) => (
              <button key={genre.id}>{genre.name}</button>
            ))}
          </div>
        </div>

        <div className="labels-container">
          <label>
            Origin Country{" "}
            {movieCountry.map((c) => (
              <p key={c} style={{ marginBottom: 0 }}>
                {c}
              </p>
            ))}
          </label>
          <label>
            Release Date <p>{formatDate(movieData.release_date)}</p>
          </label>
          <label>
            Original Language <p>{movieLanguageName}</p>
          </label>
        </div>

        <label className="overview">
          Overview:
          <p>{movieData.overview}</p>
        </label>

        <div>
          <p className="overview">Cast:</p>
          <div className="cast-container">
            {movieData.credits?.cast?.map(
              (actor) =>
                actor.profile_path && (
                  <div className="movie-cast" key={actor.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${actor.profile_path}`}
                      alt={actor.name}
                    />
                    <p>{actor.name}</p>
                    <p style={{ color: "grey" }}>"{actor.character}"</p>
                  </div>
                )
            )}
          </div>
        </div>

        <div>
          <p className="overview">Reviews:</p>
          <div className="reviews-container">
            {movieData.reviews?.results?.length ? (
              movieData.reviews.results.map((review, index) => (
                <div className="review" key={review.id || index}>
                  <p style={{ fontWeight: "bold" }}>{review.author}</p>
                  <p>{review.content}</p>
                </div>
              ))
            ) : (
              <p>No Reviews</p>
            )}
          </div>
        </div>

        <div>
          <p className="overview">Similar to "{movieData.title}"</p>
          {movieData.similar.results.length > 1 ? (
            <div className="trend-movieS">
              {movieData.similar.results.map((movie) => {
                return <MovieCard1 key={movie.id} movie={movie} />;
              })}
            </div>
          ) : (
            <p>No Similars Available</p>
          )}
        </div>

        <div>
          <p className="overview">You Might Like As Well:</p>

          {movieData.recommendations.results.length > 1 ? (
            <div className="trend-movieS">
              {movieData.recommendations.results.map((movie) => {
                return <MovieCard1 key={movie.id} movie={movie} />;
              })}
            </div>
          ) : (
            <p>No Recommendations Available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MoviePage;

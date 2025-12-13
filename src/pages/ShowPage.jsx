import { useParams } from "react-router-dom";
import ReactStars from "react-stars";
import { BiMoviePlay } from "react-icons/bi";
import { TbFolderPlus } from "react-icons/tb";
import MovieCard1 from "../components/MovieCard1";
import { API_KEY } from "../context/api";
import { useState, useEffect, useContext } from "react";
import EpisodeCard from "../components/EpisodeCard";
import { IoIosArrowForward } from "react-icons/io";
import { CenimaContext } from "../context/CenimaContext";

function ShowPage() {
  const [showData, setShowData] = useState(null);
  const { id } = useParams();
  const { setWatchlist, watchlist } = useContext(CenimaContext);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=videos,images,reviews,similar,recommendations,aggregate_credits`
        );

        if (!response.ok) throw new Error("Could not fetch resource.");

        const data = await response.json();

        // ---- Fetch all seasons & episodes ----
        const seasonRequests = data.seasons.map((s) =>
          fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/${s.season_number}?api_key=${API_KEY}`
          ).then((r) => r.json())
        );

        const seasonsWithEpisodes = await Promise.all(seasonRequests);

        // ---- Save everything ----
        setShowData({
          ...data,
          seasons_full: seasonsWithEpisodes, // <– all episodes for all seasons

          similar: {
            ...data.similar,
            results:
              data.similar?.results?.map((m) => ({ ...m, media_type: "tv" })) ||
              [],
          },

          recommendations: {
            ...data.recommendations,
            results:
              data.recommendations?.results?.map((m) => ({
                ...m,
                media_type: "tv",
              })) || [],
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchShow();
  }, [id]);

  if (!showData)
    return (
      <p
        style={{
          marginBlock: "20rem",
          textAlign: "center",
          color: "white",
        }}
      >
        Loading...
      </p>
    );

  const showLanguageName = new Intl.DisplayNames(["en"], {
    type: "language",
  }).of(showData.original_language);

  const showCountry = showData.origin_country?.length
    ? showData.origin_country.map((code) =>
        new Intl.DisplayNames(["en"], { type: "region" }).of(code)
      )
    : ["Unknown"];

    const trailerKey =
      showData.videos.results.find((v) => v.type.toLowerCase() === "trailer")
        ?.key || showData.videos.results[0]?.key;

  return (
    <section className="movie-page">
      <div
        className="movie-page-background"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w780${
            showData.images.backdrops.find((b) => b.iso_639_1 === "en")
              ?.file_path || showData.images.backdrops[0]?.file_path
          })`,
        }}
      />
      <div className="movie-page-container">
        <div className="movie-page-details">
          <img
            src={`https://image.tmdb.org/t/p/w780${showData.poster_path}`}
            alt={showData.name}
          />

          <div className="movie-page-details2">
            <h1>{showData.name}</h1>
            <h4>{showData.tagline}</h4>

            <div className="large-screen-elements">
              <p className="overview">Genres:</p>
              <div className="genres-container">
                {showData.genres?.map((genre) => (
                  <button key={genre.id}>{genre.name}</button>
                ))}
              </div>
            </div>

            {showData.vote_average ? (
              <ReactStars
                className="movie-page-rating"
                count={5}
                size={24}
                value={showData.vote_average / 2}
                isHalf={true}
                edit={false}
                activeColor="yellow"
                color="rgba(255,255,255,0.3)"
              />
            ) : (
              <p>Unavailable</p>
            )}

            <button
              className="action-btn"
              onClick={() => {
                setWatchlist((prev) => {
                  const exist = prev.some((item) => item.id === movieData.id);
                  return exist
                    ? prev.filter((item) => item.id !== movieData.id)
                    : [...prev, { id: movieData.id, media_type: "movie" }];
                });
              }}
              style={
                watchlist.some((m) => m.id === movieData.id)
                  ? {
                      backgroundColor: "#57EBDE",
                      color: "black",
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {watchlist.some((m) => m.id === movieData.id)
                ? "Remove From Watchlist"
                : "Add To Watchlist"}{" "}
              <TbFolderPlus
                style={
                  watchlist.some((m) => m.id === movieData.id)
                    ? {
                        color: "black",
                      }
                    : {}
                }
                color="#57EBDE"
                size={18}
              />
            </button>
          </div>

          <div className="large-screen-trailer">
            <p className="overview">
              "{showData.name}" Official Trailer
            </p>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube Trailer"
              id="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="small-screen-elements">
          <p className="overview">Genres:</p>
          <div className="genres-container">
            {showData.genres?.map((genre) => (
              <button key={genre.id}>{genre.name}</button>
            ))}
          </div>
        </div>

        <div className="labels-container">
          <label>
            Status <p>{showData.status}</p>
          </label>
          <label>
            Seasons Count <p>{showData.number_of_seasons} Seasons</p>
          </label>
          <label>
            Episodes Count <p>{showData.number_of_episodes} Ep</p>
          </label>
        </div>

        <div className="labels-container">
          <label>
            Origin Country{" "}
            {showCountry.map((c) => (
              <p key={c} style={{ marginBottom: 0 }}>
                {c}
              </p>
            ))}
          </label>
          <label>
            Release Date{" "}
            <p>
              {showData.first_air_date?.split("-")[0]} -{" "}
              {showData.last_air_date?.split("-")[0] || "Now"}
            </p>
          </label>
          <label>
            Original Language <p>{showLanguageName}</p>
          </label>
        </div>

        <div className="small-screen-trailer">
          <p className="overview">"{showData.name}" Official Trailer</p>
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="YouTube Trailer"
            id="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <label className="overview">
          Overview:
          <p>{showData.overview}</p>
        </label>

        <>
          <p className="overview">Show's Seasons:</p>

          {showData.seasons.length > 0 ? (
            <div>
              {showData.seasons.map((s) => {
                return (
                  s.poster_path && (
                    <div className="season-container">
                      <MovieCard1 key={s.id} movie={s} />
                      <div className="ep-outer-container">
                        <div className="ep-container">
                          {showData.seasons_full
                            .find((season) => season.id === s.id)
                            .episodes.map((ep) => (
                              <EpisodeCard ep={ep} />
                            ))}
                        </div>
                        <IoIosArrowForward className="ep-arrow" size={20} />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          ) : (
            <p>No Seasons Available</p>
          )}
        </>

        {showData.created_by.length ? (
          <div>
            <p className="overview">Created By:</p>
            <div className="cast-container">
              {showData.created_by.map(
                (actor) =>
                  actor.profile_path && (
                    <div className="movie-cast" key={actor.id}>
                      <img
                        src={`https://image.tmdb.org/t/p/w1280${actor.profile_path}`}
                        alt={actor.name}
                      />
                      <p>{actor.name}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : null}

        <div>
          <p className="overview">Cast:</p>
          <div className="cast-container">
            {showData.aggregate_credits?.cast
              .filter((c) => c.known_for_department === "Acting")
              .map(
                (actor) =>
                  actor.profile_path && (
                    <div className="movie-cast" key={actor.id}>
                      <img
                        src={`https://image.tmdb.org/t/p/w1280${actor.profile_path}`}
                        alt={actor.name}
                      />
                      <p>{actor.name}</p>
                      <p style={{ color: "grey" }}>
                        "{actor.roles[0].character}"
                      </p>
                    </div>
                  )
              )}
          </div>
        </div>

        <div>
          <p className="overview">Reviews:</p>
          <div className="reviews-container">
            {showData.reviews?.results?.length ? (
              showData.reviews.results.map((review, index) => (
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
          <p className="overview">Similar to "{showData.name}"</p>
          {showData.similar.results.length > 1 ? (
            <div className="trend-movieS">
              {showData.similar.results.map((movie) => {
                return <MovieCard1 key={movie.id} movie={movie} />;
              })}
            </div>
          ) : (
            <p>No Similars Available</p>
          )}
        </div>

        <div>
          <p className="overview">You Might Like As Well:</p>

          {showData.recommendations.results.length > 1 ? (
            <div className="trend-movieS">
              {showData.recommendations.results.map((movie) => {
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

export default ShowPage;

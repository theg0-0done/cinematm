import { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import MovieCard3 from "../components/MovieCard3";
import { CenimaContext } from "../context/cenimaContext";
import { API_KEY } from "../context/api";

function Movies() {
  const {
    allMovies,
    allSeries,
    inCinema,
    upComing,
    watchlist,
    topMovies,
    topTv,
  } = useContext(CenimaContext);

  const [selectedGenre, setSelectedGenre] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const { mediaType, category } = useParams();

  const dataSets = {
    movies: allMovies,
    "tv-shows": allSeries,
    "trending-lately": mediaType === "movies" ? allMovies : allSeries,
    "top-rated": mediaType === "movies" ? topMovies : topTv,
    "coming-soon": upComing,
    "in-cinema": inCinema,
  };
  const baseList = dataSets[category || mediaType] || [];

  const uniqueBaseList = [
    ...new Map(baseList.map((item) => [item.id, item])).values(),
  ];

  const resultElements = uniqueBaseList.map((el, index) => (
    <MovieCard3 key={index} movie={el} />
  ));

  const watchlistElements = watchlist.map((el, index) => (
    <MovieCard3 key={index} movie={el} />
  ));

  const searchResult = uniqueBaseList
    .filter((el) =>
      (el.title || el.name)?.toLowerCase().includes(query.toLowerCase())
    )
    .map((el, index) => <MovieCard3 key={index} movie={el} />);

  const genreFilter = uniqueBaseList
    .filter((el) => (el.genre_ids || el.genres).includes(selectedGenre?.id))
    .map((el, index) => <MovieCard3 key={index} movie={el} />);

  const languageFilter = uniqueBaseList
    .filter((el) => el.original_language === selectedLanguage)
    .map((el, index) => <MovieCard3 key={index} movie={el} />);

  function handleSearch(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchSet = {
          movies: "movie",
          "tv-shows": "tv",
        };

        // If mediaType doesn't match, stop
        if (!fetchSet[mediaType]) return;

        // Build URLs
        const genreURL = `https://api.themoviedb.org/3/genre/${fetchSet[mediaType]}/list?api_key=${API_KEY}`;
        const languagesURL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;

        // Fetch in parallel
        const [genreRes, langRes] = await Promise.all([
          fetch(genreURL),
          fetch(languagesURL),
        ]);

        const genreData = await genreRes.json();
        const langData = await langRes.json();

        setGenres(genreData.genres); // [{id, name}]
        setLanguages(langData); // [{iso_639_1, english_name, name}]
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [mediaType]);

  // console.log(selectedLanguage);

  return (
    <section className="all-movies-page">
      {mediaType !== "watchlist" && (
        <form onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            name="search"
            placeholder="Seach a movie"
            value={query}
            onChange={(e) => {
              setSelectedGenre("");
              setSelectedLanguage(null);
              setQuery(e.target.value);
            }}
          />
          <FaSearch size={22} className="search-btn" />
        </form>
      )}

      <div>
        {mediaType !== "watchlist" && (
          <div className="all-movies-header">
            <h2 className="category-title">
              {selectedGenre?.name
                ? `${selectedGenre?.name?.toUpperCase()} filtered ${mediaType}`
                : selectedLanguage
                ? `In ${selectedLanguage?.toUpperCase()} filtered ${mediaType}`
                : category
                ? `${mediaType.toUpperCase()}: ${category
                    ?.toUpperCase()
                    .split("-")
                    .join(" ")}`
                : mediaType.toUpperCase()}
            </h2>

            <div className="selects-container">
              <p>Filter By:</p>
              <select
                style={
                  selectedGenre?.name && {
                    backgroundColor: "#57EBDE",
                    color: "black",
                  }
                }
                onChange={(e) => {
                  const name = e.target.value;
                  const g = genres.find((x) => x.name === name);
                  setSelectedGenre((prev) => (prev?.id === g?.id ? {} : g));
                  setQuery("");
                  setSelectedLanguage(null);
                }}
              >
                <option value="" style={{ color: "grey" }} selected>
                  Genres
                </option>
                {genres.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>

              <select
                style={
                  selectedLanguage && {
                    backgroundColor: "#57EBDE",
                    color: "black",
                  }
                }
                onChange={(e) => {
                  const name = e.target.value;
                  const langObj = languages.find(
                    (x) => x.english_name === name
                  );
                  const iso = langObj?.iso_639_1 ?? null;
                  setSelectedLanguage((prev) => (prev === iso ? null : iso));
                  setQuery("");
                  setSelectedGenre({});
                }}
              >
                <option value="" style={{ color: "grey" }} selected>
                  Languages
                </option>
                {languages.map((l) => (
                  <option key={l.english_name} value={l.english_name}>
                    {l.english_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="all-movies">
          {mediaType === "watchlist" ? (
            watchlistElements.length > 0 ? (
              watchlistElements
            ) : (
              <p className="no-items-yet">
                No Item Added Yet...!!{" "}
                <strong>
                  <a style={{ color: "#57EBDE" }} href="/">
                    Back Home
                  </a>
                </strong>
              </p>
            )
          ) : selectedGenre?.name ? (
            genreFilter.length ? (
              genreFilter
            ) : (
              <p className="no-items-yet">
                No {mediaType} found in "{selectedGenre?.name}"
              </p>
            )
          ) : selectedLanguage ? (
            languageFilter.length ? (
              languageFilter
            ) : (
              <p className="no-items-yet">
                No {mediaType} found in "{selectedLanguage}" Language
              </p>
            )
          ) : query !== "" ? (
            searchResult.length ? (
              searchResult
            ) : (
              <p className="no-items-yet">No Results on "{query}"</p>
            )
          ) : (
            resultElements
          )}
        </div>
      </div>
    </section>
  );
}

export default Movies;

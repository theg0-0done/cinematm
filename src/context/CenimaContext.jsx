import { createContext, useEffect, useState, useRef } from "react";
import { API_KEY } from "./api";

export const CenimaContext = createContext();

export function CenimaProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [trendMovies, setTrendMovies] = useState([]);
  const [trendShows, setTrendShows] = useState([]);
  const [trendActors, setTrendActors] = useState([]);
  const [trendAll, setTrendAll] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTv, setToptv] = useState([]);
  const [inCinema, setInCinema] = useState([]);
  const [upComing, setUpComing] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [mvGenres, setMvGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchTrendingActors = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/person/week?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Could not fetch resource.");
        }

        const data = await response.json();
        setTrendActors(
          data.results.map((m) => ({ ...m, media_type: "person" }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrendingActors();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
        );

        if (!response.ok) throw new Error("Could not fetch resource.");

        const data = await response.json();

        const fetchOneBackdrop = async (item) => {
          if (item.media_type === "person")
            return { enBackdrop: null, movieTrailer: null };

          const endpoint =
            item.media_type === "movie" ? `movie/${item.id}` : `tv/${item.id}`;

          const res = await fetch(
            `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&append_to_response=images,videos`
          );

          const details = await res.json();

          // ✔ correct fallback: use details NOT data
          const enBackdrop =
            details.images?.backdrops?.find((b) => b.iso_639_1 === "en")
              ?.file_path ||
            details.images?.backdrops?.[0]?.file_path ||
            null;

          const movieTrailer =
            details.videos?.results?.find(
              (v) =>
                v.type === "Trailer" &&
                v.site === "YouTube" &&
                v.iso_639_1 === "en"
            )?.key ||
            details.videos?.results?.[0]?.key ||
            null;

          return { enBackdrop, movieTrailer };
        };

        const attach = async (list) =>
          Promise.all(
            list.map(async (item) => {
              const { enBackdrop, movieTrailer } = await fetchOneBackdrop(item);
              return {
                ...item,
                v_backdrop: enBackdrop,
                trailer: movieTrailer,
              };
            })
          );

        setTrendAll(await attach(data.results));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const c = containerRef.current;

    if (!c || !c.children.length) return;

    let index = 0;

    const interval = setInterval(() => {
      const cardWidth = c.children[0].offsetWidth;

      index++;
      c.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });

      if (index * cardWidth >= c.scrollWidth - c.clientWidth) {
        index = 0;
        c.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trendAll]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const urls = Array.from(
          { length: 100 },
          (_, i) =>
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${
              i + 1
            }`
        );

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        const allMoviesCombined = data.flatMap((page) => page.results);

        setAllMovies(
          allMoviesCombined.map((m) => ({ ...m, media_type: "movie" }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const urls = Array.from(
          { length: 100 },
          (_, i) =>
            `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${
              i + 1
            }`
        );

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        const allSeriesCombined = data.flatMap((page) => page.results);

        setAllSeries(
          allSeriesCombined.map((m) => ({ ...m, media_type: "tv" }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const endpoints = {
        nowPlaying:
          "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY,
        upcoming:
          "https://api.themoviedb.org/3/movie/upcoming?api_key=" + API_KEY,
        trending:
          "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY,
        topMovie:
          "https://api.themoviedb.org/3/movie/top_rated?api_key=" + API_KEY,
      };

      const fetchOneBackdrop = async (id) => {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=images,videos`
        );
        const data = await res.json();

        const enBackdrop =
          data.images.backdrops?.find((b) => b.iso_639_1 === "en")?.file_path ||
          data.images.backdrops?.[0]?.file_path;

        const movieTrailer =
          data.videos.results.find(
            (v) =>
              v.type === "Trailer" &&
              v.site === "YouTube" &&
              v.iso_639_1 === "en"
          )?.key || data.videos.results[0]?.key;

        return { enBackdrop, movieTrailer };
      };

      const attach = async (list) =>
        Promise.all(
          list.map(async (m) => {
            const { enBackdrop, movieTrailer } = await fetchOneBackdrop(m.id);

            return {
              ...m,
              media_type: "movie",
              v_backdrop: enBackdrop,
              trailer: movieTrailer,
            };
          })
        );

      const [nowPlaying, upcoming, trending, topMovie] = await Promise.all(
        Object.values(endpoints).map((url) => fetchManyPages(url, 10))
      );

      setInCinema(await attach(nowPlaying));
      setUpComing(await attach(upcoming));
      setTrendMovies(await attach(trending));
      setTopMovies(await attach(topMovie));
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchTV = async () => {
      const lists = {
        trending: "https://api.themoviedb.org/3/tv/popular?api_key=" + API_KEY,
        topTv: "https://api.themoviedb.org/3/tv/top_rated?api_key=" + API_KEY,
      };

      const attach = async (list) =>
        Promise.all(
          list.map((t) => ({
            ...t,
            media_type: "tv",
          }))
        );

      // fetch 10 pages for each TV list
      const [trendShowsPages, topTvPages] = await Promise.all(
        Object.values(lists).map((url) => fetchManyPages(url, 10))
      );

      setTrendShows(await attach(trendShowsPages));
      setToptv(await attach(topTvPages));
    };

    fetchTV();
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return "Unknown";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const fetchManyPages = async (baseUrl, pages = 10) => {
    const urls = Array.from(
      { length: pages },
      (_, i) => `${baseUrl}&page=${i + 1}`
    );

    const responses = await Promise.all(urls.map((u) => fetch(u)));
    const data = await Promise.all(responses.map((res) => res.json()));

    return data.flatMap((d) => d.results);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres and languages for BOTH movies and tv
        const genreMovieURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
        const genreTvURL = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;
        const languagesURL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;

        const [genreMovieRes, genreTvRes, langRes] = await Promise.all([
          fetch(genreMovieURL),
          fetch(genreTvURL),
          fetch(languagesURL),
        ]);

        const genreMovieData = await genreMovieRes.json();
        const genreTvData = await genreTvRes.json();
        const langData = await langRes.json();

        // Combine genres from both
        setMvGenres(genreMovieData.genres);
        setTvGenres(genreTvData.genres);
        setLanguages(langData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <CenimaContext.Provider
      value={{
        open,
        setOpen,
        containerRef,
        allMovies,
        allSeries,
        trendMovies,
        trendShows,
        trendActors,
        inCinema,
        formatDate,
        upComing,
        watchlist,
        setWatchlist,
        topMovies,
        topTv,
        trendAll,
        tvGenres,
        mvGenres,
        languages,
      }}
    >
      {children}
    </CenimaContext.Provider>
  );
}

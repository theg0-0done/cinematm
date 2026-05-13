import { createContext, useEffect, useState, useRef } from "react";

export const CinemaContext = createContext();

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function CinemaProvider({ children }) {
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
  const [recentlyWatched, setRecentlyWatched] = useState(() => {
    try {
      const stored = localStorage.getItem("recentlyWatched");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const addRecentlyWatched = (item) => {
    setRecentlyWatched((prev) => {
      // Remove item if it already exists to put it at the beginning
      const filtered = prev.filter((m) => m.id !== item.id);
      const updated = [item, ...filtered].slice(0, 10);
      localStorage.setItem("recentlyWatched", JSON.stringify(updated));
      return updated;
    });
  };

  const containerRef = useRef(null);

  const fetchFromTMDB = async (endpoint, params = {}) => {
    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      url.searchParams.append('api_key', API_KEY);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("TMDB Fetch Error:", error);
      return null;
    }
  };

  const fetchManyPages = async (endpoint, pages = 3, extraParams = {}) => {
    try {
      const requests = Array.from({ length: pages }, (_, i) => 
        fetchFromTMDB(endpoint, { ...extraParams, page: i + 1 })
      );
      const responses = await Promise.all(requests);
      return responses.filter(Boolean).flatMap(data => data.results || []);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchOneBackdrop = async (mediaType, id) => {
    if (mediaType === "person") return { enBackdrop: null, movieTrailer: null, logo: null };

    const details = await fetchFromTMDB(`/${mediaType}/${id}`, { append_to_response: 'images,videos' });
    if (!details) return { enBackdrop: null, movieTrailer: null, logo: null };

    const enBackdrop =
      details.images?.backdrops?.find((b) => b.iso_639_1 === "en")?.file_path ||
      details.images?.backdrops?.[0]?.file_path ||
      null;

    const logo =
      details.images?.logos?.find((l) => l.iso_639_1 === "en")?.file_path ||
      details.images?.logos?.[0]?.file_path ||
      null;

    const movieTrailer =
      details.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube" && v.iso_639_1 === "en"
      )?.key ||
      details.videos?.results?.[0]?.key ||
      null;

    return { enBackdrop, movieTrailer, logo };
  };

  const attachMediaDetails = async (list, defaultMediaType) => {
    if (!list || list.length === 0) return [];
    
    // We only attach to the first few to avoid API rate limits since this loops over all items
    // If you need more, you can increase this, but for now 20 is safe
    const limitedList = list.slice(0, 20); 
    
    return Promise.all(
      limitedList.map(async (item) => {
        const type = item.media_type || defaultMediaType;
        const { enBackdrop, movieTrailer, logo } = await fetchOneBackdrop(type, item.id);
        return {
          ...item,
          media_type: type,
          v_backdrop: enBackdrop,
          trailer: movieTrailer,
          logo: logo,
        };
      })
    );
  };

  // 1. Initial Data (Genres, Languages, Trending Actors)
  useEffect(() => {
    const fetchInitialData = async () => {
      const [genreMovieData, genreTvData, langData, actorsData] = await Promise.all([
        fetchFromTMDB('/genre/movie/list'),
        fetchFromTMDB('/genre/tv/list'),
        fetchFromTMDB('/configuration/languages'),
        fetchFromTMDB('/trending/person/week')
      ]);

      if (genreMovieData?.genres) setMvGenres(genreMovieData.genres);
      if (genreTvData?.genres) setTvGenres(genreTvData.genres);
      if (langData) setLanguages(langData);
      if (actorsData?.results) {
        setTrendActors(actorsData.results.map((m) => ({ ...m, media_type: "person" })));
      }
    };
    fetchInitialData();
  }, []);

  // 2. Discover Movies & Series
  useEffect(() => {
    const fetchDiscover = async () => {
      const movies = await fetchManyPages('/discover/movie', 5); // Fetching 5 pages instead of 100
      setAllMovies(movies.map((m) => ({ ...m, media_type: "movie" })));

      const series = await fetchManyPages('/discover/tv', 5); // Fetching 5 pages instead of 100
      setAllSeries(series.map((m) => ({ ...m, media_type: "tv" })));
    };
    fetchDiscover();
  }, []);

  // 3. Movies Dashboard
  useEffect(() => {
    const fetchMoviesDashboard = async () => {
      const np = await fetchManyPages('/movie/now_playing', 2);
      const up = await fetchManyPages('/movie/upcoming', 2);
      const tm = await fetchManyPages('/trending/movie/day', 2);
      const top = await fetchManyPages('/movie/top_rated', 2);

      setInCinema(await attachMediaDetails(np, 'movie'));
      setUpComing(await attachMediaDetails(up, 'movie'));
      setTrendMovies(await attachMediaDetails(tm, 'movie'));
      setTopMovies(await attachMediaDetails(top, 'movie'));
    };
    fetchMoviesDashboard();
  }, []);

  // 4. TV Dashboard
  useEffect(() => {
    const fetchTvDashboard = async () => {
      const trends = await fetchManyPages('/tv/popular', 2);
      const tops = await fetchManyPages('/tv/top_rated', 2);

      setTrendShows(trends.map(t => ({...t, media_type: "tv"})));
      setToptv(tops.map(t => ({...t, media_type: "tv"})));
    };
    fetchTvDashboard();
  }, []);

  // 5. Trending All
  useEffect(() => {
    const fetchTrendingAll = async () => {
      const data = await fetchFromTMDB('/trending/all/day');
      if (data?.results) {
        setTrendAll(await attachMediaDetails(data.results));
      }
    };
    fetchTrendingAll();
  }, []);

  // Auto Slider for Hero
  useEffect(() => {
    const c = containerRef.current;
    if (!c || !c.children.length) return;

    let index = 0;
    const interval = setInterval(() => {
      const cardWidth = c.children[0].offsetWidth;
      index++;
      c.scrollTo({ left: index * cardWidth, behavior: "smooth" });

      if (index * cardWidth >= c.scrollWidth - c.clientWidth) {
        index = 0;
        c.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trendAll]);

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

  return (
    <CinemaContext.Provider
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
        recentlyWatched,
        addRecentlyWatched,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
}

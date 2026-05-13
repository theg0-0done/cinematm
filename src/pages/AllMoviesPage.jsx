import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../components/Loading";
import { useParams, Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { CinemaContext } from "../context/CinemaContext";

const supportedCategories = ["trending-lately", "top-rated"];

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const SORT_OPTIONS = [
  { value: "popularity.desc",    label: "Most Popular" },
  { value: "vote_average.desc",  label: "Highest Rated" },
  { value: "revenue.desc",       label: "Highest Revenue" },
  { value: "release_date.desc",  label: "Newest First" },
  { value: "release_date.asc",   label: "Oldest First" },
];

function Movies() {
  const {
    watchlist,
    languages,
    mvGenres,
    tvGenres,
  } = useContext(CinemaContext);

  const [searchParams] = useSearchParams();
  const keywordId   = searchParams.get("with_keywords") || null;
  const keywordName = searchParams.get("keyword_name")  || null;
  const genreIdParam   = searchParams.get("genre_id")   || null;
  const genreNameParam = searchParams.get("genre_name") || null;

  // Pre-select genre from URL param (from GenreShowcaseSection click)
  const genreParamApplied = useRef(false);

  const [selectedGenre, setSelectedGenre]       = useState(
    genreIdParam ? { id: Number(genreIdParam), name: genreNameParam || "" } : null
  );
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [sortBy, setSortBy]                     = useState("popularity.desc");
  const [yearFrom, setYearFrom]                 = useState("");
  const [yearTo, setYearTo]                     = useState("");
  const [minVotes, setMinVotes]                 = useState("");
  const [query, setQuery]                       = useState("");
  const [debouncedQuery, setDebouncedQuery]     = useState("");
  const [watchlistItems, setWatchlistItems]     = useState([]);

  // Server-side data state
  const [results, setResults]       = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading]   = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { mediaType, category } = useParams();
  const genres    = mediaType === "movies" ? mvGenres : tvGenres;
  const tmdbType  = mediaType === "movies" ? "movie" : "tv";

  // Debounce search query
  const debounceTimer = useRef(null);
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // Build the TMDB API URL
  const buildUrl = useCallback((pageNum) => {
    const url = new URL(`${BASE_URL}`);

    if (debouncedQuery.trim()) {
      url.pathname += `/search/${tmdbType}`;
      url.searchParams.set("query", debouncedQuery.trim());
    } else if (category === "trending-lately") {
      url.pathname += `/trending/${tmdbType}/day`;
    } else if (category === "top-rated") {
      url.pathname += `/${tmdbType}/top_rated`;
    } else {
      url.pathname += `/discover/${tmdbType}`;
      url.searchParams.set("sort_by", sortBy);

      if (selectedGenre?.id)   url.searchParams.set("with_genres", selectedGenre.id);
      if (selectedLanguage)    url.searchParams.set("with_original_language", selectedLanguage);
      if (keywordId)           url.searchParams.set("with_keywords", keywordId);
      if (minVotes)            url.searchParams.set("vote_count.gte", minVotes);

      // Year range
      const dateFrom = yearFrom ? `${yearFrom}-01-01` : null;
      const dateTo   = yearTo   ? `${yearTo}-12-31`   : null;
      const dateGteKey = tmdbType === "movie" ? "primary_release_date.gte" : "first_air_date.gte";
      const dateLteKey = tmdbType === "movie" ? "primary_release_date.lte" : "first_air_date.lte";
      if (dateFrom) url.searchParams.set(dateGteKey, dateFrom);
      if (dateTo)   url.searchParams.set(dateLteKey, dateTo);
    }

    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("page", pageNum);

    return url.toString();
  }, [debouncedQuery, selectedGenre, selectedLanguage, sortBy, yearFrom, yearTo, minVotes, keywordId, tmdbType, category]);

  // Fetch first page whenever filters/search change
  useEffect(() => {
    if (mediaType === "watchlist" || (category && !supportedCategories.includes(category))) return;

    const fetchFirstPage = async () => {
      setIsLoading(true);
      setResults([]);
      setPage(1);
      try {
        const res  = await fetch(buildUrl(1));
        const data = await res.json();
        const mapped = (data.results || []).map((m) => ({ ...m, media_type: tmdbType }));
        setResults(mapped);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("TMDB fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirstPage();
  }, [debouncedQuery, selectedGenre, selectedLanguage, sortBy, yearFrom, yearTo, minVotes, keywordId, mediaType, category, buildUrl, tmdbType]);

  // Load more on scroll
  const loadMore = useCallback(async () => {
    if (isLoadingMore || isLoading || page >= totalPages) return;
    if (mediaType === "watchlist" || (category && !supportedCategories.includes(category))) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res  = await fetch(buildUrl(nextPage));
      const data = await res.json();
      const mapped = (data.results || []).map((m) => ({ ...m, media_type: tmdbType }));
      setResults((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...prev, ...mapped.filter((m) => !ids.has(m.id))];
      });
      setPage(nextPage);
    } catch (err) {
      console.error("TMDB load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, isLoading, page, totalPages, buildUrl, mediaType, category, tmdbType]);

  // Infinite scroll detector
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  // Watchlist fetching
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const urls = watchlist.map(
          (item) => `${BASE_URL}/${item.media_type}/${item.id}?api_key=${API_KEY}`
        );
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data      = await Promise.all(responses.map((res) => res.json()));
        const withMediaType = data.map((item, i) => ({ ...item, media_type: watchlist[i].media_type }));
        setWatchlistItems(withMediaType);
      } catch (error) {
        console.error(error);
      }
    };

    if (watchlist.length > 0) fetchWatchlist();
    else setWatchlistItems([]);
  }, [watchlist]);

  const clearFilters = () => {
    setQuery("");
    setSelectedGenre(null);
    setSelectedLanguage(null);
    setSortBy("popularity.desc");
    setYearFrom("");
    setYearTo("");
    setMinVotes("");
  };

  const hasActiveFilter = query || selectedGenre || selectedLanguage || sortBy !== "popularity.desc" || yearFrom || yearTo || minVotes || keywordId;

  const displayTitle = () => {
    if (mediaType === "watchlist")         return "Your Watchlist";
    if (keywordName)                       return `#${keywordName}`;
    if (selectedGenre?.name)               return `${selectedGenre.name} ${mediaType}`;
    if (category === "trending-lately")    return `Trending ${mediaType}`;
    if (category === "top-rated")          return `Top Rated ${mediaType}`;
    if (category)                          return category.replace(/-/g, " ");
    return mediaType;
  };

  const renderCard = (el, index) => <MovieCard key={el.id || index} movie={el} layout="grid" showRemove={mediaType === "watchlist"} />;

  const selectCls = "bg-black/40 border border-white/10 text-white px-[12px] pr-[28px] h-[40px] rounded-full text-[0.85rem] outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_top_50%] bg-[length:10px_auto] transition-all duration-300 focus:border-[#00c3ff]";

  return (
    <section className="pt-[100px] px-[10px] pb-[60px] md:pt-[90px] md:px-[20px] md:pb-[40px] min-h-screen bg-transparent text-white">
      <div className="max-w-[1400px] mx-auto w-full">
        {mediaType !== "watchlist" && (
          <div className="flex flex-col items-center gap-[20px] mb-[40px]">
            <h2 className="text-[2.5rem] font-extrabold m-0 text-white capitalize text-center drop-shadow-md">
              {displayTitle()}
            </h2>

            {/* Keyword badge */}
            {keywordName && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/30 text-[#00c3ff] text-[0.85rem] font-semibold">
                Filtered by keyword: <span className="font-bold">#{keywordName}</span>
                <Link to={`/${mediaType}`} onClick={() => window.scrollTo({ top: 0 })} className="ml-1 text-gray-400 hover:text-white transition-colors">
                  <FaTimes size={12} />
                </Link>
              </div>
            )}

            {!category && (
              <div className="flex flex-wrap justify-center items-center gap-[10px] w-full max-w-[960px] p-[12px] shadow-lg">
                {/* Search */}
                <form
                  className="flex items-center bg-black/40 border border-white/10 rounded-full px-[15px] h-[40px] flex-1 min-w-[180px] transition-all duration-300 focus-within:shadow-[0_0_10px_rgba(0,195,255,0.3)] focus-within:border-[#00c3ff]"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="flex-1 bg-transparent border-none py-[8px] text-[0.9rem] text-white outline-none placeholder:text-gray-500"
                    type="text"
                    placeholder={`Search ${mediaType}...`}
                    value={query}
                    onChange={(e) => { setSelectedGenre(null); setSelectedLanguage(null); setQuery(e.target.value); }}
                  />
                  {query ? (
                    <button type="button" onClick={() => setQuery("")} className="text-gray-400 bg-transparent border-none cursor-pointer p-[5px] transition-colors hover:text-[#00c3ff]">
                      <FaTimes size={13} />
                    </button>
                  ) : (
                    <IoSearchOutline size={14} className="text-gray-400" />
                  )}
                </form>

                <div className="flex gap-2 w-full">
                {/* Genre */}
                <select className={`${selectCls} ${selectedGenre?.name ? "border-[#00c3ff] text-[#00c3ff]" : ""}`}
                  value={selectedGenre?.name || ""}
                  onChange={(e) => { const g = genres.find((x) => x.name === e.target.value); setSelectedGenre(g || null); setQuery(""); setSelectedLanguage(null); }}>
                  <option value="" className="bg-[#1a1c22]">All Genres</option>
                  {genres?.map((g) => <option key={g.id} value={g.name} className="bg-[#1a1c22]">{g.name}</option>)}
                </select>

                {/* Language */}
                <select className={`${selectCls} ${selectedLanguage ? "border-[#00c3ff] text-[#00c3ff]" : ""}`}
                  value={selectedLanguage || ""}
                  onChange={(e) => { const langObj = languages.find((x) => x.english_name === e.target.value); setSelectedLanguage(langObj?.iso_639_1 ?? null); setQuery(""); setSelectedGenre(null); }}>
                  <option value="" className="bg-[#1a1c22]">All Languages</option>
                  {languages?.map((l) => <option key={l.english_name} value={l.english_name} className="bg-[#1a1c22]">{l.english_name}</option>)}
                </select>

                </div>
                {/* Clear */}
                {hasActiveFilter && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-[6px] px-[15px] h-[40px] rounded-full text-[0.85rem] border border-[#00c3ff]/50 text-[#00c3ff] bg-[#00c3ff]/10 cursor-pointer transition-all hover:bg-[#00c3ff]/20"
                  >
                    <FaTimes size={12} /> Clear
                  </button>
                )}
              </div>
            )}

            {/* Search context label */}
            {!category && debouncedQuery && (
              <p className="text-gray-400 text-[0.9rem]">
                Searching TMDB for <span className="text-[#00c3ff] font-semibold">"{debouncedQuery}"</span>...
              </p>
            )}
          </div>
        )}

        {mediaType === "watchlist" && (
          <h2 className="text-[2.5rem] font-extrabold mb-[40px] text-white capitalize text-center drop-shadow-md">
            {displayTitle()}
          </h2>
        )}

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-[20px] w-full">
          {mediaType === "watchlist" ? (
            watchlistItems.length > 0 ? (
              watchlistItems.map(renderCard)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-[100px] px-[20px] bg-white/[0.03] border border-white/[0.08] rounded-[24px] backdrop-blur-md">
                <div className="w-[80px] h-[80px] rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <FiAlertCircle size={40} className="text-gray-500" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">Your watchlist is empty</h3>
                <p className="text-gray-500 text-[1rem] max-w-[300px] text-center mb-8 leading-relaxed">
                  Start adding movies and shows to keep track of what you want to watch.
                </p>
                <Link 
                  to="/" 
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white no-underline overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,195,255,0.3)] active:scale-95"
                  style={{ background: "linear-gradient(135deg, #00c3ff, #0088ff)" }}
                >
                  <span className="relative z-10">Browse Recommendations</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
              </div>
            )
          ) : isLoading ? (
            <div className="col-span-full"><Loading /></div>
          ) : results.length > 0 ? (
            results.map(renderCard)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-[80px] px-[20px] bg-white/[0.02] border border-white/[0.05] rounded-[24px]">
              <div className="w-[64px] h-[64px] rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/5">
                <IoSearchOutline size={30} className="text-gray-600" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-500 text-[0.95rem] max-w-[300px] text-center leading-relaxed">
                We couldn't find any {mediaType} matching {debouncedQuery ? `"${debouncedQuery}"` : "your filters"}.
              </p>
            </div>
          )}

          {/* Load more spinner */}
          {isLoadingMore && (
            <div className="col-span-full flex justify-center items-center py-[40px] gap-[12px]">
              <Loading small />
              <span className="text-[1rem] text-[#00c3ff] font-medium tracking-wide">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Movies;

import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { CinemaContext } from "../context/CinemaContext";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const TYPE_META = {
  movie:  { label: "Movie",  emoji: "🎬", route: (id) => `/movie/${id}` },
  tv:     { label: "Show",   emoji: "📺", route: (id) => `/tv/${id}`    },
  person: { label: "Person", emoji: "🧑", route: (id) => `/actor/${id}` },
};

function NavBar() {
  const { open, setOpen } = useContext(CinemaContext);
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen]       = useState(false);
  const [query, setQuery]                 = useState("");
  const [debouncedQuery, setDebouncedQ]   = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searched yet
  const [searching, setSearching]         = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  const inputRef     = useRef(null);
  const dropdownRef  = useRef(null);
  const debounceRef  = useRef(null);

  const handleScroll = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(query), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Search
  useEffect(() => {
    if (!debouncedQuery.trim()) { setSearchResults(null); return; }
    setSearching(true);
    fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(debouncedQuery)}&page=1`)
      .then((r) => r.json())
      .then((d) => {
        // Group by media_type
        const grouped = { movie: [], tv: [], person: [] };
        (d.results || []).slice(0, 15).forEach((item) => {
          if (grouped[item.media_type]) grouped[item.media_type].push(item);
        });
        setSearchResults(grouped);
      })
      .catch(() => setSearchResults(null))
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  // Close on Escape / outside click
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeSearch(); };
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current    && !inputRef.current.contains(e.target)
      ) closeSearch();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    const handleScrollState = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScrollState);
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setSearchResults(null);
  };

  const handleResultClick = (item) => {
    closeSearch();
    const meta = TYPE_META[item.media_type];
    if (meta) { navigate(meta.route(item.id)); window.scrollTo({ top: 0 }); }
  };

  const hasResults = searchResults && Object.values(searchResults).some((arr) => arr.length > 0);

  return (
    <nav className="fixed top-0 left-0 w-full px-[20px] py-[15px] md:px-[40px] md:py-[18px] flex justify-between items-center z-[1000] transition-all duration-500">
      {/* Premium Faded Background Layer */}
      <div 
        className={`absolute top-0 left-0 w-full h-[140%] -z-10 transition-all duration-500 pointer-events-none
          ${scrolled ? "backdrop-blur-xl opacity-100" : "opacity-100"} 
          bg-gradient-to-b from-black/95 via-black/50 to-transparent`}
        style={scrolled ? {
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)"
        } : {}}
      />
      
      {/* Subtle border bottom (only visible on scroll) */}
      {/* <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-white/10 transition-opacity duration-500 pointer-events-none ${scrolled ? "opacity-100" : "opacity-0"}`} /> */}

      <Link onClick={handleScroll} to="/" className="text-[1.4rem] lg:text-[1.8rem] font-extrabold text-[var(--text-main)] tracking-[1px] shrink-0">
        Cinema<span className="text-[var(--accent-blue)]">TM</span>
      </Link>

      <div className="hidden lg:flex gap-[30px]">
        {["Home,/", "Movies,/movies", "TV Shows,/tv-shows", "Watchlist,/watchlist"].map((item) => {
          const [label, to] = item.split(",");
          return (
            <Link key={to} onClick={handleScroll}
              className="text-[var(--text-muted)] text-[1rem] font-medium transition-colors duration-300 relative lg:hover:text-[var(--text-main)] after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--accent-blue)] after:-bottom-1 after:left-0 after:transition-all after:duration-300 lg:hover:after:w-full"
              to={to}>{label}</Link>
          );
        })}
      </div>

      <div className="hidden lg:flex gap-[12px] items-center">
        {/* Search toggle */}
        <div className="relative">
          <div className={`flex items-center gap-2 transition-all duration-300 ${searchOpen ? "w-[280px]" : "w-auto"}`}>
            {searchOpen ? (
              <div className="flex items-center w-full bg-black/50 border border-white/15 rounded-full px-4 h-[38px] focus-within:border-[#00c3ff] focus-within:shadow-[0_0_12px_rgba(0,195,255,0.2)] transition-all">
                <IoSearchOutline size={15} className="text-gray-400 shrink-0 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, shows, people..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-[0.9rem] placeholder:text-gray-500"
                />
                <button onClick={closeSearch} className="text-gray-500 lg:hover:text-white transition-colors cursor-pointer ml-2">
                  <FaTimes size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={openSearch}
                className="flex items-center gap-2 text-gray-400 lg:hover:text-white transition-colors cursor-pointer px-3 py-[6px] rounded-full border border-transparent lg:hover:border-white/10 lg:hover:bg-white/5"
              >
                <IoSearchOutline size={18} />
                <span className="text-[0.88rem] font-medium">Search</span>
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {searchOpen && (debouncedQuery.trim()) && (
            <div
              ref={dropdownRef}
              className="absolute top-[calc(100%+10px)] right-0 w-[400px] max-h-[520px] overflow-y-auto bg-[#0f1117]/95 backdrop-blur-xl border border-white/10 rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-[2000] [scrollbar-width:thin] [scrollbar-color:#00c3ff_transparent]"
            >
              {searching ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <div className="w-5 h-5 border-2 border-[#00c3ff] border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400 text-[0.85rem]">Searching...</span>
                </div>
              ) : !hasResults ? (
                <div className="py-8 text-center text-gray-500 text-[0.9rem]">
                  No results for "<span className="text-white">{debouncedQuery}</span>"
                </div>
              ) : (
                <div className="p-3 flex flex-col gap-1">
                  {Object.entries(TYPE_META).map(([type, meta]) => {
                    const items = searchResults?.[type] || [];
                    if (items.length === 0) return null;
                    return (
                      <div key={type}>
                        {/* Category header */}
                        <div className="flex items-center gap-2 px-3 py-2 mt-1">
                          <span className="text-[0.65rem] font-black text-[#00c3ff] uppercase tracking-[0.2em]">
                            {meta.emoji} {meta.label}s
                          </span>
                          <div className="flex-1 h-[1px] bg-white/5" />
                        </div>

                        {items.slice(0, 4).map((item) => {
                          const title = item.title || item.name || "Unknown";
                          const year  = (item.release_date || item.first_air_date || "").slice(0, 4);
                          const thumb = item.poster_path || item.profile_path;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick(item)}
                              className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] lg:hover:bg-white/[0.06] transition-all cursor-pointer text-left group/result"
                            >
                              {/* Thumbnail */}
                              <div className="w-[36px] h-[52px] rounded-[6px] overflow-hidden bg-white/5 border border-white/5 shrink-0">
                                {thumb ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w92${thumb}`}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/20 text-lg">
                                    {meta.emoji}
                                  </div>
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-[0.88rem] font-semibold truncate lg:group-hover/result:text-[#00c3ff] transition-colors">
                                  {title}
                                </div>
                                <div className="flex items-center gap-2 mt-[2px]">
                                  <span className="text-[0.68rem] bg-white/8 border border-white/10 text-gray-500 px-2 py-[1px] rounded-full font-medium">
                                    {meta.emoji} {meta.label}
                                  </span>
                                  {year && <span className="text-[0.7rem] text-gray-600">{year}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <Link onClick={handleScroll} className="text-[var(--text-main)] font-medium" to="/authenticate/log-in">Log In</Link>
        <Link onClick={handleScroll} className="bg-[var(--accent-blue)] text-white px-[20px] py-[8px] rounded-[20px] font-semibold transition-colors duration-300 lg:hover:bg-[var(--accent-hover)]" to="/authenticate/register">Register</Link>
      </div>
 
      {/* Mobile menu toggle (Arrow Icon) */}
      <button 
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 z-[1002] transition-all lg:hover:bg-white/10 active:scale-90"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00c3ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>
 
      {/* Mobile Sidebar (Glassy Drawer) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      
      <div className={`fixed top-0 right-0 w-[75vw] md:w-[50vw] h-screen bg-[#080810]/80 backdrop-blur-2xl border-l border-white/10 flex flex-col p-8 transition-transform duration-500 ease-out z-[1001] lg:hidden ${open ? "translate-x-0 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]" : "translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="mb-12 mt-4 flex items-center justify-between">
          <Link onClick={() => setOpen(false)} to="/" className="text-[1.5rem] font-extrabold text-white tracking-[1px]">
            Cinema<span className="text-[#00c3ff]">TM</span>
          </Link>
        </div>
 
        {/* Primary Links */}
        <div className="flex flex-col gap-6">
          {[
            { label: "Home", to: "/" },
            { label: "Movies", to: "/movies" },
            { label: "TV Shows", to: "/tv-shows" },
            { label: "Watchlist", to: "/watchlist" },
          ].map((link) => (
            <Link 
              key={link.to}
              className="text-[1.1rem] font-medium text-gray-300 lg:hover:text-[#00c3ff] transition-colors"
              onClick={() => setOpen(false)} 
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>
 
        {/* CTA Buttons (Bottom) */}
        <div className="mt-auto flex flex-col gap-4 pb-4">
          <Link 
            className="w-full py-3 text-center text-white font-medium border border-white/10 rounded-full bg-white/5 lg:hover:bg-white/10 transition-all" 
            onClick={() => setOpen(false)} 
            to="/authenticate/log-in"
          >
            Log in
          </Link>
          <Link 
            className="w-full py-3 text-center text-white font-bold rounded-full bg-[#00c3ff] shadow-[0_8px_20px_rgba(0,195,255,0.3)] lg:hover:bg-[#00d8ff] transition-all" 
            onClick={() => setOpen(false)} 
            to="/authenticate/register"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

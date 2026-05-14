import { useContext, useState, useEffect, useRef } from "react";
import { CinemaContext } from "../context/CinemaContext";
import MovieCard from "../components/MovieCard";
import MovieReview from "../components/MovieReview";
import GenreShowcaseSection from "../components/GenreShowcaseSection";
import CinematicMarketingBanner from "../components/CinematicMarketingBanner";
import CommunityInviteBanner from "../components/CommunityInviteBanner";
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa";

/* ─────────────────────────────────────────────
   ALL SUB-COMPONENTS DEFINED OUTSIDE Home()
   so React never sees them as "new" types
   on re-renders caused by activeIndex changes.
───────────────────────────────────────────── */

const SectionHeader = ({ title, linkTo }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-white text-base font-bold uppercase tracking-widest">{title}</h3>
    {linkTo && (
      <Link
        onClick={() => window.scrollTo({ top: 0 })}
        to={linkTo}
        className="flex items-center gap-1 text-[#00c3ff] text-xs font-semibold no-underline lg:hover:underline"
      >
        See All <IoIosArrowForward size={13} />
      </Link>
    )}
  </div>
);

const CarouselSection = ({ title, linkTo, items, refEl, layout = "vertical", onScrollLeft, onScrollRight }) => (
  <div className="py-8 px-5 md:px-14 overflow-hidden">
    <SectionHeader title={title} linkTo={linkTo} />
    <div className="relative group">
      <button
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollLeft}
      >
        <IoIosArrowBack size={20} />
      </button>

      <div
        className="flex gap-3 overflow-x-auto overflow-y-visible py-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        ref={refEl}
      >
        {items
          .filter((item) => item.poster_path || item.backdrop_path)
          .map((item) => (
            <div key={item.id} className="snap-start shrink-0">
              <MovieCard movie={item} layout={layout} />
            </div>
          ))}
      </div>

      <button
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollRight}
      >
        <IoIosArrowForward size={20} />
      </button>
    </div>
  </div>
);

const BannerCard = ({ movie }) => {
  const mediaType = movie.media_type || "movie";
  const title     = movie.title || movie.name || "";
  const date      = movie.release_date || movie.first_air_date || "";
  const year      = date.slice(0, 4);
  const rating    = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const backdrop  = movie.v_backdrop || movie.backdrop_path;
  if (!backdrop) return null;
  return (
    <Link
      to={`/${mediaType}/${movie.id}`}
      className="block relative w-[calc(100vw-2.5rem)] md:w-[640px] aspect-[16/9] rounded-[14px] overflow-hidden shrink-0 snap-center no-underline group/banner border border-white/[0.07]"
    >
      <img
        src={`https://image.tmdb.org/t/p/w780${backdrop}`}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 lg:group-hover/banner:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-bold text-base leading-tight mb-1 line-clamp-1">{title}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          {rating && (
            <span className="flex items-center gap-1 text-[#ffd700] font-semibold">
              <FaStar size={10} /> {rating}
            </span>
          )}
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
};

const BannerCarouselSection = ({ title, items, refEl, onScrollLeft, onScrollRight }) => (
  <div className="py-8 px-5 md:px-14 overflow-hidden">
    <SectionHeader title={title} />
    <div className="relative group">
      <button
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollLeft}
      >
        <IoIosArrowBack size={20} />
      </button>
      <div
        className="flex gap-3 overflow-x-auto overflow-y-visible pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        ref={refEl}
      >
        {items
          .filter((m) => m.v_backdrop || m.backdrop_path)
          .map((movie) => (
            <BannerCard key={movie.id} movie={movie} />
          ))}
      </div>
      <button
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollRight}
      >
        <IoIosArrowForward size={20} />
      </button>
    </div>
  </div>
);

const ActorsCarousel = ({ actors, refEl, onScrollLeft, onScrollRight }) => (
  <div className="py-8 px-5 md:px-14 overflow-hidden">
    <SectionHeader title="Trending Actors" />
    <div className="relative group">
      <button
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollLeft}
      >
        <IoIosArrowBack size={20} />
      </button>
      <div
        className="flex gap-3 overflow-x-auto overflow-y-visible pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        ref={refEl}
      >
        {actors.map(
          (actor) =>
            actor.profile_path && (
              <Link
                to={`/actor/${actor.id}`}
                key={actor.id}
                className="relative shrink-0 w-[130px] md:w-[160px] aspect-[2/3] rounded-[14px] overflow-hidden group/cast cursor-pointer border border-white/5 transition-all duration-300 lg:hover:border-[#00c3ff]/30 lg:hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] snap-start no-underline"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-full object-cover transition-transform duration-700 lg:group-hover/cast:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/10 to-transparent flex flex-col justify-end p-3">
                  <div className="font-bold text-[0.8rem] text-white leading-tight">{actor.name}</div>
                  <div className="text-gray-400 text-[0.65rem] font-medium mt-0.5 truncate">
                    {actor.known_for?.[0]?.title || actor.known_for?.[0]?.name || "Actor"}
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
      <button
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white opacity-0 lg:group-hover:opacity-100 transition-all lg:hover:bg-[#00c3ff]"
        onClick={onScrollRight}
      >
        <IoIosArrowForward size={20} />
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */

function Home() {
  const {
    trendMovies,
    trendShows,
    trendActors,
    inCinema,
    upComing,
    trendAll,
    topMovies,
    topTv,
    recentlyWatched,
  } = useContext(CinemaContext);

  const [activeIndex, setActiveIndex] = useState(0);

  const trendMoviesRef     = useRef(null);
  const trendShowsRef      = useRef(null);
  const topMoviesRef       = useRef(null);
  const topTvRef           = useRef(null);
  const inCinemaRef        = useRef(null);
  const upComingRef        = useRef(null);
  const trendActorsRef     = useRef(null);
  const recentlyWatchedRef = useRef(null);
  const thumbContainerRef  = useRef(null);

  const heroMovies = trendAll.slice(0, 10);
  const heroCount  = heroMovies.length;

  const goPrev = () => setActiveIndex((p) => (p - 1 + heroCount) % heroCount);
  const goNext = () => setActiveIndex((p) => (p + 1) % heroCount);

  /* auto-advance hero */
  useEffect(() => {
    if (heroCount === 0) return;
    const id = setInterval(() => setActiveIndex((p) => (p + 1) % heroCount), 6000);
    return () => clearInterval(id);
  }, [heroCount]);

  /* keep active thumbnail centred in the strip */
  useEffect(() => {
    const container = thumbContainerRef.current;
    if (!container || !container.children[activeIndex]) return;
    const containerRect = container.getBoundingClientRect();
    const childRect = container.children[activeIndex].getBoundingClientRect();
    container.scrollTo({
      left: container.scrollLeft + childRect.left - containerRect.left - containerRect.width / 2 + childRect.width / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  /* scroll a carousel ref by one viewport-width */
  const makeScrollHandler = (ref, dir) => () => {
    if (!ref.current) return;
    const el = ref.current;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section className="relative">

      {/* ── 1. HERO SLIDER ── */}
      <div className="relative isolate w-full h-[800px] lg:h-[700px] lg:mt-[7vh] mb-8 overflow-hidden">
        {heroMovies.map((m, i) => (
          <div
            key={m.id || m.name}
            className={`absolute inset-0 transition-opacity duration-700 ${i === activeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
          >
            <MovieReview movie={m} onPrev={goPrev} onNext={goNext} />
          </div>
        ))}

        {/* ── Dot indicators: mobile & tablet only (hidden lg+) ── */}
        <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {heroMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex ? "w-6 bg-[#00c3ff]" : "w-1.5 bg-white/40 lg:hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Poster thumbnail strip: large screens only (hidden below lg) ── */}
        <div
          ref={thumbContainerRef}
          className="hidden lg:flex absolute bottom-0 left-0 w-full gap-4 z-20 overflow-x-auto px-[5%] py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {heroMovies.map((m, i) => (
            <div
              key={`thumb-${m.id}`}
              onClick={() => setActiveIndex(i)}
              className={`min-w-[120px] h-[190px] rounded-[10px] overflow-hidden mb-4 relative cursor-pointer border-2 shrink-0 transition-all duration-300 lg:hover:scale-105 ${
                i === activeIndex
                  ? "border-[#00c3ff] shadow-[0_8px_24px_rgba(0,195,255,0.45)] scale-110 -translate-y-2 z-[2]"
                  : "border-transparent opacity-60 lg:hover:opacity-90"
              }`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title || m.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. CONTINUE WATCHING ── */}
      {recentlyWatched && recentlyWatched.length > 0 && (
        <CarouselSection
          title="Continue Watching"
          items={recentlyWatched}
          refEl={recentlyWatchedRef}
          layout="recently_watched"
          onScrollLeft={makeScrollHandler(recentlyWatchedRef, "left")}
          onScrollRight={makeScrollHandler(recentlyWatchedRef, "right")}
        />
      )}

      {/* ── 3. TRENDING MOVIES ── */}
      <CarouselSection
        title="Trending Movies"
        linkTo="movies/trending-lately"
        items={trendMovies}
        refEl={trendMoviesRef}
        onScrollLeft={makeScrollHandler(trendMoviesRef, "left")}
        onScrollRight={makeScrollHandler(trendMoviesRef, "right")}
      />

      {/* ── 5. TRENDING TV SHOWS ── */}
      <CarouselSection
        title="Trending TV Shows"
        linkTo="tv-shows/trending-lately"
        items={trendShows}
        refEl={trendShowsRef}
        onScrollLeft={makeScrollHandler(trendShowsRef, "left")}
        onScrollRight={makeScrollHandler(trendShowsRef, "right")}
      />

      {/* ── 4. COMMUNITY BANNER ── */}
      <CommunityInviteBanner />

      {/* ── 6. GENRES ── */}
      <GenreShowcaseSection />

      {/* ── 7. TOP-RATED MOVIES ── */}
      <CarouselSection
        title="Top-Rated Movies"
        linkTo="movies/top-rated"
        items={topMovies}
        refEl={topMoviesRef}
        onScrollLeft={makeScrollHandler(topMoviesRef, "left")}
        onScrollRight={makeScrollHandler(topMoviesRef, "right")}
      />

      {/* ── 9. TOP-RATED TV SHOWS ── */}
      <CarouselSection
        title="Top-Rated TV Shows"
        linkTo="tv-shows/top-rated"
        items={topTv}
        refEl={topTvRef}
        onScrollLeft={makeScrollHandler(topTvRef, "left")}
        onScrollRight={makeScrollHandler(topTvRef, "right")}
      />

      {/* ── 8. CINEMATIC MARKETING BANNER ── */}
      <CinematicMarketingBanner />

      {/* ── 10. IN CINEMAS ── */}
      <BannerCarouselSection
        title="In Cinemas"
        items={inCinema}
        refEl={inCinemaRef}
        onScrollLeft={makeScrollHandler(inCinemaRef, "left")}
        onScrollRight={makeScrollHandler(inCinemaRef, "right")}
      />

      {/* ── 11. TRENDING ACTORS ── */}
      <ActorsCarousel
        actors={trendActors}
        refEl={trendActorsRef}
        onScrollLeft={makeScrollHandler(trendActorsRef, "left")}
        onScrollRight={makeScrollHandler(trendActorsRef, "right")}
      />

      {/* ── 12. COMING SOON ── */}
      <BannerCarouselSection
        title="Coming Soon"
        items={upComing}
        refEl={upComingRef}
        onScrollLeft={makeScrollHandler(upComingRef, "left")}
        onScrollRight={makeScrollHandler(upComingRef, "right")}
      />

    </section>
  );
}

export default Home;

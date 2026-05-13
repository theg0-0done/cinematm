import { useParams, Link } from "react-router-dom";
import { FaStar, FaPlay, FaGlobe } from "react-icons/fa";
import { TbFolderPlus, TbFolderMinus } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MovieCard from "../components/MovieCard";
import ReviewsSection from "../components/ReviewsSection";
import GallerySection from "../components/GallerySection";
import Loading from "../components/Loading";
import WatchProviders from "../components/WatchProviders";
import CertificationBadge from "../components/CertificationBadge";
import ImdbBadge from "../components/ImdbBadge";
import { useContext, useEffect, useState, useRef } from "react";
import { CinemaContext } from "../context/CinemaContext";

const SectionTitle = ({ children }) => (
  <h2 className="text-[1.8rem] font-bold mb-[20px] text-white border-l-4 border-[#00c3ff] pl-[15px]">{children}</h2>
);

function formatStatValue(n) {
  if (n === null || n === undefined || n === 0 || n === "") return "N/A";
  if (typeof n === "number") {
    if (n >= 1e6) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
  }
  return n;
}

function shortNum(n) {
  if (!n || n === 0) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

const StatChip = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 px-3 py-[7px] rounded-full bg-white/[0.04] border border-white/[0.08] shrink-0">
    <span className="text-base leading-none">{icon}</span>
    <span className="text-gray-500 text-[0.7rem] uppercase tracking-wider font-semibold">{label}</span>
    <span className="text-white text-[0.85rem] font-medium">{value}</span>
  </div>
);

function MoviePage() {
  const [movieData, setMovieData] = useState(null);
  const { id } = useParams();
  const { formatDate, setWatchlist, watchlist, addRecentlyWatched } = useContext(CinemaContext);
  const castRef = useRef(null);
  const similarRef = useRef(null);
  const recsRef = useRef(null);

  const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir === "left" ? -ref.current.clientWidth * 0.8 : ref.current.clientWidth * 0.8, behavior: "smooth" });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,images,credits,reviews,similar,recommendations,keywords,release_dates,external_ids`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const enrichedData = {
          ...data,
          media_type: "movie",
          similar: { ...data.similar, results: data.similar?.results?.map(m => ({ ...m, media_type: "movie" })) || [] },
          recommendations: { ...data.recommendations, results: data.recommendations?.results?.map(m => ({ ...m, media_type: "movie" })) || [] },
        };
        setMovieData(enrichedData);
        addRecentlyWatched({
          id: enrichedData.id,
          title: enrichedData.title,
          poster_path: enrichedData.poster_path,
          backdrop_path: enrichedData.backdrop_path,
          media_type: "movie"
        });
      } catch (e) { console.error(e); }
    };
    if (id) fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (!movieData) return <Loading />;

  const movieLangName = new Intl.DisplayNames(["en"], { type: "language" }).of(movieData.original_language);
  const movieCountry = movieData.origin_country?.length
    ? movieData.origin_country.map(c => new Intl.DisplayNames(["en"], { type: "region" }).of(c)) : ["Unknown"];

  const trailerVideo = movieData.videos?.results?.find(v => v.type.toLowerCase() === "trailer");
  const trailerKey   = trailerVideo?.key || movieData.videos?.results?.[0]?.key;
  const trailerTitle = trailerVideo?.name || null;

  const inWatchlist = watchlist.some(m => m.id === movieData.id);
  const toggleWatchlist = () => setWatchlist(prev =>
    inWatchlist ? prev.filter(item => item.id !== movieData.id) : [...prev, { id: movieData.id, media_type: "movie" }]
  );

  const director  = movieData.credits?.crew?.find(c => c.job === "Director");
  const writers   = movieData.credits?.crew?.filter(c => ["Writer","Screenplay","Story"].includes(c.job)).slice(0, 3);
  const keywords  = movieData.keywords?.keywords?.slice(0, 10) || [];
  const movieLogo = movieData.images?.logos?.find(l => l.iso_639_1 === "en")?.file_path || movieData.images?.logos?.[0]?.file_path;
  const usCerts   = movieData.release_dates?.results?.find(r => r.iso_3166_1 === "US")?.release_dates || [];
  const cert      = usCerts.find(r => r.certification)?.certification || null;
  const imdbId    = movieData.external_ids?.imdb_id || movieData.imdb_id || null;
  const collection = movieData.belongs_to_collection;

  const movieStats = [
    { label: "Released", value: movieData.release_date ? movieData.release_date.split("-")[0] : "N/A", mobile: true },
    { label: "Runtime", value: movieData.runtime ? (movieData.runtime >= 60 ? `${Math.floor(movieData.runtime/60)}h ${movieData.runtime%60}m` : `${movieData.runtime}m`) : "N/A", mobile: true },
    { label: "Language", value: movieLangName || "N/A", mobile: false },
    { label: "TMDb Score", value: movieData.vote_average ? movieData.vote_average.toFixed(1) + "★" : "N/A", mobile: true },
  ];

  const prodCompanies = (movieData.production_companies || []).slice(0, 4);

  const CastCarousel = () => movieData.credits?.cast?.length > 0 && (
    <div className="relative group">
      <SectionTitle>Top Cast</SectionTitle>
      <div className="relative">
        <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(castRef,"left")}><IoIosArrowBack size={20}/></button>
        <div className="flex gap-[16px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={castRef}>
          {movieData.credits.cast.slice(0,15).map(actor => actor.profile_path && (
            <Link to={`/actor/${actor.id}`} className="relative shrink-0 w-[180px] rounded-[18px] overflow-hidden group/cast cursor-pointer border border-white/5 transition-all duration-300 hover:border-[#00c3ff]/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]" key={actor.id}>
              <img src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/cast:scale-110"/>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-[10px] py-[4px] rounded-[8px] text-[0.65rem] font-bold text-black shadow-lg uppercase tracking-tight">{actor.known_for_department||"Actor"}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/20 to-transparent flex flex-col justify-end p-4">
                <div className="font-bold text-[0.95rem] text-white leading-tight">{actor.name}</div>
                <div className="text-gray-400 text-[0.75rem] font-medium mt-1 truncate opacity-80 group-hover/cast:opacity-100 transition-opacity">{actor.character}</div>
              </div>
            </Link>
          ))}
        </div>
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(castRef,"right")}><IoIosArrowForward size={20}/></button>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen w-full bg-transparent text-white pt-[80px] overflow-x-hidden">
      {movieData.backdrop_path && (
        <div className="absolute top-0 left-0 w-full h-[600px] bg-cover bg-top bg-no-repeat opacity-40 z-0 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_100%)]"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})` }} />
      )}
      <div className="relative z-10 max-w-[1200px] mx-auto px-[2%] pt-[200px] pb-[40px] flex flex-col gap-[36px]">

        {/* ── Title ── */}
        <div className="flex flex-col items-center text-center gap-[12px]">
          {movieLogo
            ? <img src={`https://image.tmdb.org/t/p/w500${movieLogo}`} alt={movieData.title} className="max-w-[80%] md:max-w-[450px] max-h-[180px] object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-2"/>
            : <h1 className="text-[3.5rem] md:text-[2.5rem] font-extrabold m-0 leading-[1.1] text-white drop-shadow-lg">{movieData.title}</h1>}
          {movieData.tagline && <p className="text-gray-400 italic text-[1rem] m-0">"{movieData.tagline}"</p>}
          <div className="flex items-center gap-[10px] text-[#ffd700] text-[1.1rem] font-bold">
            <FaStar/> {movieData.vote_average.toFixed(1)}/10
            <span className="text-gray-500 text-[0.85rem] font-normal">({movieData.vote_count?.toLocaleString()} votes)</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-[10px] text-gray-300 text-[0.9rem]">
            {movieData.release_date && <span>{movieData.release_date.split("-")[0]}</span>}
            <span className="text-gray-600">·</span>
            {movieData.runtime > 0 && <span>{Math.floor(movieData.runtime/60)}h {movieData.runtime%60}m</span>}
            <span className="text-gray-600">·</span>
            <span>{movieLangName}</span>
            <span className="text-gray-600">·</span>
            <span className="px-[10px] py-[2px] rounded-full bg-white/10 border border-white/10 text-[0.8rem]">{movieData.status}</span>
            {cert && <CertificationBadge certification={cert}/>}
          </div>
        </div>
        <div className="w-full h-[1px] bg-white/10"/>

        {/* ── Poster + Details ── */}
        <div className="flex flex-col md:flex-row gap-[40px] md:items-start">
          <div className="w-full md:w-[280px] shrink-0 flex justify-center md:block">
            {movieData.poster_path
              ? <img src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt={movieData.title} className="w-[250px] md:w-full rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"/>
              : <div className="w-[250px] md:w-full aspect-[2/3] bg-[#333] rounded-[12px]"/>}
          </div>
          <div className="flex-1 flex flex-col gap-[18px] text-center md:text-left">
             {/* ── Production Companies ── */}
              {prodCompanies.length > 0 && (
                <div className=" hidden lg:flex items-center gap-3 flex-wrap">
                  <span className="text-[0.68rem] font-black text-gray-600 uppercase tracking-[0.25em] shrink-0">Made by</span>
                  {prodCompanies.map(c => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/[0.07]">
                      {c.logo_path
                        ? <img src={`https://image.tmdb.org/t/p/w92${c.logo_path}`} alt={c.name} className="h-[18px] w-auto object-contain brightness-0 invert opacity-60"/>
                        : <span className="text-gray-400 text-[0.78rem] font-medium">{c.name}</span>}
                    </div>
                  ))}
                </div>
              )}
            <div className=" hidden text-[0.9rem] text-gray-400 lg:flex flex-col gap-[6px]">
              {director && <p><span className="font-bold text-white">Directed by:</span> {director.name}</p>}
              {writers?.length > 0 && <p><span className="font-bold text-white">Written by:</span> {writers.map(w=>w.name).join(", ")}</p>}
              {movieData.credits?.cast?.length > 0 && <p><span className="font-bold text-white">Cast:</span> {movieData.credits.cast.slice(0,5).map(c=>c.name).join(", ")}</p>}
            </div>
            <p className="text-[1rem] leading-[1.8] text-gray-300">{movieData.overview}</p>
            <div className="flex flex-wrap gap-[8px] justify-center md:justify-start">
              {movieData.genres?.map(g => <span className="border border-white/30 px-[18px] py-[5px] rounded-full text-[0.85rem] text-gray-300 hover:bg-[#00c3ff] hover:border-[#00e1ff] hover:text-white cursor-default transition-colors" key={g.id}>{g.name}</span>)}
            </div>
            {keywords.length > 0 && (
              <div className="hidden lg:flex flex-wrap gap-[6px] justify-center md:justify-start">
                {keywords.map(kw => (
                  <Link key={kw.id} to={`/movies?with_keywords=${kw.id}&keyword_name=${encodeURIComponent(kw.name)}`}
                    onClick={() => window.scrollTo({top:0,behavior:"smooth"})}
                    className="px-[12px] py-[3px] rounded-full text-[0.75rem] font-medium border border-white/10 text-gray-500 bg-white/[0.03] hover:bg-[#00c3ff]/10 hover:border-[#00c3ff]/30 hover:text-[#00c3ff] transition-all no-underline">
                    #{kw.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex gap-[12px] mt-[6px] justify-center md:justify-start flex-wrap">
              {trailerKey && <a href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] border border-white/20 hover:bg-white hover:text-[#0b0c10] no-underline text-white transition-all"><FaPlay size={12}/> Watch Trailer</a>}
              <button className={`flex items-center gap-[10px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] cursor-pointer transition-all duration-300 border ${inWatchlist?"bg-[#00c3ff] text-white border-[#00e1ff]":"bg-transparent border-white/20 text-white hover:bg-white/10"}`} onClick={toggleWatchlist}>
                {inWatchlist ? <><TbFolderMinus size={18}/> Remove</> : <><TbFolderPlus size={18}/> Watchlist</>}
              </button>
              {movieData.homepage && <a href={movieData.homepage} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] border border-white/20 text-white hover:bg-white/10 transition no-underline"><FaGlobe size={13}/> Official Site</a>}
              <ImdbBadge imdbId={imdbId} variant="title"/>
            </div>
          </div>
        </div>

        {/* ── Bold Stats Row ── */}
        <div className="w-full py-10 border-y border-white/[0.08] flex justify-evenly items-center gap-4">
          {movieStats.map((stat, idx) => (
            <div key={stat.label} className={`items-center gap-4 ${stat.mobile ? "flex" : "hidden sm:flex"} flex-1 justify-center`}>
              <div className="flex flex-col items-center text-center">
                <span className={`font-black text-[#00c3ff] leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(0,195,255,0.3)] ${stat.value.length > 10 ? "text-[clamp(1.1rem,2vw,1.5rem)]" : "text-[clamp(1.4rem,3vw,2.5rem)]"}`}>
                  {stat.value}
                </span>
                <span className="text-[0.65rem] text-white/45 font-bold uppercase tracking-[0.15em] mt-3">
                  {stat.label}
                </span>
              </div>
              {idx < movieStats.length - 1 && (
                <div className={`h-12 w-[1px] bg-white/10 ml-auto ${movieStats[idx+1].mobile ? "" : "hidden sm:block"}`} />
              )}
            </div>
          ))}
        </div>

         {/* ── Collection Banner ── */}
        {collection && (
          <Link to={`/collection/${collection.id}`} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}
            className="no-underline block group relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#00c3ff]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,195,255,0.15)]">
            {collection.backdrop_path && <div className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500" style={{backgroundImage:`url(https://image.tmdb.org/t/p/w780${collection.backdrop_path})`}}/>}
            <div className="relative z-10 flex items-center gap-6 p-6 bg-white/[0.03] backdrop-blur-sm">
              {collection.poster_path && <img src={`https://image.tmdb.org/t/p/w92${collection.poster_path}`} alt={collection.name} className="w-[56px] rounded-[8px] border border-white/10 shadow-lg shrink-0"/>}
              <div>
                <div className="text-[0.65rem] font-black text-[#00c3ff] uppercase tracking-widest mb-1">Part of a Collection</div>
                <div className="text-white text-[1.2rem] font-bold group-hover:text-[#00c3ff] transition-colors">{collection.name} →</div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Stream Movie ── */}
        {movieData.imdb_id && (
          <div>
            <SectionTitle>Stream Movie</SectionTitle>
            <div className="w-full aspect-video rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <iframe
                src={`https://vaplayer.ru/embed/movie/${movieData.imdb_id}?autoplay=0`}
                title="Movie Stream"
                className="w-full h-full border-none"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
              />
            </div>
          </div>
        )}

        {/* ── Top Cast ── */}
        <CastCarousel/>

        {/* ── Gallery ── */}
        <GallerySection images={movieData.images}/>

        {/* ── Reviews ── */}
        <ReviewsSection reviews={movieData.reviews?.results}/>

        {/* ── More Like This ── */}
        {movieData.similar?.results?.length > 0 && (
          <div className="relative group">
            <SectionTitle>More Like This</SectionTitle>
            <div className="relative">
              <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(similarRef,"left")}><IoIosArrowBack size={20}/></button>
              <div className="flex gap-[20px] overflow-x-auto pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={similarRef}>
                {movieData.similar.results.filter(m => m.poster_path).map((m) => (
                  <div key={m.id} className="min-w-[160px] w-[160px]">
                    <MovieCard movie={m} layout="vertical" />
                  </div>
                ))}
              </div>
              <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(similarRef,"right")}><IoIosArrowForward size={20}/></button>
            </div>
          </div>
        )}

        {/* ── Recommended For You ── */}
        {movieData.recommendations?.results?.length > 0 && (
          <div className="relative group">
            <SectionTitle>Recommended For You</SectionTitle>
            <div className="relative">
              <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(recsRef,"left")}><IoIosArrowBack size={20}/></button>
              <div className="flex gap-[20px] overflow-x-auto pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={recsRef}>
                {movieData.recommendations.results.filter(m => m.poster_path).map((m) => (
                  <div key={m.id} className="min-w-[160px] w-[160px]">
                    <MovieCard movie={m} layout="vertical" />
                  </div>
                ))}
              </div>
              <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(recsRef,"right")}><IoIosArrowForward size={20}/></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MoviePage;

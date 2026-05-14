import { useParams, Link } from "react-router-dom";
import { FaStar, FaPlay, FaGlobe, FaTv } from "react-icons/fa";
import { TbFolderPlus, TbFolderMinus } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MovieCard from "../components/MovieCard";
import ReviewsSection from "../components/ReviewsSection";
import GallerySection from "../components/GallerySection";
import Loading from "../components/Loading";
import ImdbBadge from "../components/ImdbBadge";
import StreamEpisodesSection from "../components/StreamEpisodesSection";
import { useState, useEffect, useContext, useRef } from "react";
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

const STATUS_STYLE = {
  "Returning Series": "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  "Ended":           "bg-gray-500/15  border-gray-500/40  text-gray-400",
  "Canceled":        "bg-red-500/15   border-red-500/40   text-red-400",
  "In Production":   "bg-blue-500/15  border-blue-500/40  text-blue-400",
};

function ShowPage() {
  const [showData, setShowData] = useState(null);
  const { id } = useParams();
  const { setWatchlist, watchlist, formatDate, addRecentlyWatched } = useContext(CinemaContext);
  const castRef    = useRef(null);
  const similarRef = useRef(null);
  const recsRef    = useRef(null);

  const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir === "left" ? -ref.current.clientWidth * 0.8 : ref.current.clientWidth * 0.8, behavior: "smooth" });

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=videos,images,reviews,similar,recommendations,aggregate_credits,external_ids,keywords,content_ratings`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();

        const enrichedData = {
          ...data,
          media_type: "tv",
          similar:         { ...data.similar,         results: data.similar?.results?.map(m => ({ ...m, media_type: "tv" })) || [] },
          recommendations: { ...data.recommendations, results: data.recommendations?.results?.map(m => ({ ...m, media_type: "tv" })) || [] },
        };
        setShowData(enrichedData);
        addRecentlyWatched({
          id: enrichedData.id,
          title: enrichedData.name, // Note: TV shows use 'name' instead of 'title'
          poster_path: enrichedData.poster_path,
          backdrop_path: enrichedData.backdrop_path,
          media_type: "tv"
        });
      } catch (e) { console.error(e); }
    };
    if (id) fetchShow();
    window.scrollTo(0, 0);
  }, [id]);

  if (!showData) return <Loading />;

  const showLangName = new Intl.DisplayNames(["en"], { type: "language" }).of(showData.original_language);
  const showCountry  = showData.origin_country?.length
    ? showData.origin_country.map(c => new Intl.DisplayNames(["en"], { type: "region" }).of(c)) : ["Unknown"];

  const trailerVideo = showData.videos?.results?.find(v => v.type.toLowerCase() === "trailer");
  const trailerKey   = trailerVideo?.key || showData.videos?.results?.[0]?.key;
  const trailerTitle = trailerVideo?.name || null;

  const inWatchlist = watchlist.some(m => m.id === showData.id);
  const toggleWatchlist = () => setWatchlist(prev =>
    inWatchlist ? prev.filter(item => item.id !== showData.id) : [...prev, { id: showData.id, media_type: "tv" }]
  );

  const contentRating  = showData.content_ratings?.results?.find(r => r.iso_3166_1 === "US")?.rating;
  const creators       = showData.created_by?.map(c => c.name).join(", ");
  const showLogo       = showData.images?.logos?.find(l => l.iso_639_1 === "en")?.file_path || showData.images?.logos?.[0]?.file_path;
  const imdbId         = showData.external_ids?.imdb_id || null;
  const statusStyle    = STATUS_STYLE[showData.status] || "bg-gray-500/15 border-gray-500/40 text-gray-400";
  const epRuntime      = showData.episode_run_time?.[0] || null;
  const primaryNetwork = showData.networks?.[0] || null;
  const showStats = [
    { label: "Country", value: showCountry[0] || "N/A", mobile: false },
    { label: "Seasons", value: formatStatValue(showData.number_of_seasons), mobile: true },
    { label: "Episodes", value: formatStatValue(showData.number_of_episodes), mobile: true },
    { label: "Premiered", value: showData.first_air_date ? showData.first_air_date.split("-")[0] : "N/A", mobile: true },
  ];

  return (
    <section className="relative min-h-screen w-full bg-transparent text-white pt-[80px] overflow-x-hidden">
      {showData.backdrop_path && (
        <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[600px] bg-cover bg-top bg-no-repeat opacity-40 md:opacity-40 opacity-60 z-0 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)]"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${showData.backdrop_path})` }}/>
      )}

      <div className="relative z-10 w-full mx-auto md:max-w-[1200px] px-[2%] pt-[50vh] md:pt-[200px] pb-[40px] flex flex-col md:gap-[36px]">
        {/* ── MOBILE LAYOUT (md:hidden) ── */}
        <div className="md:hidden flex flex-col gap-6 relative z-10 px-[2%] w-full mt-[-60px]">
          {/* Title, tags */}
          <div className="flex flex-col items-center text-center gap-3">
             {showLogo 
              ? <img 
                  src={`https://image.tmdb.org/t/p/w500${showLogo}`} 
                  alt={showData.name} 
                  className="max-w-[60%] max-h-[180px] object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-2"
                /> 
              : <h1 className="text-[2.2rem] font-extrabold leading-[1.1] text-white drop-shadow-lg">{showData.name}</h1>
            }
            <div className="flex items-center justify-center gap-2 text-[0.85rem] text-gray-300 font-medium">
              <span className="text-[#ffd700] flex items-center gap-1"><FaStar size={12}/> {showData.vote_average?.toFixed(1)}</span>
              <span className="text-gray-500">•</span>
              <span>{showData.first_air_date?.split("-")[0]}</span>
              <span className="text-gray-500">•</span>
              <span>{showData.number_of_seasons} Seasons</span>
            </div>
            <div className="flex w-full overflow-x-auto justify-center gap-2 mt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {showData.genres?.map(g => <span key={g.id} className="text-[0.7rem] px-3 py-[4px] bg-white/10 border border-white/10 rounded-full text-gray-300 tracking-wider uppercase font-semibold shrink-0">{g.name}</span>)}
            </div>
          </div>

          <p className="text-[0.95rem] text-gray-300 leading-relaxed text-center line-clamp-4 px-2">{showData.overview}</p>

          <div className="flex gap-3 w-full justify-center mt-2 mb-4">
            {trailerKey && <a href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 py-[12px] rounded-full bg-white text-black font-bold text-[0.9rem] no-underline shadow-[0_0_20px_rgba(255,255,255,0.2)]"><FaPlay size={12}/> Watch Trailer</a>}
            <button onClick={toggleWatchlist} className={`flex-1 flex justify-center items-center gap-2 py-[12px] rounded-full border font-bold text-[0.9rem] transition-all ${inWatchlist ? "bg-[#00c3ff] text-white border-[#00c3ff]" : "bg-white/5 border-white/20 text-white"}`}>
              {inWatchlist ? <><TbFolderMinus size={18}/> Remove</> : <><TbFolderPlus size={18}/> Watchlist</>}
            </button>
          </div>

          <div className="mt-4">
             <StreamEpisodesSection showId={showData.id} showTitle={showData.name} numberOfSeasons={showData.number_of_seasons} imdbId={showData.external_ids?.imdb_id} />
          </div>

          {showData.aggregate_credits?.cast?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[1rem] font-bold mb-4 uppercase tracking-[0.15em] text-gray-400">Cast</h3>
              <div className="flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none]">
                {showData.aggregate_credits.cast.filter(c => c.known_for_department === "Acting").slice(0,10).map(actor => actor.profile_path && (
                  <Link key={actor.id} to={`/actor/${actor.id}`} className="flex flex-col gap-2 shrink-0 w-[92px] no-underline">
                    <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} className="w-full h-auto rounded-xl object-cover border border-white/20 shadow-lg"/>
                    <span className="text-[0.7rem] font-bold w-full leading-tight text-white line-clamp-1">{actor.name}</span>
                    <span className="text-[0.6rem] text-gray-500 w-full leading-tight line-clamp-1 w-full">{actor.roles?.[0]?.character}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showData.images?.backdrops?.length > 0 && (
            <div className="mt-2">
              <h3 className="text-[1rem] font-bold mb-4 uppercase tracking-[0.15em] text-gray-400">Gallery</h3>
              <div className="grid grid-cols-2 gap-2">
                {showData.images.backdrops.slice(0, 3).map((img, i) => (
                  <img key={i} src={`https://image.tmdb.org/t/p/w500${img.file_path}`} className={`w-full h-full object-cover rounded-xl border border-white/5 shadow-md ${i===0 ? "col-span-2 aspect-video" : "aspect-[4/3]"}`}/>
                ))}
              </div>
            </div>
          )}

          {showData.similar?.results?.length > 0 && (
             <div className="mt-6">
                <h3 className="text-[1rem] font-bold mb-4 uppercase tracking-[0.15em] text-gray-400">Similar Shows</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
                  {showData.similar.results.slice(0, 10).map(m => m.poster_path && (
                    <div key={m.id} className="w-[130px] shrink-0">
                       <MovieCard movie={m} layout="grid" />
                    </div>
                  ))}
                </div>
             </div>
          )}

          {showData.recommendations?.results?.length > 0 && (
             <div className="mt-4 mb-8">
                <h3 className="text-[1rem] font-bold mb-4 uppercase tracking-[0.15em] text-gray-400">Recommended For You</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
                  {showData.recommendations.results.slice(0, 10).map(m => m.poster_path && (
                    <div key={m.id} className="w-[130px] shrink-0">
                       <MovieCard movie={m} layout="grid" />
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* ── DESKTOP LAYOUT (hidden md:flex) ── */}
        <div className="hidden md:flex flex-col gap-[36px] w-full">

        {/* ── Title ── */}
        <div className="flex flex-col items-center text-center gap-[12px]">
          {showLogo
            ? <img src={`https://image.tmdb.org/t/p/w500${showLogo}`} alt={showData.name} className="max-w-[80%] md:max-w-[450px] max-h-[180px] object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-2"/>
            : <h1 className="text-[3.5rem] md:text-[2.5rem] font-extrabold m-0 leading-[1.1] text-white drop-shadow-lg">{showData.name}</h1>}
          {showData.tagline && <p className="text-gray-400 italic text-[1rem] m-0">"{showData.tagline}"</p>}
          <div className="flex items-center gap-[10px] text-[#ffd700] text-[1.1rem] font-bold">
            <FaStar/> {showData.vote_average.toFixed(1)}/10
            <span className="text-gray-500 text-[0.85rem] font-normal">({showData.vote_count?.toLocaleString()} votes)</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-[10px] text-gray-300 text-[0.9rem]">
            {showData.first_air_date && <span>{showData.first_air_date.split("-")[0]} – {showData.last_air_date?.split("-")[0] || "Present"}</span>}
            <span className="text-gray-600">•</span>
            <span>{showLangName}</span>
            <span className="text-gray-600">•</span>
            {/* Colored status badge */}
            <span className={`px-[10px] py-[2px] rounded-full border text-[0.8rem] font-semibold ${statusStyle}`}>{showData.status}</span>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white/10"/>

        {/* ── Poster + Details ── */}
        <div className="flex flex-col md:flex-row gap-[40px] md:items-start">
          <div className="w-full md:w-[280px] shrink-0 flex justify-center md:block">
            {showData.poster_path
              ? <img src={`https://image.tmdb.org/t/p/w500${showData.poster_path}`} alt={showData.name} className="w-[250px] md:w-full rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"/>
              : <div className="w-[250px] md:w-full aspect-[2/3] bg-[#333] rounded-[12px]"/>}
          </div>

          <div className="flex-1 flex flex-col justify-between h-full gap-[18px] text-center md:text-left">
            <div className="hidden text-[0.9rem] text-gray-400 lg:flex flex-col gap-[6px]">
              {creators && <p><span className="font-bold text-white">Created by:</span> {creators}</p>}

              {/* Network pill with logo */}
              {primaryNetwork && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-bold text-white">Network:</span>
                  <div className="flex items-center gap-2 px-3 py-[5px] rounded-full bg-white/[0.05] border border-white/10">
                    {primaryNetwork.logo_path
                      ? <img src={`https://image.tmdb.org/t/p/w92${primaryNetwork.logo_path}`} alt={primaryNetwork.name} className="h-[16px] w-auto object-contain brightness-0 invert opacity-70"/>
                      : <span className="text-gray-300 text-[0.8rem]">{primaryNetwork.name}</span>}
                  </div>
                  {showData.networks?.length > 1 && <span className="text-gray-600 text-[0.8rem]">+{showData.networks.length - 1} more</span>}
                </div>
              )}

              {epRuntime && <p><span className="font-bold text-white">Episode Runtime:</span> ~{epRuntime} min / episode</p>}

              {showData.aggregate_credits?.cast?.length > 0 && (
                <p><span className="font-bold text-white">Cast:</span>{" "}
                  {showData.aggregate_credits.cast.filter(c => c.known_for_department === "Acting").slice(0, 5).map(c => c.name).join(", ")}
                </p>
              )}
            </div>

            <p className="text-[1rem] leading-[1.8] text-gray-300">{showData.overview}</p>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-[8px] justify-center md:justify-start">
              {showData.genres?.map(g => <span key={g.id} className="border border-white/30 px-[18px] py-[5px] rounded-full text-[0.85rem] text-gray-300 hover:bg-[#00c3ff] hover:border-[#00e1ff] hover:text-white cursor-default transition-colors">{g.name}</span>)}
            </div>

            {/* Action buttons */}
            <div className="flex gap-[12px] mt-[6px] justify-center md:justify-start flex-wrap">
              {trailerKey && <a href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] border border-white/20 hover:bg-white hover:text-[#0b0c10] transition-all no-underline text-white"><FaPlay size={12}/> Watch Trailer</a>}
              <button className={`flex items-center gap-[10px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] cursor-pointer transition-all duration-300 border ${inWatchlist?"bg-[#00c3ff] text-white border-[#00e1ff]":"bg-transparent border-white/20 text-white hover:bg-white/10"}`} onClick={toggleWatchlist}>
                {inWatchlist ? <><TbFolderMinus size={18}/> Remove</> : <><TbFolderPlus size={18}/> Watchlist</>}
              </button>
              {showData.homepage && <a href={showData.homepage} target="_blank" rel="noreferrer" className="flex items-center gap-[8px] px-[22px] py-[10px] rounded-full font-semibold text-[0.9rem] border border-white/20 text-white hover:bg-white/10 transition no-underline"><FaGlobe size={13}/> Official Site</a>}
              <ImdbBadge imdbId={imdbId} variant="title"/>
            </div>
          </div>
        </div>

        {/* ── Bold Stats Row ── */}
        <div className="w-full p-10 flex items-center gap-4">
          {showStats.map((stat, idx) => (
            <div key={stat.label} className={`items-center gap-4 ${stat.mobile ? "flex" : "hidden sm:flex"} flex-1 justify-center`}>
              <div className="flex flex-col items-center text-center">
                <span className={`font-black text-white leading-none tracking-tighter ${stat.value.toString().length > 10 ? "text-[clamp(1.1rem,2vw,1.5rem)]" : "text-[clamp(1.4rem,3vw,2.5rem)]"}`}>
                  {stat.value}
                </span>
                <span className="text-[0.65rem] text-white/45 font-bold uppercase tracking-[0.15em] mt-3">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stream & Episodes Section ── */}
        <StreamEpisodesSection 
          showId={showData.id} 
          showTitle={showData.name} 
          numberOfSeasons={showData.number_of_seasons} 
          imdbId={showData.external_ids?.imdb_id} 
        />

        {/* ── Top Cast ── */}
        {showData.aggregate_credits?.cast?.length > 0 && (
          <div className="relative group">
            <SectionTitle>Top Cast</SectionTitle>
            <div className="relative">
              <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(castRef,"left")}><IoIosArrowBack size={20}/></button>
              <div className="flex gap-[16px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={castRef}>
                {showData.aggregate_credits.cast.filter(c => c.known_for_department === "Acting").slice(0,15).map(actor => actor.profile_path && (
                  <Link to={`/actor/${actor.id}`} className="relative shrink-0 w-[180px] rounded-[18px] overflow-hidden group/cast cursor-pointer border border-white/5 transition-all duration-300 hover:border-[#00c3ff]/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]" key={actor.id}>
                    <img src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/cast:scale-110"/>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-[10px] py-[4px] rounded-[8px] text-[0.65rem] font-bold text-black shadow-lg uppercase tracking-tight">Actor</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/20 to-transparent flex flex-col justify-end p-4">
                      <div className="font-bold text-[0.95rem] text-white leading-tight">{actor.name}</div>
                      <div className="text-gray-400 text-[0.75rem] font-medium mt-1 truncate opacity-80 group-hover/cast:opacity-100 transition-opacity">{actor.roles?.[0]?.character}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(castRef,"right")}><IoIosArrowForward size={20}/></button>
            </div>
          </div>
        )}

        {/* ── Gallery ── */}
        <GallerySection images={showData.images}/>

        {/* ── Reviews ── */}
        <ReviewsSection reviews={showData.reviews?.results}/>

        {/* ── More Like This ── */}
        {showData.similar?.results?.length > 0 && (
          <div className="relative group">
            <SectionTitle>More Like This</SectionTitle>
            <div className="relative">
              <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(similarRef,"left")}><IoIosArrowBack size={20}/></button>
              <div className="flex gap-[20px] overflow-x-auto pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={similarRef}>
                {showData.similar.results.filter(s => s.poster_path).map((s) => (
                  <div key={s.id} className="min-w-[160px] w-[160px]">
                    <MovieCard movie={s} layout="vertical" />
                  </div>
                ))}
              </div>
              <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(similarRef,"right")}><IoIosArrowForward size={20}/></button>
            </div>
          </div>
        )}

        {/* ── Recommended For You ── */}
        {showData.recommendations?.results?.length > 0 && (
          <div className="relative group">
            <SectionTitle>Recommended For You</SectionTitle>
            <div className="relative">
              <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(recsRef,"left")}><IoIosArrowBack size={20}/></button>
              <div className="flex gap-[20px] overflow-x-auto pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" ref={recsRef}>
                {showData.recommendations.results.filter(s => s.poster_path).map((s) => (
                  <div key={s.id} className="min-w-[160px] w-[160px]">
                    <MovieCard movie={s} layout="vertical" />
                  </div>
                ))}
              </div>
              <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-[#00c3ff] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10" onClick={() => scroll(recsRef,"right")}><IoIosArrowForward size={20}/></button>
            </div>
          </div>
        )}
      </div>
        </div>
    </section>
  );
}

export default ShowPage;

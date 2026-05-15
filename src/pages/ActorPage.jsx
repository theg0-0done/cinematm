import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBirthdayCake, FaMapMarkerAlt, FaBriefcase, FaInstagram, FaTwitter } from "react-icons/fa";
import MovieCard from "../components/MovieCard";
import ImdbBadge from "../components/ImdbBadge";
import Loading from "../components/Loading";

const SectionTitle = ({ children }) => (
  <h2 className="text-[1.2rem] lg:text-[1.8rem] font-bold mb-[20px] text-white border-l-4 border-[#00c3ff] pl-[15px]">{children}</h2>
);

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const ActorPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filmTab, setFilmTab] = useState("all"); // "all" | "movies" | "tv"

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits,tv_credits,images,external_ids`
        );
        const data = await res.json();

        // Tag each credit with its media_type
        const movieCredits = (data.movie_credits?.cast || []).map((m) => ({ ...m, media_type: "movie" }));
        const tvCredits    = (data.tv_credits?.cast   || []).map((t) => ({ ...t, media_type: "tv" }));

        // Combined, de-duped, sorted by popularity
        const allCredits = [...movieCredits, ...tvCredits].sort((a, b) => b.popularity - a.popularity);
        const uniqueCredits = [];
        const seen = new Set();
        allCredits.forEach((c) => {
          if (!seen.has(c.id)) { seen.add(c.id); uniqueCredits.push(c); }
        });

        setActor({
          ...data,
          combined_credits: uniqueCredits,
          movie_credits_sorted: movieCredits.sort((a, b) => b.popularity - a.popularity),
          tv_credits_sorted:    tvCredits.sort((a, b) => b.popularity - a.popularity),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loading />;
  if (!actor)  return <div className="text-white text-center mt-20 text-2xl font-bold">Actor not found</div>;

  const firstMovieYear = actor.combined_credits?.length
    ? [...actor.combined_credits].sort(
        (a, b) => new Date(a.release_date || a.first_air_date) - new Date(b.release_date || b.first_air_date)
      )[0]
    : null;
  const careerYears = firstMovieYear
    ? new Date().getFullYear() - new Date(firstMovieYear.release_date || firstMovieYear.first_air_date).getFullYear()
    : 0;

  const heroBackdrop = actor.combined_credits?.[0]?.backdrop_path;

  // External IDs
  const imdbId      = actor.external_ids?.imdb_id      || null;
  const instagramId = actor.external_ids?.instagram_id || null;
  const twitterId   = actor.external_ids?.twitter_id   || null;

  // Filmography tabs
  const filmCreditMap = {
    all:    actor.combined_credits?.slice(0, 18) || [],
    movies: actor.movie_credits_sorted?.slice(0, 18) || [],
    tv:     actor.tv_credits_sorted?.slice(0, 18) || [],
  };
  const activeCredits = filmCreditMap[filmTab];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex items-center pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${heroBackdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto w-full px-[5%] flex flex-col lg:flex-row items-center lg:items-end gap-12">
          {/* Main Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-gray-400 text-[0.8rem] font-bold uppercase tracking-[0.2em] mb-4">
              <span>{actor.known_for_department}</span>
            </div>

            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-black leading-[0.9] mb-8 drop-shadow-2xl">
              {actor.name}
            </h1>

            {/* Stats */}
            <div className="hidden lg:flex flex-wrap justify-center md:justify-start gap-12">
              <div className="flex flex-col gap-1">
                <span className="text-[2.5rem] font-black text-white leading-none">{careerYears}</span>
                <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-widest">Years of Career</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[2.5rem] font-black text-white leading-none">{actor.combined_credits?.length || 0}</span>
                <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-widest">Movies & Shows</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[2.5rem] font-black text-white leading-none">{actor.popularity?.toFixed(0)}</span>
                <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-widest">Popularity Score</span>
              </div>
            </div>
          </div>

          {/* Floating Portrait */}
          <div className="w-[280px] md:w-[350px] shrink-0 relative group">
            <div className="absolute inset-0 bg-[#00c3ff] rounded-2xl rotate-3 scale-95 opacity-20 blur-2xl lg:group-hover:rotate-6 transition-transform duration-500" />
            <img
              src={`https://image.tmdb.org/t/p/h632${actor.profile_path}`}
              alt={actor.name}
              className="relative z-10 w-full rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 object-cover aspect-[3/4]"
            />
          </div>

          <div className="lg:hidden flex justify-center md:justify-start gap-6">
            {careerYears > 0 && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[2rem] font-black text-white leading-none">{careerYears}</span>
                <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-widest">Years of Career</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[2rem] font-black text-white leading-none">{actor.combined_credits?.length || 0}</span>
              <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-widest">Movies & Shows</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[2rem] font-black text-white leading-none">{actor.popularity?.toFixed(0)}</span>
              <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-widest">Popularity Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Body */}
      <section className="max-w-[1200px] mx-auto px-[5%] py-20">
        {/* Quote Block */}
        {actor.biography && (
          <div className="mb-24 max-w-2xl">
            <span className="text-[5rem] text-[#00c3ff] font-serif leading-none opacity-40 select-none block h-10">"</span>
            <p className="text-[1.8rem] md:text-[2.2rem] font-bold text-white/90 leading-tight">
              {actor.biography.split(".")[0]}.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Info Side */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-10">
            {actor.birthday && (
              <div className="flex flex-col gap-1">
                <h4 className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.3em] mb-3">Birthday</h4>
                <p className="text-gray-300 flex items-center gap-2">
                  <FaBirthdayCake className="text-white/20" /> {actor.birthday}
                </p>
              </div>
            )}
            {actor.place_of_birth && (
              <div className="flex flex-col gap-1">
                <h4 className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.3em] mb-3">Birthplace</h4>
                <p className="text-gray-300 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/20" /> {actor.place_of_birth}
                </p>
              </div>
            )}
            {actor.known_for_department && (
              <div className="flex flex-col gap-1">
                <h4 className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.3em] mb-3">Occupation</h4>
                <p className="text-gray-300 flex items-center gap-2 line-clamp-1">
                  <FaBriefcase className="text-white/20" /> {actor.known_for_department}
                </p>
              </div>
            )}

            {/* External Links */}
            {(imdbId || instagramId || twitterId) && (
              <div className="flex flex-col gap-3">
                <h4 className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.3em]">Links</h4>
                <div className="flex flex-wrap gap-2">
                  <ImdbBadge imdbId={imdbId} variant="name" />
                  {instagramId && (
                    <a
                      href={`https://www.instagram.com/${instagramId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-[6px] rounded-full text-[0.8rem] font-semibold border border-white/15 text-pink-400 bg-pink-500/10 lg:hover:bg-pink-500/20 lg:hover:border-pink-400/40 transition-all no-underline"
                    >
                      <FaInstagram size={14} /> Instagram
                    </a>
                  )}
                  {twitterId && (
                    <a
                      href={`https://twitter.com/${twitterId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-[6px] rounded-full text-[0.8rem] font-semibold border border-white/15 text-sky-400 bg-sky-500/10 lg:hover:bg-sky-500/20 lg:hover:border-sky-400/40 transition-all no-underline"
                    >
                      <FaTwitter size={14} /> Twitter / X
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Photo Mini-Gallery */}
            {actor.images?.profiles?.length > 1 && (
              <div className="mt-6">
                <SectionTitle>Photo Gallery</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  {actor.images?.profiles?.slice(1, 5).map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-white/5 bg-white/5">
                      <img
                        src={`https://image.tmdb.org/t/p/w185${img.file_path}`}
                        className="w-full h-full object-cover grayscale lg:hover:grayscale-0 transition-all duration-300 lg:hover:scale-110"
                        alt="actor still"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Biography */}
          {actor.biography && (
            <div className="flex-1">
              <SectionTitle>Biography</SectionTitle>
              <div className="text-gray-400 leading-relaxed text-[1rem] space-y-6 columns-1 md:columns-2 gap-12 font-medium">
                {actor.biography.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filmography Section */}
      <section className="bg-white/[0.02] border-t border-white/5 py-24 relative">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <SectionTitle>Best Known Works</SectionTitle>
            </div>

            {/* Tab Toggle */}
            <div className="flex gap-2">
              {[
                { key: "all",    label: "All" },
                { key: "movies", label: `🎬 Movies (${actor.movie_credits_sorted?.length || 0})` },
                { key: "tv",     label: `📺 TV (${actor.tv_credits_sorted?.length || 0})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilmTab(key)}
                  className={`px-4 py-[7px] rounded-full whitespace-nowrap text-[0.8rem] font-semibold border transition-all cursor-pointer ${
                    filmTab === key
                      ? "bg-[#00c3ff] border-[#00c3ff] text-white shadow-[0_0_14px_rgba(0,195,255,0.35)]"
                      : "bg-transparent border-white/15 text-gray-400 lg:hover:border-white/30 lg:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-[20px] w-full">
            {activeCredits.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type}`} movie={item} layout="grid" />
            ))}
          </div>
        </div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10 pointer-events-none" />
      </section>
    </div>
  );
};

export default ActorPage;

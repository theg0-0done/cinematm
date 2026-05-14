import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiChevronRight } from "react-icons/fi";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const GENRES = [
  { id: 28,    name: "Action"          },
  { id: 12,    name: "Adventure"       },
  { id: 35,    name: "Comedy"          },
  { id: 80,    name: "Crime"           },
  { id: 18,    name: "Drama"           },
  { id: 27,    name: "Horror"          },
  { id: 10749, name: "Romance"         },
  { id: 14,    name: "Fantasy"         },
  { id: 878,   name: "Science Fiction" },
  { id: 53,    name: "Thriller"        },
  { id: 16,    name: "Animation"       },
  { id: 99,    name: "Documentary"     },
];

function GenreCard({ genre }) {
  const [posters, setPosters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&page=1`)
            .then((r) => r.json())
            .then((d) => {
              setPosters((d.results || []).filter((m) => m.poster_path).slice(0, 4).map((m) => m.poster_path));
              setLoaded(true);
            })
            .catch(() => setLoaded(true));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [genre.id, loaded]);

  const handleClick = () => {
    navigate(`/movies?genre_id=${genre.id}&genre_name=${encodeURIComponent(genre.name)}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="relative flex-shrink-0 w-[280px] h-[320px] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] bg-[#0f1117]/80 transition-all duration-300 lg:hover:scale-[1.03] lg:hover:border-white/25 lg:hover:shadow-[0_0_24px_rgba(255,255,255,0.08)] group/card"
    >
      {/* 2×2 Poster grid */}
      <div className="absolute inset-0 grid grid-cols-2 gap-px">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden bg-white/5">
            {!loaded ? (
              <div className="w-full h-full bg-white/[0.06] animate-pulse" />
            ) : posters[i] ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${posters[i]}`}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 lg:group-hover/card:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/15 text-4xl font-black">
                {genre.name[0]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />

      {/* Text + arrow */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
        <span className="text-white font-bold text-[1.05rem] leading-tight drop-shadow">{genre.name}</span>
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm lg:group-hover/card:bg-[#00c3ff] lg:group-hover/card:border-[#00c3ff] transition-colors">
          <FiChevronRight size={16} />
        </div>
      </div>
    </div>
  );
}

function GenreShowcaseSection() {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  return (
    <div
      ref={sectionRef}
      className={`px-5 md:px-14 py-14 transition-all duration-700 ease-out overflow-hidden ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">Genres without boundaries</h2>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Discover hidden gems and unforgettable experiences, organized to help you find the perfect film in seconds.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 mt-1">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white lg:hover:bg-[#00c3ff] lg:hover:border-[#00c3ff] transition-all cursor-pointer">
            <IoIosArrowBack size={18} />
          </button>
          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white lg:hover:bg-[#00c3ff] lg:hover:border-[#00c3ff] transition-all cursor-pointer">
            <IoIosArrowForward size={18} />
          </button>
        </div>
      </div>
 
      {/* Carousel */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto lg:pt-10 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {GENRES.map((genre) => <GenreCard key={genre.id} genre={genre} />)}
      </div>
    </div>
  );
}

export default GenreShowcaseSection;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BASE_URL}/collection/${id}?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => {
        // Sort parts by release date
        const sorted = (d.parts || [])
          .filter((p) => p.release_date)
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        setCollection({ ...d, parts: sorted });
        setLoading(false);
      })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loading />;
  if (!collection)
    return (
      <div className="text-white text-center mt-32 text-2xl font-bold">
        Collection not found.
      </div>
    );

  return (
    <section className="relative min-h-screen text-white overflow-x-hidden">
      {/* Backdrop Hero */}
      {collection.backdrop_path && (
        <div
          className="absolute top-0 left-0 w-full h-[70vh] bg-cover bg-center opacity-35 z-0"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto px-[5%] pt-[140px] pb-[80px] flex flex-col gap-[48px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">
          {collection.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${collection.poster_path}`}
              alt={collection.name}
              className="w-[180px] rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 shrink-0"
            />
          )}
          <div className="flex flex-col gap-4">
            <div className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.3em]">
              Collection
            </div>
            <h1 className="text-[3rem] md:text-[4rem] font-black leading-none text-white drop-shadow-2xl">
              {collection.name}
            </h1>
            <div className="flex items-center gap-3 text-gray-400 text-[0.9rem]">
              <span>{collection.parts?.length} Films</span>
              <span className="text-gray-600">·</span>
              <span>
                {collection.parts?.[0]?.release_date?.split("-")[0]} –{" "}
                {collection.parts?.at(-1)?.release_date?.split("-")[0]}
              </span>
            </div>
            {collection.overview && (
              <p className="text-gray-300 leading-relaxed text-[1rem] max-w-[700px]">
                {collection.overview}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10" />

        {/* Movies grid */}
        <div>
          <h2 className="text-[1.8rem] font-bold mb-8 text-white border-l-4 border-[#00c3ff] pl-[15px]">
            All Movies in the Collection
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
            {collection.parts.map((movie) => (
              <div key={movie.id} className="flex flex-col gap-3">
                <MovieCard movie={{ ...movie, media_type: "movie" }} layout="vertical" />
                {/* Rating overlay info below card */}
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 px-1">
                    <FaStar size={11} className="text-[#ffd700]" />
                    <span className="text-[0.75rem] text-gray-400">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionPage;

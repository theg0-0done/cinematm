import { useState } from "react";
import { FaStar, FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";

const IMG_BASE = "https://image.tmdb.org/t/p/w185";

function StarRating({ rating }) {
  if (!rating) return null;
  const stars = Math.round((rating / 10) * 5);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={10}
          className={i < stars ? "text-[#ffd700]" : "text-white/15"}
        />
      ))}
      <span className="text-[0.7rem] text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function EpisodeRow({ ep }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group border border-white/[0.07] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[#00c3ff]/20 bg-white/[0.02] hover:bg-white/[0.04] ${
        expanded ? "border-[#00c3ff]/20" : ""
      }`}
    >
      {/* Main Row */}
      <button
        className="w-full flex items-center gap-4 p-3 cursor-pointer text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Still image */}
        <div className="shrink-0 w-[96px] h-[54px] rounded-[8px] overflow-hidden bg-white/5 border border-white/5">
          {ep.still_path ? (
            <img
              src={`${IMG_BASE}${ep.still_path}`}
              alt={ep.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <FaUser size={20} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[0.7rem] font-bold text-[#00c3ff] bg-[#00c3ff]/10 border border-[#00c3ff]/20 px-2 py-[2px] rounded-full shrink-0">
              E{ep.episode_number}
            </span>
            <span className="text-[0.88rem] font-semibold text-white truncate">
              {ep.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {ep.air_date && (
              <span className="text-[0.7rem] text-gray-500">{ep.air_date}</span>
            )}
            {ep.runtime && (
              <span className="text-[0.7rem] text-gray-500">{ep.runtime}m</span>
            )}
            <StarRating rating={ep.vote_average} />
          </div>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-gray-600 group-hover:text-[#00c3ff] transition-colors">
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/5">
          {ep.overview && (
            <p className="text-gray-400 text-[0.85rem] leading-relaxed pt-3">
              {ep.overview}
            </p>
          )}

          {/* Guest Stars */}
          {ep.guest_stars?.length > 0 && (
            <div>
              <h5 className="text-[0.68rem] font-black text-[#00c3ff] uppercase tracking-widest mb-2">
                Guest Stars
              </h5>
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
                {ep.guest_stars.slice(0, 8).map((g) => (
                  <div key={g.id} className="shrink-0 flex flex-col items-center gap-1 w-[56px]">
                    <div className="w-[44px] h-[44px] rounded-full overflow-hidden bg-white/5 border border-white/10">
                      {g.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${g.profile_path}`}
                          alt={g.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <FaUser size={14} />
                        </div>
                      )}
                    </div>
                    <span className="text-[0.6rem] text-gray-500 text-center leading-tight line-clamp-2">
                      {g.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * EpisodeList — season tab row + scrollable episode list.
 * @param {Array} seasons  — array of season objects (with .episodes[])
 */
function EpisodeList({ seasons }) {
  const validSeasons = (seasons || []).filter((s) => s.season_number > 0 && s.episodes?.length > 0);
  const [activeSeason, setActiveSeason] = useState(validSeasons[0]?.season_number ?? 1);

  if (validSeasons.length === 0) return null;

  const currentSeason = validSeasons.find((s) => s.season_number === activeSeason) || validSeasons[0];

  return (
    <div>
      <h2 className="text-[1.8rem] font-bold mb-[20px] text-white border-l-4 border-[#00c3ff] pl-[15px]">
        Episodes
      </h2>

      {/* Season Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 [scrollbar-width:none]">
        {validSeasons.map((s) => (
          <button
            key={s.season_number}
            onClick={() => setActiveSeason(s.season_number)}
            className={`shrink-0 px-4 py-[7px] rounded-full text-[0.82rem] font-semibold border transition-all duration-200 cursor-pointer ${
              activeSeason === s.season_number
                ? "bg-[#00c3ff] border-[#00c3ff] text-white shadow-[0_0_14px_rgba(0,195,255,0.35)]"
                : "bg-transparent border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
          >
            Season {s.season_number}
            <span className="ml-1 opacity-60 text-[0.7rem]">({s.episodes.length})</span>
          </button>
        ))}
      </div>

      {/* Episode list */}
      <div className="flex flex-col gap-2">
        {currentSeason?.episodes?.map((ep) => (
          <EpisodeRow key={ep.id} ep={ep} />
        ))}
      </div>
    </div>
  );
}

export default EpisodeList;

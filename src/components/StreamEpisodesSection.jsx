import { useState, useEffect, useRef } from "react";
import { FaStar, FaPlay } from "react-icons/fa";

export default function StreamEpisodesSection({ showId, showTitle, numberOfSeasons, imdbId }) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [isLoadingSeason, setIsLoadingSeason] = useState(true);
  const [isFadingEpisode, setIsFadingEpisode] = useState(false);

  const episodesRowRef = useRef(null);
  const playerRef = useRef(null);

  // Fetch season data
  useEffect(() => {
    let isMounted = true;
    const fetchSeason = async () => {
      setIsLoadingSeason(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${selectedSeason}?api_key=${apiKey}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (isMounted) {
          setSeasonData(data);
          setIsLoadingSeason(false);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setIsLoadingSeason(false);
      }
    };
    if (showId) fetchSeason();
    return () => { isMounted = false; };
  }, [showId, selectedSeason]);

  // Handle season change
  const handleSeasonChange = (e) => {
    setSelectedSeason(Number(e.target.value));
    setSelectedEpisode(1);
  };

  // Handle episode change
  const handleEpisodeChange = (epNumber, e) => {
    if (epNumber === selectedEpisode) return;
    setIsFadingEpisode(true);
    
    // Smooth scroll pill into view
    e.target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    setTimeout(() => {
      setSelectedEpisode(epNumber);
      setIsFadingEpisode(false);
      
      // Scroll to player
      if (playerRef.current) {
        playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const episodeData = seasonData?.episodes?.[selectedEpisode - 1];

  const dropdownClass = "w-full bg-black/40 border border-[#00c3ff]/50 text-white px-[15px] pr-[30px] h-[40px] rounded-lg text-[0.9rem] outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_top_50%] bg-[length:10px_auto] transition-all duration-300 focus:border-[#00c3ff]";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full flex flex-col gap-[24px]">
      <h2 className="text-[1.8rem] font-bold text-white border-l-4 border-[#00c3ff] pl-[15px] mb-2">Watch & Explore</h2>

      {/* ── MOBILE LAYOUT (md:hidden) ── */}
      <div className="md:hidden flex flex-col gap-6">
         {/* Season Tabs */}
         <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
             {Array.from({ length: numberOfSeasons || 1 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => { setSelectedSeason(n); setSelectedEpisode(1); }}
                  className={`shrink-0 px-4 py-[6px] rounded-full text-[0.85rem] font-bold border transition-colors ${n === selectedSeason ? "bg-[#00c3ff] text-white border-[#00c3ff]" : "bg-transparent text-gray-400 border-white/20"}`}>
                  Season {n}
                </button>
             ))}
         </div>

         {/* Season Info Block */}
         {seasonData && (
            <div className="flex gap-4">
               {seasonData.poster_path ? (
                 <img src={`https://image.tmdb.org/t/p/w300${seasonData.poster_path}`} className="w-auto h-[180px] rounded-[12px] object-cover shadow-lg border border-white/10 shrink-0" />
               ) : (
                 <div className="w-[100px] aspect-[2/3] bg-white/5 rounded-[12px] border border-white/10 shrink-0" />
               )}
               <div className="flex flex-col gap-1">
                 <h3 className="text-[1.2rem] font-bold text-white leading-tight">{seasonData.name || `Season ${selectedSeason}`}</h3>
                 <div className="flex items-center gap-2 mt-1">
                   {seasonData.vote_average > 0 && <span className="flex items-center gap-1 text-[0.85rem] font-bold"><FaStar className="text-[#ffd700]"/> {seasonData.vote_average.toFixed(1)}</span>}
                   {seasonData.air_date && <span className="text-gray-400 text-[0.8rem]">{formatDate(seasonData.air_date)}</span>}
                   {seasonData.episodes && <span className="px-2 py-[2px] bg-[#00c3ff]/10 text-[#00c3ff] rounded border border-[#00c3ff]/30 text-[0.7rem] font-bold uppercase">{seasonData.episodes.length} Episodes</span>}
                 </div>
                 {seasonData.overview && <p className="text-gray-400 text-[0.8rem] line-clamp-5 mt-1 leading-relaxed">{seasonData.overview}</p>}
               </div>
            </div>
         )}

         {/* Stream Player */}
         <div ref={playerRef} className="relative w-full aspect-video rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 mt-2">
            {imdbId ? (
               <iframe key={`mobile-${showId}-${selectedSeason}-${selectedEpisode}`} src={`https://vaplayer.ru/embed/tv/${imdbId}/${selectedSeason}/${selectedEpisode}?autoplay=0`} className="w-full h-full border-none" allowFullScreen sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"/>
            ) : (
               <div className="w-full h-full bg-black/40 flex items-center justify-center text-white/50 text-[0.9rem]">Stream unavailable</div>
            )}
            <select 
              value={selectedEpisode}
              onChange={(e) => handleEpisodeChange(Number(e.target.value), e)}
              className="absolute top-2 right-2 max-w-[6rem] rounded-[6px] px-3 py-1 bg-black/30 border border-white/10 text-white"
            >
              {seasonData?.episodes?.map((ep) => (
                <option key={ep.id} value={ep.episode_number}>
                  {ep.episode_number}. {ep.name}
                </option>
              ))}
            </select>
         </div>

         {/* Episode Info & Guests */}
         <div className="flex flex-col gap-3">
            <h3 className="text-[1.1rem] font-bold text-white">{episodeData?.name || `Episode ${selectedEpisode}`}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              {episodeData?.vote_average > 0 && <span className="flex items-center gap-1 text-[0.85rem] font-bold"><FaStar className="text-[#ffd700]"/>{episodeData?.vote_average?.toFixed(1)}</span>}             
              {episodeData?.air_date && <span>• {formatDate(episodeData?.air_date)}</span>}  
              {episodeData?.runtime > 0 && <span>• {episodeData?.runtime} min</span>}
            </div>
            {episodeData?.overview && <p className="text-[0.9rem] text-gray-300 leading-relaxed line-clamp-4">{episodeData.overview}</p>}
         </div>
      </div>

      {/* ── DESKTOP LAYOUT (hidden md:flex) ── */}
      <div className="hidden md:flex flex-col gap-[24px]">

      {/* BLOCK 1: SEASON INFO HEADER */}
      <div className="flex flex-col md:flex-row gap-6 items-start w-full transition-opacity duration-300">
        <div className="flex flex-col gap-3 w-full md:w-[120px] shrink-0">
          {isLoadingSeason ? (
            <div className="w-full md:w-[120px] aspect-[2/3] bg-white/5 rounded-xl animate-pulse"></div>
          ) : (
            seasonData?.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w300${seasonData.poster_path}`} alt={`Season ${selectedSeason}`} className="w-full md:w-[120px] aspect-[2/3] rounded-xl object-cover shadow-lg border border-white/10" />
            ) : (
              <div className="w-full md:w-[120px] aspect-[2/3] bg-[#1a1c22] rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-white/50 font-bold text-sm">Season {selectedSeason}</span>
              </div>
            )
          )}
          
          <select className={dropdownClass} value={selectedSeason} onChange={handleSeasonChange}>
            {Array.from({ length: numberOfSeasons || 1 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n} className="bg-[#1a1c22] text-white">Season {n}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full flex-1">
          {isLoadingSeason ? (
             <div className="w-full max-w-md h-32 bg-white/5 rounded-xl animate-pulse"></div>
          ) : (
             <>
               <h3 className="text-2xl xl:text-3xl font-bold text-white leading-tight">
                 {seasonData?.name || `Season ${selectedSeason}`}
               </h3>
               {seasonData?.air_date && (
                 <span className="text-sm text-gray-400 font-medium tracking-wide">Aired: {formatDate(seasonData.air_date)}</span>
               )}
               <div className="flex items-center gap-3 mt-1">
                 {seasonData?.episodes && (
                   <span className="px-3 py-1 rounded-full border border-[#00c3ff]/40 text-[#00c3ff] text-xs font-bold uppercase tracking-widest bg-[#00c3ff]/10">
                     {seasonData.episodes.length} Episodes
                   </span>
                 )}
                 {seasonData?.vote_average > 0 && (
                   <div className="flex items-center gap-1">
                     <FaStar className="text-[#00c3ff]" size={14} />
                     <span className="text-white font-bold text-sm">
                       {seasonData.vote_average.toFixed(1)} <span className="text-gray-500 font-normal">/10</span>
                     </span>
                   </div>
                 )}
               </div>
               {seasonData?.overview && (
                 <p className="text-sm text-gray-400 mt-2 line-clamp-4 leading-relaxed">
                   {seasonData.overview}
                 </p>
               )}
             </>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/[0.08]" />

      {/* BLOCK 2: EPISODE SELECTOR ROW */}
      <div className="w-full relative">
        {isLoadingSeason ? (
           <div className="w-full h-[40px] bg-white/5 rounded-full animate-pulse"></div>
        ) : (
          <div 
            ref={episodesRowRef}
            className="flex gap-[8px] overflow-x-auto py-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {seasonData?.episodes?.map((ep) => {
              const isActive = ep.episode_number === selectedEpisode;
              return (
                <button
                  key={ep.id}
                  onClick={(e) => handleEpisodeChange(ep.episode_number, e)}
                  className={`shrink-0 h-[32px] min-w-[56px] px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-[#00c3ff] text-white shadow-[0_0_12px_rgba(0,195,255,0.5)] border-transparent" 
                      : "bg-white/[0.06] border border-white/10 text-gray-400 lg:hover:bg-white/10"
                  }`}
                >
                  Ep {ep.episode_number}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* BLOCK 3: VIDEO PLAYER */}
      <div ref={playerRef} className="w-full scroll-mt-[100px]">
        {isLoadingSeason ? (
          <div className="w-full aspect-video bg-white/5 rounded-xl animate-pulse mt-2"></div>
        ) : (
          <div className={`transition-opacity duration-150 ${isFadingEpisode ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-sm text-gray-400 mb-3 ml-1 font-medium tracking-wide">
              {showTitle} <span className="mx-2 opacity-50">·</span> S{selectedSeason}E{selectedEpisode} {episodeData?.name && <span className="mx-2 opacity-50">·</span>} <span className="text-white/80">{episodeData?.name}</span>
            </div>
            {imdbId ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-white/[0.05]">
                <iframe 
                  key={`${showId}-${selectedSeason}-${selectedEpisode}`}
                  src={`https://vaplayer.ru/embed/tv/${imdbId}/${selectedSeason}/${selectedEpisode}?autoplay=0`} 
                  title={`Stream S${selectedSeason}E${selectedEpisode}`}
                  className="w-full h-full border-none" 
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
                />
              </div>
            ) : (
               <div className="w-full aspect-video rounded-xl bg-black/40 flex items-center justify-center border border-white/10">
                 <span className="text-white/50">Stream unavailable (Missing IMDb ID)</span>
               </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-[1px] bg-white/[0.08] mt-2 mb-2" />

      {/* BLOCK 4: EPISODE INFO PANEL */}
      <div className="w-full min-h-[150px]">
        {isLoadingSeason ? (
          <div className="w-full h-[100px] bg-white/5 rounded-xl animate-pulse mt-2"></div>
        ) : (
          <div className={`flex flex-col md:flex-row gap-8 transition-opacity duration-150 ${isFadingEpisode ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col gap-3 md:w-[65%]">
              <h3 className="text-xl xl:text-2xl font-bold text-white leading-tight">
                {episodeData?.name || `Episode ${selectedEpisode}`}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium">
                <span className="px-2 py-[2px] bg-white/10 rounded border border-white/10 text-white/90">S{selectedSeason} · E{selectedEpisode}</span>
                {episodeData?.air_date && <span>{formatDate(episodeData.air_date)}</span>}
                {episodeData?.runtime > 0 && <span>{episodeData.runtime} min</span>}
                {episodeData?.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-[#00c3ff]">
                    <FaStar size={12} /> {episodeData.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {episodeData?.overview && (
                <p className="text-white/80 leading-relaxed text-[0.95rem] mt-1">
                  {episodeData.overview}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6 md:w-[35%] pt-1">
              {episodeData?.guest_stars?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 font-bold">Guest Stars</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {episodeData.guest_stars.slice(0, 5).map(guest => (
                      <div key={guest.id} className="flex flex-col items-center gap-[6px] w-[44px]">
                        {guest.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w92${guest.profile_path}`} 
                            alt={guest.name} 
                            className="w-[40px] h-[40px] rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center border border-white/5 text-white/40 text-xs shrink-0 font-bold">
                            {guest.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 text-center leading-tight line-clamp-1 w-full break-words">
                          {guest.name}
                        </span>
                      </div>
                    ))}
                    {episodeData.guest_stars.length > 5 && (
                      <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-semibold shrink-0">
                        +{episodeData.guest_stars.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {episodeData?.crew?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[0.75rem] uppercase tracking-widest text-gray-500 font-bold">Crew Highlights</span>
                  <div className="flex flex-col gap-2 text-sm text-gray-400 font-medium">
                    {episodeData.crew.find(c => c.job === "Director") && (
                      <div><span className="text-white/50 mr-1">Directed by</span> <span className="text-white/90">{episodeData.crew.find(c => c.job === "Director").name}</span></div>
                    )}
                    {episodeData.crew.find(c => ["Writer", "Teleplay", "Story"].includes(c.job)) && (
                      <div><span className="text-white/50 mr-1">Written by</span> <span className="text-white/90">{episodeData.crew.find(c => ["Writer", "Teleplay", "Story"].includes(c.job)).name}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

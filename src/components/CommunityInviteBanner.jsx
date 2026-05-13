import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import moviesGridImg from '../assets/movies grid.jfif';

function CommunityInviteBanner() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative w-full py-10 border-y border-white/[0.05] transition-all duration-700 ease-out overflow-hidden ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ 
        background: "linear-gradient(135deg, rgba(13, 27, 42, 0.7) 0%, rgba(21, 34, 56, 0.7) 60%, rgba(26, 39, 68, 0.7) 100%)", 
        minHeight: "220px",
        maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)"
      }}
    >
      {/* Subtle glow accent */}
      <div className="absolute left-0 top-0 w-[300px] h-full bg-[#00c3ff]/[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] ml-auto flex items-center">
        {/* LEFT — Content */}
        <div className="w-full md:w-1/2 px-5 md:px-14 py-10 md:py-24 flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            Your Watchlist, Shared.
          </h3>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
            Save your favorites and share your taste with friends. Build your own cinema community.
          </p>
          <Link
            to="/watchlist"
            onClick={() => window.scrollTo({ top: 0 })}
            className="self-start flex items-center gap-2 px-6 py-3 rounded-full border border-[#00c3ff]/40 text-[#00c3ff] bg-[#00c3ff]/10 hover:bg-[#00c3ff]/20 hover:border-[#00c3ff] font-semibold text-sm no-underline transition-all duration-300 hover:shadow-[0_0_16px_rgba(0,195,255,0.2)]"
          >
            <FiUserPlus size={16} />
            Add to Watchlist
          </Link>
        </div>

        {/* RIGHT — Static Grid Asset */}
        <div className="absolute inset-0 z-[-1] lg:static lg:z-auto w-full lg:w-1/2 h-full md:absolute md:right-0 md:top-0 md:bottom-0">
          <div className="relative w-full h-full">
            {/* Dark overlay for mobile text readability */}
            <div className="absolute inset-0 bg-black/60 lg:hidden z-[1]" />
            
            <img 
              src={moviesGridImg} 
              alt="" 
              className="w-full h-full object-cover object-center opacity-50 lg:opacity-100 transition-opacity duration-700"
              style={{ 
                maskImage: "linear-gradient(to right, transparent 0%, black 50%)", 
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)" 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityInviteBanner;


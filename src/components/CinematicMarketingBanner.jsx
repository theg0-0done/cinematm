import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import phoneImg from '../assets/phone.png';

function CinematicMarketingBanner() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const accentColor = "#E50914";

  return (
    <div
      ref={sectionRef}
      className={`relative w-full transition-all duration-700 ease-out overflow-visible ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{
        background: `linear-gradient(to bottom, transparent, rgb(8, 8, 16) 15%, rgb(8, 8, 16) 85%, transparent)`,
        backgroundImage: `linear-gradient(to bottom, transparent, rgba(8, 8, 16, 0.7) 15%, rgba(8, 8, 16, 0.7) 85%, transparent), radial-gradient(ellipse at 30% 50%, ${accentColor}26 0%, transparent 65%)`,
        maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
      }}
    >
      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-[1]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "300px" }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-10 px-5 md:px-14 py-16 md:py-20">
        {/* LEFT — Phone mockup */}
        <div className="w-full md:w-1/2 flex justify-center overflow-visible">
          <img 
            src={phoneImg} 
            alt="" 
            className="h-[260px] md:h-[360px] w-auto object-contain"
            style={{ 
              animation: "floatPhone 4s ease-in-out infinite",
              filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.8))"
            }}
          />
        </div>

        {/* RIGHT — Text */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
          <div className="text-[0.7rem] font-black text-[#00c3ff] uppercase tracking-[0.25em]">Premium Experience</div>
          <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-black text-white leading-[1.1]">
            Open the Gate to Stories That Stay With You.
          </h2>
          <p className="text-gray-500 text-[0.95rem] leading-relaxed max-w-[420px] mx-auto md:mx-0">
            Beyond the algorithm lies something rare — cinema shaped by human taste. Discover the films that define generations.
          </p>
          <Link
            to="/movies"
            onClick={() => window.scrollTo({ top: 0 })}
            className="self-center md:self-start inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(229,9,20,0.5)] active:scale-95"
            style={{ background: "linear-gradient(135deg, #E50914, #b0070f)" }}
          >
            <FaPlay size={13} />
            Explore Now
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

export default CinematicMarketingBanner;


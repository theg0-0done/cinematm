import React from "react";

const Loading = ({ small }) => {
  const size = small ? "w-8 h-8" : "w-14 h-14";
  const itemHeight = small ? "h-[8px]" : "h-[12px]";
  const itemWidth = small ? "w-[2px]" : "w-[4px]";
  const translateDist = small ? "-10px" : "-16px";

  return (
    <div className={`flex flex-col items-center justify-center ${small ? "" : "min-h-[400px]"} gap-${small ? "2" : "6"}`}>
      <div className={`relative ${size}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${itemWidth} ${itemHeight} bg-[#00c3ff] rounded-full`}
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(${translateDist})`,
              animation: "loading-fade 1.2s linear infinite",
              animationDelay: `${i * 0.1}s`,
              opacity: 0.1,
              boxShadow: !small ? "0 0 8px rgba(0, 195, 255, 0.4)" : "none",
            }}
          />
        ))}
      </div>
      {!small && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-[#00c3ff] font-bold text-[0.75rem] tracking-[0.3em] uppercase opacity-80">
            Loading
          </p>
          <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/40 to-transparent" />
        </div>
      )}

      <style>{`
        @keyframes loading-fade {
          0% { opacity: 1; filter: brightness(1.5); }
          100% { opacity: 0.1; filter: brightness(1); }
        }
      `}</style>
    </div>
  );
};

export default Loading;

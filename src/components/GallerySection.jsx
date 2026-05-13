import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IoClose, IoChevronBack, IoChevronForward, IoExpand } from "react-icons/io5";

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(images.length - 1, c + 1)), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.93)" }} onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 cursor-pointer" onClick={onClose}>
        <IoClose size={20} />
      </button>
      {current > 0 && (
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#00c3ff] transition-colors z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); prev(); }}>
          <IoChevronBack size={24} />
        </button>
      )}
      <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <img src={`https://image.tmdb.org/t/p/original${images[current].file_path}`} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" />
        <div className="text-center text-gray-500 text-sm mt-3 font-medium">{current + 1} / {images.length}</div>
      </div>
      {current < images.length - 1 && (
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#00c3ff] transition-colors z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); next(); }}>
          <IoChevronForward size={24} />
        </button>
      )}
    </div>,
    document.body
  );
}

function GallerySection({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  if (!images) return null;
  const allBackdrops = (images.backdrops || []).filter(b => (b.aspect_ratio || 0) >= 1.2);
  if (allBackdrops.length === 0) return null;

  const displayImages = showAll ? allBackdrops : allBackdrops.slice(0, 12);
  const hasMore = allBackdrops.length > 12 && !showAll;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[1.8rem] font-bold text-white border-l-4 border-[#00c3ff] pl-[15px] m-0">Gallery</h2>
        <span className="text-[0.8rem] text-gray-500 font-medium">· {displayImages.length} photos</span>
      </div>

      {/* CSS Columns Masonry */}
      <div className="[column-count:2] sm:[column-count:3] lg:[column-count:4] [column-gap:8px]">
        {displayImages.map((img, i) => (
          <div key={img.file_path + i} className="relative break-inside-avoid mb-2 rounded-lg overflow-hidden cursor-pointer group/img" onClick={() => setLightboxIndex(i)}>
            <img
              src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
              alt=""
              className="w-full h-auto object-cover block transition-all duration-300 group-hover/img:scale-[1.02] group-hover/img:brightness-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <IoExpand size={22} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button onClick={() => setShowAll(true)} className="mt-5 text-[0.85rem] text-gray-500 hover:text-[#00c3ff] transition-colors cursor-pointer border-none bg-transparent font-medium">
          View All {allBackdrops.length} Images →
        </button>
      )}

      {lightboxIndex !== null && (
        <Lightbox images={displayImages} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

export default GallerySection;

import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";

function ReviewsSection({ reviews }) {
  const [page, setPage] = useState(0);
  const [sliding, setSliding] = useState(null); // 'left' | 'right' | null
  const perPage = 3;

  if (!reviews?.length) return null;

  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  const navigate = (dir) => {
    const next = dir === "next"
      ? Math.min(totalPages - 1, page + 1)
      : Math.max(0, page - 1);
    if (next === page) return;

    setSliding(dir === "next" ? "left" : "right");
    setTimeout(() => {
      setPage(next);
      setSliding(null);
    }, 280);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[1.8rem] font-bold text-white border-l-4 border-[#00c3ff] pl-[15px] m-0">
          Reviews
          <span className="text-[1rem] font-normal text-gray-400 ml-[12px]">
            ({reviews.length})
          </span>
        </h2>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => navigate("prev")}
            disabled={page === 0}
            className="w-[36px] h-[36px] rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00c3ff] hover:border-[#00c3ff] cursor-pointer bg-white/5"
          >
            <FaChevronLeft size={12} />
          </button>
          <span className="text-gray-400 text-[0.85rem] tabular-nums">{page + 1} / {totalPages}</span>
          <button
            onClick={() => navigate("next")}
            disabled={page >= totalPages - 1}
            className="w-[36px] h-[36px] rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00c3ff] hover:border-[#00c3ff] cursor-pointer bg-white/5"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Cards with slide animation */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-[16px]"
        style={{
          transition: "opacity 0.28s ease, transform 0.28s ease",
          opacity: sliding ? 0 : 1,
          transform: sliding === "left"
            ? "translateX(-24px)"
            : sliding === "right"
            ? "translateX(24px)"
            : "translateX(0)",
        }}
      >
        {visible.map((review) => {
          const rating = review.author_details?.rating;
          const avatar = review.author_details?.avatar_path;
          const avatarSrc = avatar
            ? avatar.startsWith("/https")
              ? avatar.slice(1)
              : `https://image.tmdb.org/t/p/w45${avatar}`
            : null;

          return (
            <div
              key={review.id}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-[20px] flex flex-col gap-[14px] hover:border-white/20 transition-colors duration-200"
            >
              <div className="flex items-center gap-[10px]">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={review.author}
                    className="w-[38px] h-[38px] rounded-full object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-[38px] h-[38px] rounded-full bg-[#00c3ff]/20 border border-[#00c3ff]/30 flex items-center justify-center text-[#00c3ff] font-bold text-[0.9rem] shrink-0">
                    {review.author?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="m-0 font-semibold text-white text-[0.9rem] truncate">{review.author}</p>
                  {rating && (
                    <div className="flex items-center gap-[4px] text-[#ffd700] text-[0.78rem] mt-[2px]">
                      <FaStar size={10} /> {rating}/10
                    </div>
                  )}
                </div>
                <FaQuoteLeft className="ml-auto shrink-0 text-white/10 text-[1.2rem]" />
              </div>
              <p className="m-0 text-[0.88rem] text-gray-400 leading-[1.65] line-clamp-5">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewsSection;

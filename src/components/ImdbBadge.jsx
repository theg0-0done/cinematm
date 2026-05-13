/**
 * ImdbBadge — links to IMDb page for a movie/show or person.
 * @param {string} imdbId  — IMDb ID (e.g. "tt1234567" or "nm1234567")
 * @param {"title"|"name"} variant — "title" for movies/shows, "name" for people
 */
function ImdbBadge({ imdbId, variant = "title" }) {
  if (!imdbId) return null;

  const href = `https://www.imdb.com/${variant}/${imdbId}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-full font-bold text-[0.82rem] no-underline transition-all duration-300 border cursor-pointer
        bg-[#F5C518]/10 border-[#F5C518]/40 text-[#F5C518] hover:bg-[#F5C518]/20 hover:border-[#F5C518]/70 hover:shadow-[0_0_14px_rgba(245,197,24,0.35)]"
    >
      <span
        className="bg-[#F5C518] text-black text-[0.7rem] font-black px-[5px] py-[1px] rounded-[4px] leading-tight"
        aria-hidden
      >
        IMDb
      </span>
      View on IMDb
    </a>
  );
}

export default ImdbBadge;

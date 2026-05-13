const ratingColor = {
  G: "border-green-500/60 text-green-400 bg-green-500/10",
  PG: "border-green-500/60 text-green-400 bg-green-500/10",
  "PG-13": "border-yellow-400/60 text-yellow-300 bg-yellow-400/10",
  "TV-Y": "border-green-500/60 text-green-400 bg-green-500/10",
  "TV-G": "border-green-500/60 text-green-400 bg-green-500/10",
  "TV-PG":"border-yellow-400/60 text-yellow-300 bg-yellow-400/10",
  "TV-14":"border-yellow-400/60 text-yellow-300 bg-yellow-400/10",
  "TV-MA":"border-red-500/60 text-red-400 bg-red-500/10",
  R:      "border-red-500/60 text-red-400 bg-red-500/10",
  "NC-17":"border-red-500/60 text-red-400 bg-red-500/10",
  NR:     "border-white/20 text-gray-400 bg-white/5",
};

function CertificationBadge({ certification }) {
  if (!certification) return null;
  const cls = ratingColor[certification] || "border-white/20 text-gray-400 bg-white/5";
  return (
    <span
      className={`px-[10px] py-[2px] rounded-full border text-[0.75rem] font-bold tracking-wider ${cls}`}
    >
      {certification}
    </span>
  );
}

export default CertificationBadge;

import { useContext } from "react";
import { CinemaContext } from "../context/CinemaContext";
import ReactStars from "react-stars";

function EpisodeCard({ ep }) {
  const { formatDate } = useContext(CinemaContext);

  return (
    <div className="flex border border-gray-500 rounded-[8px] p-[4px] whitespace-normal gap-[8px] w-[46vw] lg:flex-col lg:w-fit">
      <img
        className="w-[20vw] lg:w-[18vw] rounded-[4px] object-cover"
        src={
          ep.still_path
            ? `https://image.tmdb.org/t/p/w780${ep.still_path}`
            : "https://preview.redd.it/qm5q37j0ba931.png?width=1080&crop=smart&auto=webp&s=6aaf20d7f0e8e65ab87c8e9b720ea6b0207776ca"
        }
        alt={ep.name}
      />
      <div className="w-full lg:flex lg:flex-col lg:justify-between lg:h-full">
        <p className="max-w-[65%] lg:max-w-full">
          <strong className="text-white text-sm lg:text-base line-clamp-2">{ep.name}</strong>
        </p>

        <div className="flex justify-between items-center text-[10px] lg:text-sm text-gray-400 mt-1">
          {Date() > ep.air_date && <p>{ep.runtime} min</p>}
          <p>
            {Date() < ep.air_date && "Coming In: "} {formatDate(ep.air_date)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCard;

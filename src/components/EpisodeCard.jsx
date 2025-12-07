import { useContext } from "react";
import { CenimaContext } from "../context/CenimaContext";
import ReactStars from "react-stars";

function EpisodeCard({ ep }) {
  const { formatDate } = useContext(CenimaContext);
  //   console.log(ep.air_date < Date() ? "not  yet" : "passed");

  return (
    <div className="ep-card">
      <img
        src={
          ep.still_path
            ? `https://image.tmdb.org/t/p/w1280${ep.still_path}`
            : "https://preview.redd.it/qm5q37j0ba931.png?width=1080&crop=smart&auto=webp&s=6aaf20d7f0e8e65ab87c8e9b720ea6b0207776ca"
        }
        alt={ep.name}
      />
      <div className="ep-details">
        <p style={{ maxWidth: "65%" }}>
          <strong>{ep.name}</strong>
        </p>

        <div className="ep-infos">
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

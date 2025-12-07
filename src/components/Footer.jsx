import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <h2 style={{ margin: 0 }} className="logo">
            CinemaTV
          </h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
            alias quasi ab, perferendis rem ullam fuga ipsam nesciunt
            perspiciatis, dolor voluptas odit veritatis velit labore. Sit sint
            laboriosam consequatur illum.
          </p>
        </div>
        <div className="quicktab-container">
          <h3>Quick Tabs:</h3>
          <div className="quick-tabs">
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/"
              className="footer-link"
            >
              Home
            </Link>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/movies"
              className="footer-link"
            >
              Movies
            </Link>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/tv-shows"
              className="footer-link"
            >
              Tv Shows
            </Link>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/watchlist"
              className="footer-link"
            >
              Watchlist
            </Link>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/athenticate/log-in"
              className="footer-link"
            >
              Log In
            </Link>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to="/athenticate/register"
              className="footer-link"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="download-container">
          <h3>Get The App: </h3>
          <article>
            <FaAppStoreIos size={50} />
            <div className="download-infos">
              <h3>Get in on</h3>
              <p>App Store</p>
            </div>
          </article>
          <article>
            <FaGooglePlay size={40} />
            <div className="download-infos">
              <h3>Get in on</h3>
              <p>Google Play</p>
            </div>
          </article>
        </div>
      </div>
      <p className="copyright">&copy; MovieApp 2025. All rights reserved</p>
    </footer>
  );
}

export default Footer;

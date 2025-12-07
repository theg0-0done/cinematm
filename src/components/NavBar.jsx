import { useContext } from "react";
import { CenimaContext } from "../context/cenimaContext";
import { Link } from "react-router-dom";

function NavBar() {
  const { open, setOpen } = useContext(CenimaContext);

  return (
    <div className="navbar">
      <Link
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        to="/"
        className="logo"
      >
        CinemaTV
      </Link>
      <div
        className={`ham-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="nav-links">
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/tv-shows"
        >
          Tv Shows
        </Link>
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/watchlist"
        >
          Watchlist
        </Link>
      </div>

      <div className="nav-links">
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/athenticate/log-in"
        >
          Log In
        </Link>
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link"
          to="/athenticate/register"
        >
          Register
        </Link>
      </div>

      <div className="ham-menu" style={open ? { right: "-1rem" } : null}>
        <Link onClick={() => setOpen(!open)} className="link" to="/">
          Home
        </Link>
        <Link onClick={() => setOpen(!open)} className="link" to="/movies">
          Movies
        </Link>
        <Link onClick={() => setOpen(!open)} className="link" to="/tv-shows">
          Tv Shows
        </Link>
        <Link onClick={() => setOpen(!open)} className="link" to="/watchlist">
          Watchlist
        </Link>
        <Link
          onClick={() => setOpen(!open)}
          className="link"
          to="/athenticate/log-in"
        >
          Log in
        </Link>
        <Link
          onClick={() => setOpen(!open)}
          className="link"
          to="/athenticate/register"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default NavBar;

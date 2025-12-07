import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Athentication() {
  const { method } = useParams();

  return (
    <section
      style={{
        backgroundImage:
          "url(https://i.pinimg.com/1200x/b6/79/be/b679be26a6c32c92aef7a3fba414e5d6.jpg)",
      }}
      className="athenticate-background movie-background"
    >
      <div className="athenticate-page">
        <h1 className="category-title">
          {method.split("-").join(" ").toUpperCase()}
        </h1>
        {method === "register" ? (
          <form className="athenticate-form">
            <input type="text" placeholder="Email Address" />
            <input
              type="text"
              name="search"
              className=""
              placeholder="Password"
            />
            <input type="password" placeholder="Confirm Password" />

            <Link to="/">
              <button type="submit">Register</button>
            </Link>
          </form>
        ) : (
          <form className="athenticate-form">
            <input type="text" placeholder="Email Address | Username" />
            <input type="password" placeholder="Password" />

            <Link to="/">
              <button type="submit">Register</button>
            </Link>
          </form>
        )}
        <p>
          You already have an account, click{" "}
          <strong>
            <Link
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              to={
                method === "register"
                  ? "/athenticate/log-in"
                  : "/athenticate/register"
              }
              style={{ color: "#57EBDE" }}
              className="nav-link"
            >
              {method === "register" ? "Log In" : "Register"}
            </Link>
          </strong>
        </p>
      </div>
    </section>
  );
}

export default Athentication;

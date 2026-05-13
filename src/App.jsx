import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import Movies from "./pages/AllMoviesPage";
import NavBar from "./components/NavBar";
import MoviePage from "./pages/MoviePage";
import ShowPage from "./pages/ShowPage";
import Authentication from "./pages/Authentication";
import ActorPage from "./pages/ActorPage";
import CollectionPage from "./pages/CollectionPage";
import Error404 from "./pages/Error404";

function App() {
  return (
    <div className="app-root relative min-h-screen isolation-auto">
      <div className="ambient-bg" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <NavBar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType" element={<Movies />} />
          <Route path="/:mediaType/:category" element={<Movies />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/tv/:id" element={<ShowPage />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/authenticate/:method" element={<Authentication />} />
          <Route path="*" element={<Error404 />}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


export default App;

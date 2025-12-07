import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/phoneStyles.css";
import "./styles/tabletStyles.css";
import "./styles/laptopStyles.css";
import "./styles/desktop.styles.css";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Movies from "./pages/AllMoviesPage";
import NavBar from "./components/NavBar";
import MoviePage from "./pages/moviePage";
import ShowPage from "./pages/ShowPage";
import Athentication from "./pages/Athentication";
import Error404 from "./pages/Error404";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType" element={<Movies />} />
        <Route path="/:mediaType/:category" element={<Movies />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/tv/:id" element={<ShowPage />} />
        <Route path="/athenticate/:method" element={<Athentication />} />
        <Route path="*" element={<Error404 />}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;

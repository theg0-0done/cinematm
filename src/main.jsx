import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CinemaProvider } from "./context/CinemaContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CinemaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CinemaProvider>
  </StrictMode>
);

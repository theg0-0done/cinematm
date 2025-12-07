import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/phoneStyles.css";
import "./styles/tabletStyles.css";
import "./styles/laptopStyles.css";
import "./styles/desktop.styles.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CenimaProvider } from "./context/CenimaContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CenimaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CenimaProvider>
  </StrictMode>
);

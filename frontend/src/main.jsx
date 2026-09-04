import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CurrentUserProvider } from "./components/CurrentUser.jsx";
import "./output.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </StrictMode>
  </BrowserRouter>,
);

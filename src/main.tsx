import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import SessionGate from "./components/auth/SessionGate.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionGate>
        <App />
      </SessionGate>
    </BrowserRouter>
  </StrictMode>,
);

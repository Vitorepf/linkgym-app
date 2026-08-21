import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoot } from "./app-root";
import "./styles.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);

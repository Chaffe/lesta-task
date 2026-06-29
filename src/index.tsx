import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { StoreWrapper } from "@/stores/Provider";

import "@/scss/app.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <StoreWrapper>
        <App />
      </StoreWrapper>
    </BrowserRouter>
  </StrictMode>,
);

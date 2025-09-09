import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { WagmiProviderWrapper } from "./providers";
import "./App.css"; // Importe o arquivo CSS

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root-react-app");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <WagmiProviderWrapper>
          <App />
          <Toaster containerStyle={{ position: 'fixed',top: "2.5rem" }} />
        </WagmiProviderWrapper>
      </React.StrictMode>
    );
  } else {
    console.warn("Elemento #root-react-app não encontrado.");
  }
});

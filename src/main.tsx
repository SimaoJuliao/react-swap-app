import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { WagmiProviderWrapper } from "./providers";
import "./App.css"; // Importe o arquivo CSS
import { Tooltip } from "react-tooltip";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root-react-app");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <WagmiProviderWrapper>
          <App />
          <Toaster containerStyle={{ position: "fixed", top: "2.5rem" }} />
          <Tooltip
            id="slippage-tooltip"
            opacity={1}
            style={{
              color: "#280D5F",
              backgroundColor: "rgb(234 235 237)",
              maxWidth: "18rem",
              borderRadius: "1rem",
            }}
          />
        </WagmiProviderWrapper>
      </React.StrictMode>
    );
  } else {
    console.warn("Elemento #root-react-app não encontrado.");
  }
});

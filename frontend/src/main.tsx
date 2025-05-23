/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ContractProvider } from "./context/ContractContext";
import { WalletProvider } from "./context/WalletContext";
import "./index.css";

// Ensure we have a root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create root and render app with providers
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <ContractProvider>
          <App />
        </ContractProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);

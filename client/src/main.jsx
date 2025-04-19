import React from "react";
import { createRoot } from "react-dom/client"; // Correct import for React 18
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppContextProvider } from "./context/AppContext.jsx";

// Get the root element
const container = document.getElementById("root");

// Use createRoot to create a React root
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);

import React from "react";
import { createRoot } from "react-dom/client"; // Correct import for React 18
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const root = createRoot(document.getElementById("root")); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
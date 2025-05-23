import React from "react";
import { createRoot } from "react-dom/client"; 
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
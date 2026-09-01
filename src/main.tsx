import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./config/amplify";
import App from "./App";
import "./App.css";
import "./styles/theme.css";
import "./styles/global.css";

/**
 * Entry point for the PetPath web portal.
 * Render the React app into the root element from index.html
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
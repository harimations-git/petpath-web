import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./config/amplify";

import App from "./App";

import "./App.css";
import "./styles/theme.css";
import "./styles/global.css";

import { OrganisationProfileProvider } from "./context/OrganisationProfileContext";
import { OrganisationListingsProvider } from "./context/OrganisationListingsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <OrganisationProfileProvider>
                <OrganisationListingsProvider>
                    <App />
                </OrganisationListingsProvider>
            </OrganisationProfileProvider>
        </BrowserRouter>
    </React.StrictMode>
);
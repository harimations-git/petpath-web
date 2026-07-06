import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "./constants/routes";
import Login from "./pages/auth/Login";
import AccountType from "./pages/auth/AccountType";
import RegisterShelter from "./pages/auth/RegisterShelter";
import Dashboard from "./pages/dashboard/Dashboard";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AccountReview from "./pages/auth/AccountReview";
//import CreatePetListing from "./pages/listings/CreatePetListing";
//import MyListings from "./pages/listings/MyListings";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={routes.auth.login} replace />} />

            <Route path={routes.auth.login} element={<Login />} />
            <Route path={routes.auth.accountType} element={<AccountType />} />
            <Route path={routes.auth.registerShelter} element={<RegisterShelter />} />
            <Route path={routes.auth.verifyEmail} element={<VerifyEmail />} />
            <Route path={routes.auth.accountReview} element={<AccountReview />} />
            <Route path={routes.home.dashboard} element={<Dashboard />} />
        </Routes>
    );
}
import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "./constants/routes";

import Login from "./pages/auth/Login";
import AccountType from "./pages/auth/AccountType";
import RegisterShelter from "./pages/auth/RegisterShelter";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AccountReview from "./pages/auth/AccountReview";

import Dashboard from "./pages/dashboard/Dashboard";
import OrganisationProfileSetup from "./pages/profile/ProfileSetup";
import ShelterLayout from "./layouts/ShelterLayout";

//import CreatePetListing from "./pages/listings/CreatePetListing";
//import MyListings from "./pages/listings/MyListings";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={routes.auth.login} replace />} />

            {/*Onboarding*/}
            <Route path={routes.auth.login} element={<Login />} />
            <Route path={routes.auth.accountType} element={<AccountType />} />
            <Route path={routes.auth.registerShelter} element={<RegisterShelter />} />
            <Route path={routes.auth.verifyEmail} element={<VerifyEmail />} />
            <Route path={routes.auth.accountReview} element={<AccountReview />} />
            <Route path={routes.home.profileSetup} element={<OrganisationProfileSetup />} />

            {/*Logged-in shelter pages with sidebar*/}
            <Route element={<ShelterLayout />}>
                <Route
                    path={routes.home.dashboard}
                    element={<Dashboard />}
                />
            </Route>

            {/*Unkown route fallback*/}
            <Route
                path="*"
                element={
                    <Navigate
                        to={routes.auth.login}
                        replace
                    />
                }
            />
        </Routes>
    );
}
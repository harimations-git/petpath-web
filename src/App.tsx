import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "./constants/routes";

import Login from "./pages/auth/Login";
import AccountType from "./pages/auth/AccountType";
import RegisterShelter from "./pages/auth/RegisterShelter";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AccountReview from "./pages/auth/AccountReview";

import ShelterLayout from "./layouts/ShelterLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import OrganisationProfileSetup from "./pages/profile/ProfileSetup";
import MyListings from "./pages/dashboard/MyListings";
import CreateListing from "./pages/dashboard/CreateListing";
import StatusUpdates from "./pages/dashboard/StatusUpdates";
import Settings from "./pages/dashboard/Settings";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Support from "./pages/dashboard/Support";
import ViewListing from "./pages/listings/ViewListing";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

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
            <Route path={routes.auth.forgotPassword} element={<ForgotPassword />} />

            {/*Logged-in shelter pages with sidebar*/}
            <Route element={<ShelterLayout />}>
                <Route
                    path={routes.home.dashboard}
                    element={<Dashboard />}
                />

                <Route
                    path={routes.home.myListings}
                    element={<MyListings />}
                />

                <Route
                    path={routes.home.createListing}
                    element={<CreateListing />}
                />

                <Route
                    path={routes.listings.view}
                    element={<ViewListing />}
                />

                <Route
                    path={routes.home.status}
                    element={<StatusUpdates />}
                />

                <Route
                    path={routes.home.settings}
                    element={<Settings />}
                />



                {/*Help and Legal */}

                <Route
                    path={routes.help.support}
                    element={<Support />}
                />

                <Route
                    path={routes.legal.privacyPolicy}
                    element={<PrivacyPolicy />}
                />

                <Route
                    path={routes.legal.terms}
                    element={<TermsOfService />}
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
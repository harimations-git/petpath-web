import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "./constants/routes";

import Login from "./pages/auth/Login";
import AccountType from "./pages/auth/AccountType";
import RegisterShelter from "./pages/auth/RegisterShelter";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AccountReview from "./pages/auth/AccountReview";

import ShelterLayout from "./layouts/ShelterLayout";

import Dashboard from "./pages/organisation/dashboard/Dashboard";
import OrganisationProfileSetup from "./pages/organisation/profile/ProfileSetup";
import MyListings from "./pages/organisation/dashboard/MyListings";
import CreateListing from "./pages/organisation/dashboard/CreateListing";
import StatusUpdates from "./pages/organisation/dashboard/StatusUpdates";
import Settings from "./pages/organisation/dashboard/Settings";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Support from "./pages/organisation/dashboard/Support";
import ViewListing from "./pages/organisation/listings/ViewListing";
import PrivacyPolicy from "./pages/organisation/legal/PrivacyPolicy";
import TermsOfService from "./pages/organisation/legal/TermsOfService";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import RoleProtectedRoute from "./components/routing/RoleProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import OrganisationProvidersRoute from "./components/routing/OrganisationProvidersRoute";

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={routes.auth.login}
                        replace
                    />
                }
            />

            {/* Public authentication routes */}

            <Route
                path={routes.auth.login}
                element={<Login />}
            />

            <Route
                path={routes.auth.accountType}
                element={<AccountType />}
            />

            <Route
                path={routes.auth.registerShelter}
                element={<RegisterShelter />}
            />

            <Route
                path={routes.auth.verifyEmail}
                element={<VerifyEmail />}
            />

            <Route
                path={routes.auth.forgotPassword}
                element={<ForgotPassword />}
            />

            {/* Public legal routes */}

            <Route
                path={routes.legal.privacyPolicy}
                element={
                    <PrivacyPolicy
                        layout="public"
                    />
                }
            />

            <Route
                path={routes.legal.terms}
                element={
                    <TermsOfService
                        layout="public"
                    />
                }
            />

            {/*Routes that require authorisation */}
            <Route element={<ProtectedRoute />}>
                {/* Organisation-only routes */}

                {/*Stores the caches organisation listing details */}
                <Route element={<OrganisationProvidersRoute />}>
                    <Route
                        element={
                            <RoleProtectedRoute requiredRole="organisation" />
                        }
                    >
                        {/* Organisation pages without sidebar */}

                        <Route
                            path={routes.auth.accountReview}
                            element={<AccountReview />}
                        />

                        <Route
                            path={routes.home.profileSetup}
                            element={<OrganisationProfileSetup />}
                        />

                        {/* Organisation pages with sidebar */}

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

                            <Route
                                path={routes.help.support}
                                element={<Support />}
                            />

                            <Route
                                path={routes.legal.shelterTerms}
                                element={
                                    <TermsOfService
                                        layout="shelter"
                                    />
                                }
                            />

                            <Route
                                path={
                                    routes.legal
                                        .shelterPrivacyPolicy
                                }
                                element={
                                    <PrivacyPolicy
                                        layout="shelter"
                                    />
                                }
                            />
                        </Route>
                    </Route>
                </Route>

                {/* Admin-only routes */}

                <Route
                    element={
                        <RoleProtectedRoute
                            requiredRole="admin"
                        />
                    }
                >
                    <Route element={<AdminLayout />}>
                        <Route
                            path={routes.admin.dashboard}
                            element={<AdminDashboard />}
                        />

                        {/*
                        Add these when the pages exist:

                        <Route
                            path={routes.admin.organisations}
                            element={<OrganisationReviews />}
                        />

                        <Route
                            path={routes.admin.listings}
                            element={<ListingReviews />}
                        />
                        */}
                    </Route>
                </Route>
            </Route>

            {/* Unknown route fallback */}

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

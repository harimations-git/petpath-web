export const routes = {
    auth: {
        login: "/login",
        registerShelter: "/register",
        forgotPassword: "/forgot-password",
        accountType: "/accountType",
        verifyEmail: "/verifyEmail",
        accountReview: "/accountReview"
    },

    home: {
        dashboard: "/dashboard",
        myListings: "/myListings",
        createListing: "/createListing",
        status: "/status",
        settings: "/settings",
        profileSetup: "/profile/setup",
    },

    help: {
        support: "/support",
    },

    legal: {
        terms: "/terms",
        privacyPolicy: "/privacy-policy",

        shelterTerms: "/help/terms",
        shelterPrivacyPolicy: "/help/privacy-policy",
    },

    admin: {
        dashboard: "/admin/dashboard",
        organisations: "/admin/organisations",
        listings: "/admin/listings",
        pending: {
            organisations: "/admin/pending-organisations",
            listings: "/admin/pending-listings",
            listingReview: (listingId: string) =>
                `/admin/listings/${encodeURIComponent(listingId)}`,
        }
    },

    listings: {
        view: "/listings/view/:listingId",
        viewListing: (listingId: string) =>
            `/listings/view/${listingId}`,
    },
} as const;

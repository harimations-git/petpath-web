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
        support: "/support"
    },

    legal: {
        terms: "/terms",
        privacyPolicy: "/privacy-policy",

        shelterTerms: "/settings/terms",
        shelterPrivacyPolicy: "/settings/privacy-policy",
    },

    listings: {
        view: "/listings/view/:listingId",
        viewListing: (listingId: string) =>
            `/listings/view/${listingId}`,
    },
} as const;

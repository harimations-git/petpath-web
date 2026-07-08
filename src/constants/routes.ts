export const routes = {
    auth: {
        login: "/login",
        registerShelter: "/register",
        forgotPassword: "/forgot-password", //dont forget this!!!!
        accountType: "/accountType",
        verifyEmail: "/verifyEmail",
        accountReview: "/accountReview"
    },

    home: {
        dashboard: "/dashboard",
        myListings: "/myListings",
        createListing: "/createListing",
        settings: "/settings",
        profileSetup: "/profile/setup",
    },

    listings: {
        create: "/listings/new",
        mine: "/listings",
    },
} as const;
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
        status:"/status",
        settings: "/settings",
        profileSetup: "/profile/setup",
        support:"/support"
    },

    listings: {
        create: "/listings/new",
        mine: "/listings",
    },
} as const;
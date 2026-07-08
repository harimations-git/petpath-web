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
        profileSetup: "/profile/setup",
    },

    listings: {
        create: "/listings/new",
        mine: "/listings",
    },
} as const;
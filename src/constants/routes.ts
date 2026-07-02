export const routes = {
    auth: {
        login: "/login",
        registerShelter: "/register",
        forgotPassword: "/forgot-password"
    },

    home: {
        dashboard: "/dashboard",
    },

    listings: {
        create: "/listings/new",
        mine: "/listings",
    },
} as const;
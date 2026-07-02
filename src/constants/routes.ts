export const routes = {
    auth: {
        login: "/login",
        registerShelter: "/register",
    },

    home: {
        dashboard: "/dashboard",
    },

    listings: {
        create: "/listings/new",
        mine: "/listings",
    },
} as const;
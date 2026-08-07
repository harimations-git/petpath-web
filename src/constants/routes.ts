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

    listings: {
        view: "/listings/view/:listingId",
        viewListing: (listingId: string) =>
            `/listings/view/${listingId}`,
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
        organisations: {
            allOrganisations: "/admin/allOrganisations",

            viewProfile: "/admin/organisations/:organisationId",
            details: (organisationId: string) =>
                `/admin/organisations/${encodeURIComponent(organisationId)}`,

            pendingOrganisations: "/admin/pending-organisations",
        },

        listings: {
            allListings: "/admin/listings",

            listingReviewPath: "/admin/listing/:listingId",
            listingReview: (listingId: string) =>
                `/admin/listing/${encodeURIComponent(listingId)}`,

            pendingListings: "/admin/pending-listings",
        }
    },
} as const;

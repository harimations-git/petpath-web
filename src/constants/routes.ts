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
            pendingOrganisations: "/admin/pending-organisations",
            organisationReviewPath: "/admin/organisation/:organisationId",
            organisationReview: (organisationId: string) =>
                `/admin/organisation/${encodeURIComponent(organisationId)}`,
        },

        listings: {
            allListings: "/admin/listings",
            pendingListings: "/admin/pending-listings",
            listingReviewPath: "/admin/listing/:listingId",
            listingReview: (listingId: string) =>
                `/admin/listing/${encodeURIComponent(listingId)}`,
        }
    },
} as const;

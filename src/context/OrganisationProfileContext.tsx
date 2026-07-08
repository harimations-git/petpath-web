import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    getCurrentOrganisationProfile,
    type OrganisationProfile,
} from "../services/organisation/organisationService";

type OrganisationProfileContextValue = {
    organisationProfile: OrganisationProfile | null;
    isLoadingProfile: boolean;
    profileError: string;
    refreshOrganisationProfile: () => Promise<OrganisationProfile | null>;
    updateCachedOrganisationProfile: (profile: OrganisationProfile) => void;
    clearCachedOrganisationProfile: () => void;
};

type OrganisationProfileProvideProps = {
    children: ReactNode
};

const OrganisationProfileContext = createContext<OrganisationProfileContextValue | null>(null);

/**
 * Module-level cache.
 * This stays running while the React app is running,
 * even if a component using the profile is unmounted
 */
let cachedOrganisationProfile: OrganisationProfile | null = null;

/**
 * Stores an API request that is in progress. If two components request the profile at the same time, they will share the same
 * request instead of creating two calls
 */
let pendingProfileRequest: Promise<OrganisationProfile> | null = null;

async function fetchOrganisationProfile(
    forceRefresh = false
): Promise<OrganisationProfile> {

    //return cached profile unless a fresh copy was requested
    if (cachedOrganisationProfile && !forceRefresh) {
        return cachedOrganisationProfile;
    }

    //reuse an exisiting request if one is already running
    if (pendingProfileRequest && !forceRefresh) {
        return pendingProfileRequest
    }

    pendingProfileRequest =
        getCurrentOrganisationProfile()
            .then((profile) => {
                cachedOrganisationProfile = profile;
                return profile;
            })
            .finally(() => {
                pendingProfileRequest = null;
            });

    return pendingProfileRequest;
}

export function OrganisationProfileProvider({
    children,
}: OrganisationProfileProvideProps) {
    const [organisationProfile, setOrganisationProfile] =
        useState<OrganisationProfile | null>(
            cachedOrganisationProfile
        );

    const [isLoadingProfile, setIsLoadingProfile] = useState(!cachedOrganisationProfile);

    const [profileError, setProfileError] = useState("");

    const loadOrganisationProfile = useCallback(
        async (
            forceRefresh = false
        ): Promise<OrganisationProfile | null> => {
            try {
                setIsLoadingProfile(true);
                setProfileError("");

                const profile =
                    await fetchOrganisationProfile(
                        forceRefresh
                    );

                setOrganisationProfile(profile);

                return profile;
            } catch (error) {
                console.error(
                    "Unable to load organisation profile:",
                    error
                );

                setProfileError(
                    "We couldn't load your organisation profile."
                );

                return null;
            } finally {
                setIsLoadingProfile(false);
            }
        },
        []
    );

    //Load the profile
    useEffect(() => {
        //Do not call API again if cached profile already exists.
        if (!cachedOrganisationProfile) {
            loadOrganisationProfile();
        }
    }, [loadOrganisationProfile]);

    //Reload the profile and force a refresh on the cache
    const refreshOrganisationProfile =
        useCallback(async () => {
            return loadOrganisationProfile(true);
        }, [loadOrganisationProfile]);

    //Function receives a new profile. Used after the user edits their details
    const updateCachedOrganisationProfile =
        useCallback((profile: OrganisationProfile) => {
            cachedOrganisationProfile = profile; //Stores profile outside the component state, so it can survive being re-rendered
            setOrganisationProfile(profile);
            setProfileError("");
        }, []);

    //Clear cached profile. Rests all stored profile information
    const clearCachedOrganisationProfile =
        useCallback(() => {
            cachedOrganisationProfile = null; //Clear cached profile
            pendingProfileRequest = null; //Clear all pending requests

            setOrganisationProfile(null);
            setProfileError("");
        }, []);

    //Creates object containing everything that should be shared through the context
    const contextValue = useMemo(
        () => ({
            organisationProfile,
            isLoadingProfile,
            profileError,
            refreshOrganisationProfile,
            updateCachedOrganisationProfile,
            clearCachedOrganisationProfile,
        }),
        //Dependency array. useMemo only creates a new context value when any one of these values change
        [
            organisationProfile,
            isLoadingProfile,
            profileError,
            refreshOrganisationProfile,
            updateCachedOrganisationProfile,
            clearCachedOrganisationProfile,
        ]
    );

    return (
        <OrganisationProfileContext.Provider
            value={contextValue}
        >
            {children}
        </OrganisationProfileContext.Provider>
    );
}

export function useOrganisationProfile() {
    const context = useContext(
        OrganisationProfileContext
    );

    if (!context) {
        throw new Error(
            "Error occurred. No user context found."
        );
    }

    return context;
}
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { OrganisationReviewDecision, OrganisationSortOrder, PendingOrganisation } from "../../types/admin/adminOrganisation";
import { getPendingOrganisations, reviewOrganisation } from "../../services/admin/adminOrganisationService";

/*
 * Custom hook responsible for getting the pending organisation's page
 *
 */
export function usePendingOrganisations() {
    const [organisations, setOrganisations] = useState<PendingOrganisation[]>([]);

    const [nextToken, setNextToken] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<OrganisationSortOrder>("oldest");

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [updatingOrganisationId, setUpdatingOrganisationId] = useState<string | null>(null);
    const [error, setError] = useState("");

    /*
     * Loads the first page of pending
     * organisation applications.
     */
    const loadOrganisations =
        useCallback(async () => {
            setIsLoading(true);
            setError("");

            try {
                //request the first page
                const data = await getPendingOrganisations(sortOrder);

                //replace current list with the newly loaded page
                setOrganisations(data.organisations);

                //save pagination token
                setNextToken(data.nextToken);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load organisations."
                );
            } finally {
                setIsLoading(false);
            }
        }, [sortOrder]);

    /*
    * Load the first page when the
    * component using the hook mounts.
    */
    useEffect(() => {
        void loadOrganisations();
    }, [loadOrganisations]);

    /*
     * Loads the next DynamoDB page and adds
     * it to the existing organisations.
     */
    const loadMore =
        useCallback(async () => {
            //stop if there is no page or another page is already loading
            if (!nextToken || isLoadingMore) {
                return;
            }

            setIsLoadingMore(true);
            setError("");

            try {
                //get the next page using the token and sort order
                const data = await getPendingOrganisations(sortOrder, nextToken);

                //update the organisations using the most 
                //recent version of the current state
                setOrganisations(
                    //create a set containing the ids of organisations already loaded
                    (currentOrganisations) => {
                        const existingIds =
                            new Set(
                                currentOrganisations.map(
                                    (organisation) =>
                                        organisation.organisationId
                                )
                            );

                        //remove any organisations from the new page that are already in the list
                        //prevents duplicates
                        const newOrganisations =
                            data.organisations.filter(
                                (organisation) =>
                                    !existingIds.has(
                                        organisation.organisationId
                                    )
                            );

                        //return a new array containing the exsiting organisations 
                        //followed by the new organisations
                        return [
                            ...currentOrganisations,
                            ...newOrganisations,
                        ];
                    }
                );

                //save the token for the following page
                setNextToken(data.nextToken);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load more organisations."
                );
            } finally {
                setIsLoadingMore(false);
            }
        }, [
            isLoadingMore,
            nextToken,
            sortOrder
        ]);

    /*
     * Approves or rejects an organisation.
     *
     * The first page is reloaded afterwards
     * so the reviewed organisation disappears.
     */
    const submitReview =
        useCallback(
            async (
                organisationId: string,
                decision: OrganisationReviewDecision,
                reason?: string
            ) => {
                //stop another review request from starting while one is already running
                if (updatingOrganisationId) {
                    return false;
                }

                //store the organiation being updated
                setUpdatingOrganisationId(organisationId);

                setError("");

                try {
                    //send the review decision to the api
                    await reviewOrganisation({
                        organisationId,
                        decision,
                        reason,
                    });

                    //reload the first page
                    await loadOrganisations();

                    return true;
                } catch (reviewError) {
                    setError(
                        reviewError instanceof Error
                            ? reviewError.message
                            : "Unable to review the organisation."
                    );

                    return false;
                } finally {
                    //clear the updating id
                    setUpdatingOrganisationId(null);
                }
            },
            [loadOrganisations, updatingOrganisationId]
        );

    /*
     * Creates the list that should be displayed
     * after applying the current search query.
     */
    const displayedOrganisations =
        useMemo(() => {
            //clean up the search query 
            const normalisedSearch = searchQuery.trim().toLowerCase();

            if (!normalisedSearch) {
                return organisations;
            }

            //keep organisations where at least one searchable value contains the search text
            return organisations.filter(
                //allows searching by name, id and email
                (organisation) =>
                    [
                        organisation.charityName,
                        organisation.charityId,
                        organisation.email,
                    ].some((value) =>
                        value.toLowerCase().includes(normalisedSearch) //turn each value to lowercase before comparing it
                    )
            );
        }, [organisations, searchQuery]);

    /**
     * Finds the submission date of 
     * the olest organisation currently loaded
     */
    const oldestSubmittedAt = organisations.length > 0 ?
        //create a copy because sort changes the original array
        [...organisations].sort((first, second) =>
            new Date(first.submittedAt).getTime() - new Date(second.submittedAt).getTime())[0].submittedAt
        : null;

    return {
        organisations,
        displayedOrganisations,

        pendingCount: organisations.length,

        oldestSubmittedAt,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        updatingOrganisationId,

        error,

        hasMore: Boolean(nextToken),

        loadMore,

        //retry loading the first page
        retry: loadOrganisations,

        //helper function that submits the approved decision
        approveOrganisation:
            (organisationId: string) =>
                submitReview(organisationId, "approved"),

        //helper function that submits the rejected decision with an optional reason
        rejectOrganisation:
            (organisationId: string, reason?: string) =>
                submitReview(organisationId, "rejected", reason),
    };
}
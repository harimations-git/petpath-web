import { useCallback, useEffect, useMemo, useState } from "react";
import { getApprovedOrganisations } from "../../services/admin/adminOrganisationService";
import type { ApprovedOrganisation } from "../../types/admin/adminOrganisation";
import type { SortOrder } from "../../types/filters";



export function useApprovedOrganisations() {
    const [organisations, setOrganisations] = useState<ApprovedOrganisation[]>([]);

    const [nextToken, setNextToken] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [error, setError] = useState("");

    const loadOrganisations =
        useCallback(async () => {
            setIsLoading(true);
            setError("");

            try {
                const result = await getApprovedOrganisations({ sortOrder });

                setOrganisations(result.organisations);

                setNextToken(result.nextToken ?? null);
            } catch (loadError) {
                setOrganisations([]);
                setNextToken(null);

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load approved organisations."
                );
            } finally {
                setIsLoading(false);
            }
        }, [sortOrder]);

    useEffect(() => {
        document.title = "All Organisations | PetPath";
    }, []);

    useEffect(() => {
        void loadOrganisations();
    }, [loadOrganisations]);

    const loadMore =
        useCallback(async () => {
            if (!nextToken || isLoadingMore) {
                return;
            }

            setIsLoadingMore(true);
            setError("");

            try {
                const result = await getApprovedOrganisations({ sortOrder, nextToken, });

                setOrganisations(
                    (currentOrganisations) => {
                        const organisationById =
                            new Map(currentOrganisations.map(
                                (organisation) => [organisation.organisationId, organisation]
                            )
                            );

                        for (const organisation of result.organisations) {
                            organisationById.set(organisation.organisationId, organisation);
                        }

                        return [...organisationById.values()];
                    }
                );

                setNextToken(result.nextToken ?? null);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load more organisations."
                );
            } finally {
                setIsLoadingMore(false);
            }
        }, [isLoadingMore, nextToken, sortOrder]);

    const displayedOrganisations =
        useMemo(() => {
            const searchValue = searchQuery.trim().toLowerCase();

            if (!searchValue) {
                return organisations;
            }

            return organisations.filter(
                (organisation) =>
                    [
                        organisation.charityName,
                        organisation.charityId,
                        organisation.email,
                    ].some((value) =>
                        value
                            .toLowerCase()
                            .includes(searchValue)
                    )
            );
        }, [organisations, searchQuery]);

    const latestApprovedAt =
        useMemo(() => {
            const approvalDates =
                organisations
                    .map(
                        (organisation) =>
                            organisation.reviewedAt ?? organisation.updatedAt
                    )
                    .filter(
                        (value): value is string => Boolean(value)
                    ).sort(
                        (first, second) =>
                            new Date(second).getTime() - new Date(first).getTime()
                    );

            return (approvalDates[0] ?? null);
        }, [organisations]);

    return {
        displayedOrganisations,

        approvedCount:
            organisations.length,

        latestApprovedAt,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        error,

        hasMore: Boolean(nextToken),

        loadMore,

        retry: loadOrganisations,
    };
}
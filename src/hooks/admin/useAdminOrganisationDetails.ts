import { useCallback, useEffect, useState } from "react";
import { deleteAdminOrganisation, getAdminOrganisationDetails } from "../../services/admin/adminOrganisationService";
import type { PublicOrganisationProfile } from "../../types/admin/adminOrganisation";

/**
 * Loads and manages an organisation profile for the admin view.
 * Handles loading, deletion and error states.
 */
export function useAdminOrganisationDetails(organisationId?: string) {
    const [organisation, setOrganisation] = useState<PublicOrganisationProfile | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    //Load the organisation details from the backend
    const loadOrganisation =
        useCallback(async () => {
            if (!organisationId) {
                setOrganisation(null);

                setError("Organisation ID is missing.");

                setIsLoading(false);

                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const result = await getAdminOrganisationDetails(organisationId);

                setOrganisation(result);
            } catch (error) {
                setOrganisation(null);

                setError(error instanceof Error
                    ? error.message
                    : "Unable to load organisation."
                );
            } finally {
                setIsLoading(false);
            }
        }, [organisationId]);

    //Function that deletes the organisation
    const deleteOrganisation =
        useCallback(async () => {
            if (!organisationId || isDeleting) {
                return false;
            }

            setIsDeleting(true);
            setDeleteError("");

            try {
                //api call
                await deleteAdminOrganisation(organisationId);

                return true;
            } catch (error) {
                setDeleteError(
                    error instanceof Error
                        ? error.message
                        : "Unable to delete organisation account."
                );

                return false;
            } finally {
                setIsDeleting(false);
            }
        }, [organisationId, isDeleting]);

    //Calls the load the organisation function when the page opens
    //Or when the loadOrganisation dependency changes
    useEffect(() => {
        void loadOrganisation();
    }, [loadOrganisation]);

    return {
        organisation,

        isLoading,
        isDeleting,

        error,
        deleteError,

        retry: loadOrganisation,
        deleteOrganisation
    };
}
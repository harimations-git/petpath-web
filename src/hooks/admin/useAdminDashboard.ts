import { useCallback, useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/admin/adminDashboardService";
import type { AdminDashboardData } from "../../types/admin/adminDashboard";


/**
 * Loads and manages the data displayed on the admin dashboard.
 * Handles the initial load, manual refreshes and error states.
 */
export function useAdminDashboard() {
    const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [error, setError] = useState("");

    //Load the latest admin dashboard data
    const loadDashboard =
        useCallback(
            async (forceRefresh = false) => {
                try {
                    if (forceRefresh) {
                        setIsRefreshing(true);
                    } else {
                        setIsLoading(true);
                    }

                    setError("");

                    const result = await getAdminDashboard(forceRefresh);

                    setDashboard(result);
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Unable to load the admin dashboard.";

                    setError(message);
                } finally {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            },
            []
        );

    useEffect(() => {
        document.title = "Admin Dashboard | PetPath";
    }, []);

    //Load dashboard data when the hook first runs
    useEffect(() => {
        void loadDashboard(true);
    }, [loadDashboard]);

    return {
        dashboard,
        isLoading,
        isRefreshing,
        error,

        refreshDashboard: () => loadDashboard(true),
    };
}
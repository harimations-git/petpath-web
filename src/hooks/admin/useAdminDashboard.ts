import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { getAdminDashboard } from "../../services/admin/adminDashboardService";
import type { AdminDashboardData } from "../../types/adminDashboard";

export function useAdminDashboard() {
    const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [error, setError] = useState("");

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
        void loadDashboard();
    }, [loadDashboard]);

    return {
        dashboard,
        isLoading,
        isRefreshing,
        error,

        refreshDashboard: () => loadDashboard(true),
    };
}
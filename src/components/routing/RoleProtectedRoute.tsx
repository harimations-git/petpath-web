import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentPortalRole, type PortalRole } from "../../services/auth/portalRole";
import { routes } from "../../constants/routes";
import LoadingSpinner from "../ui/LoadingSpinner";


type RoleProtectedRouteProps = {
    //Has to be a portal role, but not null
    requiredRole: Exclude<PortalRole, null>;
};

export default function RoleProtectedRoute({
    requiredRole,
}: RoleProtectedRouteProps) {
    const [currentRole, setCurrentRole] = useState<PortalRole>(null);

    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        // track if the component is still mounted, prevents react state getting updated 
        // after the user leaves this route
        let isMounted = true;

        //retrieve's the signed in user's role
        async function checkRole() {
            try {
                const role = await getCurrentPortalRole();

                if (isMounted) {
                    setCurrentRole(role);
                }
            } catch (error) {
                if (isMounted) {
                    setCurrentRole(null);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingRole(false);
                }
            }
        }

        //start the 
        void checkRole();

        //cleanup function when user navigates off ot it
        return () => {
            isMounted = false;
        };
    }, []);

    if (isCheckingRole) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Checking your access..."
            />
        );
    }

    if (currentRole !== requiredRole) {
        const fallbackRoute =
            currentRole === "admin"
                ? routes.admin.dashboard
                : currentRole === "organisation"
                  ? routes.home.dashboard
                  : routes.auth.login; //fallback

        return (
            <Navigate
                to={fallbackRoute}
                replace
            />
        );
    }

    return <Outlet />;
}
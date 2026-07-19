import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import LoadingSpinner from "../ui/LoadingSpinner";
import { routes } from "../../constants/routes";
import { useAuthSessionCheck } from "../../hooks/useAuthSessionCheck";

export default function ProtectedRoute() {
    const location = useLocation();

    const {isCheckingAuth, isSignedIn } = useAuthSessionCheck();

    if (isCheckingAuth) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Checking your session..."
            />
        );
    }

    if (!isSignedIn) {
        return (
            <Navigate
                to={routes.auth.login}
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}
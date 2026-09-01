import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirects the browser back button to a specific route.
 */
export function useBackButtonRedirect(redirectTo: string, enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    /*
     * Add the current page to the browser history so pressing
     * back triggers the popstate event instead of immediately
     * leaving the current flow.
    */
    window.history.pushState(null, "", window.location.href); //clears stack

    //Redirect the user when they press the browser back button
    function handleBackButton() {
      navigate(redirectTo, { replace: true });
    }

    //Listen for browser back/forward navigation
    //popstate fires when the user moves through their browser history
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [enabled, navigate, redirectTo]);
}
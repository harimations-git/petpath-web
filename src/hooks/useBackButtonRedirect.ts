import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useBackButtonRedirect(redirectTo: string, enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    window.history.pushState(null, "", window.location.href); //clears stack

    function handleBackButton() {
      navigate(redirectTo, { replace: true });
    }

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [enabled, navigate, redirectTo]);
}
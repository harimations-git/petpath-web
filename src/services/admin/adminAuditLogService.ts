import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * GET Request retrieves all of the admin audit logs from the backend database
 */
export async function exportAdminAuditLogs() {
    if (!API_BASE_URL) {
        throw new Error(
            "API base URL is missing."
        );
    }

    //get the admin authentication token
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
        throw new Error(
            "You must be signed in to export audit logs."
        );
    }

    //request the CSV from the backend
    const response =
        await fetch(
            `${API_BASE_URL}/admin/audit-logs/export`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );


    if (!response.ok) {
        let message = "Unable to export audit logs.";

        try {
            const data = await response.json();

            if (data.message) {
                message = data.message;
            }
        } catch {
            //use the default error message
        }

        throw new Error(message);
    }


    //convert the response into a downloadable file
    const csvBlob = await response.blob();

    const downloadUrl = URL.createObjectURL(csvBlob);


    //create a temporary link and download the CSV
    const link = document.createElement("a");

    const date = new Date().toISOString().slice(0, 10);

    link.href = downloadUrl;

    link.download = `petpath-audit-logs-${date}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(downloadUrl);
}
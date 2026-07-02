import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <main className="dashboard-page">
            <h1>Shelter Dashboard</h1>
            <p>Manage your PetPath listings.</p>

            <div className="dashboard-actions">
                <Link to="/listings/new">Create pet listing</Link>
                <Link to="/listings">View my listings</Link>
            </div>
        </main>
    );
}
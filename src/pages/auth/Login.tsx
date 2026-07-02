import { Link } from "react-router-dom"

import { routes } from "../../constants/routes";

import "./Login.css";
import { useEffect } from "react";

export default function Login() {
    useEffect(() => {
        document.title = "Log in | PetPath";
    }, []);
    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>PetPath Shelter Portal</h1>
                <p>Log in to manage your shelter listings.</p>

                <input placeholder="Email address" />
                <input placeholder="Password" type="password" />

                <button type="button">Log in</button>

                <p>
                    Need an account? <Link to={routes.auth.registerShelter}>Register shelter</Link>
                </p>
            </section>
        </main>
    )
}
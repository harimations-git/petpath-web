import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function RegisterShelter() {
    useEffect(() => {
            document.title = "Register Shelter | PetPath";
        }, []);
    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>Register Your Shelter</h1>
                <p>
                    Use your shelter ID to create an authorised PetPath account.
                </p>

                <input placeholder="Shelter ID" />
                <input placeholder="Shelter email address" />
                <input placeholder="Password" type="password" />
                <input placeholder="Confirm password" type="password" />

                <button type="button">Create shelter account</button>

                <p>
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
}
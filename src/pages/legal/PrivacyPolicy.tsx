import {
    ArrowLeft,
    Database,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import "./LegalPage.css";
import "../dashboard/PageHeading.css";
import { useNavigate } from "react-router-dom";


type PrivacyPolicyProps = {
    layout?: "public" | "shelter";
};

export default function PrivacyPolicy({
    layout = "public",
}: PrivacyPolicyProps) {

    const navigate = useNavigate();

    const isPublic = layout === "public";
    const pageClass = isPublic ? "legal-page" : "page";

    return (
        <main className={`${pageClass}-body`}>
            <header className={`${pageClass}-header`}>
                {isPublic && (
                    <div>
                        <button
                            type="button"
                            className="account-type-back"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={22} />
                        </button>
                    </div>
                )}

                <div className={`${pageClass}-heading`}>
                    <h1>Privacy Policy</h1>

                    <p>
                        This policy explains what information PetPath collects,
                        why it is used and how users can manage their data.
                    </p>
                </div>

                {!isPublic && (
                    <div className="page-account-menu">
                        <OrganisationAccountMenu />
                    </div>
                )}
            </header>

            <section className="legal-page">
                <div className="legal-intro-card">
                    <div className="legal-intro-icon">
                        <ShieldCheck size={28} />
                    </div>

                    <div>
                        <h2>Your privacy matters</h2>

                        <p>
                            PetPath uses personal information to provide the
                            app, manage shelter accounts, review listings,
                            support responsible matching and keep the platform
                            safe.
                        </p>
                    </div>
                </div>

                <article className="legal-card">
                    <h2>1. About this policy</h2>

                    <p>
                        This Privacy Policy applies when you use the PetPath
                        mobile app, shelter portal, support services or related
                        features.
                    </p>

                    <p>
                        It covers information provided by regular users,
                        shelters, rescue organisations and anyone who contacts
                        PetPath for support.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>2. Information we collect</h2>

                    <div className="legal-feature-grid">
                        <div>
                            <UserRound size={22} />

                            <h3>Account information</h3>

                            <p>
                                Name, email address, login details, account
                                type and account status.
                            </p>
                        </div>

                        <div>
                            <FileText size={22} />

                            <h3>Shelter information</h3>

                            <p>
                                Charity name, charity ID, website, address,
                                profile details and listing information.
                            </p>
                        </div>

                        <div>
                            <Database size={22} />

                            <h3>PetPath activity</h3>

                            <p>
                                Saved pets, questionnaire answers, distance
                                settings, enquiries and support messages.
                            </p>
                        </div>

                        <div>
                            <LockKeyhole size={22} />

                            <h3>Technical information</h3>

                            <p>
                                Security logs, device or browser information and
                                information needed to keep the platform working.
                            </p>
                        </div>
                    </div>
                </article>

                <article className="legal-card">
                    <h2>3. How we use information</h2>

                    <ul className="legal-list">
                        <li>
                            <ShieldCheck size={17} />
                            To create and manage user and shelter accounts.
                        </li>

                        <li>
                            <ShieldCheck size={17} />
                            To review shelter accounts and pet listings.
                        </li>

                        <li>
                            <ShieldCheck size={17} />
                            To display listings and support pet enquiries.
                        </li>

                        <li>
                            <ShieldCheck size={17} />
                            To calculate matching guidance and suitability
                            information.
                        </li>

                        <li>
                            <ShieldCheck size={17} />
                            To respond to support requests.
                        </li>

                        <li>
                            <ShieldCheck size={17} />
                            To protect PetPath from misuse, fraud, unsafe
                            content or security issues.
                        </li>
                    </ul>
                </article>

                <article className="legal-card">
                    <h2>4. Lawful bases</h2>

                    <p>
                        PetPath may rely on different lawful bases depending on
                        how the information is used. For example, account
                        creation and core platform features may be needed to
                        provide the service requested by the user.
                    </p>

                    <p>
                        Optional email preferences or optional communications
                        may rely on consent where appropriate.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>5. Shelter and listing data</h2>

                    <p>
                        Shelter users may upload pet listing details, photos and
                        veterinary documents. Listing photos may be shown to
                        users. Veterinary documents may be used for listing
                        review, verification or record-keeping purposes.
                    </p>

                    <p>
                        Organisations should avoid uploading unnecessary
                        personal information inside listing documents.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>6. Matching and questionnaire data</h2>

                    <p>
                        PetPath may use questionnaire answers to provide
                        suitability scores or pet recommendations. This is used
                        to support responsible decision-making and does not
                        automatically make final adoption decisions.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>7. Who information is shared with</h2>

                    <p>
                        PetPath may share information with service providers
                        that help operate the platform, such as cloud hosting,
                        authentication, database, storage and support services.
                    </p>

                    <p>
                        When a user submits an enquiry, relevant information may
                        be shared with the shelter or organisation responsible
                        for that listing.
                    </p>

                    <div className="legal-note">
                        <ShieldCheck size={20} />

                        <span>
                            PetPath does not sell personal information.
                        </span>
                    </div>
                </article>

                <article className="legal-card">
                    <h2>8. How long information is kept</h2>

                    <p>
                        PetPath keeps personal information only for as long as
                        needed to provide the service, manage accounts, support
                        safety, meet legal obligations, resolve disputes or
                        improve the platform.
                    </p>

                    <p>
                        Account data is usually kept while an account is active.
                        Some information may be retained for a limited period
                        after deletion where needed for safety, security,
                        moderation or legal reasons.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>9. Security</h2>

                    <p>
                        PetPath uses reasonable technical and organisational
                        measures to protect information, including authenticated
                        access, controlled storage and restricted account access.
                    </p>

                    <p>
                        No online service can be guaranteed to be completely
                        secure, but we work to reduce risks and protect user
                        information.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>10. Your rights</h2>

                    <p>
                        Depending on the situation, users may have rights to
                        access, correct, delete, restrict, object to or request
                        a copy of their personal information. Users may also
                        have rights relating to automated decision-making or
                        profiling.
                    </p>

                    <p>
                        To make a request, contact PetPath using the email
                        address below.
                    </p>
                </article>

                <article className="legal-contact-card">
                    <Mail size={22} />

                    <div>
                        <h2>Contact</h2>

                        <p>
                            For privacy questions or data requests, contact{" "}
                            <a href="mailto:petpathsupport@gmail.com">
                                petpathsupport@gmail.com
                            </a>
                            .
                        </p>
                    </div>
                </article>
            </section>
        </main>
    );
}
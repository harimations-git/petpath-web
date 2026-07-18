import {
    CheckCircle2,
    FileText,
    Mail,
    ShieldCheck,
} from "lucide-react";

import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import "./LegalPage.css";
import "../dashboard/PageHeading.css";

export default function TermsOfService() {
    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Terms and Conditions</h1>

                    <p>
                        These terms explain the rules for using PetPath and the
                        responsibilities of users, shelters and organisations.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <section className="legal-page">
                <div className="legal-intro-card">
                    <div className="legal-intro-icon">
                        <FileText size={28} />
                    </div>

                    <div>
                        <h2>Using PetPath responsibly</h2>

                        <p>
                            PetPath is designed to support responsible pet
                            adoption, rehoming and ownership. By using PetPath,
                            you agree to use the platform honestly, safely and
                            lawfully.
                        </p>
                    </div>
                </div>

                <article className="legal-card">
                    <h2>1. About PetPath</h2>

                    <p>
                        PetPath is a pet adoption and responsible ownership
                        platform. It helps users discover pets, complete
                        lifestyle information and make more informed decisions
                        about adoption.
                    </p>

                    <p>
                        The shelter portal allows approved organisations to
                        create and manage pet listings, upload supporting
                        information and direct users to suitable enquiry routes.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>2. Who can use PetPath</h2>

                    <p>
                        You must provide accurate information when creating an
                        account or using PetPath. You must not pretend to be
                        another person or organisation, provide misleading
                        details, or use the platform for unlawful purposes.
                    </p>

                    <p>
                        Shelter accounts are always reviewed before access is
                        approved. PetPath may reject or remove an
                        account if information cannot be verified or if the
                        account is being misused.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>3. Pet listings</h2>

                    <p>
                        Organisations are responsible for making sure that pet
                        listings are accurate, lawful and kept up to date.
                        Listings should include clear information about the pet,
                        availability, health details, fees and the correct
                        enquiry route.
                    </p>

                    <p>
                        Listings must not contain false information, unsafe
                        advice, harmful content, misleading claims or anything
                        that promotes irresponsible breeding, selling or
                        rehoming.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>4. Listing review and moderation</h2>

                    <p>
                        PetPath will always review listings before they appear publicly.
                        We may approve, reject, remove or request changes
                        to listings where needed to protect users, animals or
                        the integrity of the platform.
                    </p>

                    <div className="legal-note">
                        <ShieldCheck size={20} />

                        <span>
                            We review your pet listings to improve trust and
                            safety.
                        </span>
                    </div>
                </article>

                <article className="legal-card">
                    <h2>5. Matching and recommendations</h2>

                    <p>
                        PetPath may provide suitability scores, recommendations
                        or guidance based on information submitted by users.
                        These are intended to support responsible decision
                        making only.
                    </p>

                    <p>
                        PetPath does not guarantee that a pet is suitable,
                        available, or that an adoption application will be
                        accepted. Final decisions remain with the relevant
                        shelter, rescue organisation or responsible party.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>6. Enquiries and third-party organisations</h2>

                    <p>
                        Some listings may link to external websites, enquiry
                        forms or organisations. PetPath is not responsible for
                        the content, policies or decisions of third-party
                        websites or organisations.
                    </p>

                    <p>
                        Users should always carry out their own checks before
                        adopting, rehoming or making any commitment.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>7. Uploaded content</h2>

                    <p>
                        If you upload photos, documents, descriptions or other
                        content, you confirm that you have permission to use it
                        and that it is accurate, appropriate and lawful.
                    </p>

                    <p>
                        You allow PetPath to store, process and display uploaded
                        content where needed to provide the service, review
                        listings and manage the platform.
                    </p>
                </article>

                <article className="legal-card">
                    <h2>8. Prohibited use</h2>

                    <ul className="legal-list">
                        <li>
                            <CheckCircle2 size={17} />
                            Creating false, misleading or scam listings.
                        </li>

                        <li>
                            <CheckCircle2 size={17} />
                            Uploading content you do not have permission to use.
                        </li>

                        <li>
                            <CheckCircle2 size={17} />
                            Promoting illegal animal sales or irresponsible
                            breeding.
                        </li>

                        <li>
                            <CheckCircle2 size={17} />
                            Attempting to access another account or interfere
                            with the platform.
                        </li>

                        <li>
                            <CheckCircle2 size={17} />
                            Posting abusive, harmful, discriminatory or unsafe
                            content.
                        </li>
                    </ul>
                </article>

                <article className="legal-card">
                    <h2>9. Service availability</h2>

                    <p>
                        PetPath is provided on an “as available” basis. We aim
                        to keep the platform reliable, but we cannot guarantee
                        that it will always be available, uninterrupted or
                        error-free.
                    </p>
                </article>


                <article className="legal-contact-card">
                    <Mail size={22} />

                    <div>
                        <h2>Contact</h2>

                        <p>
                            For questions about these terms, contact{" "}
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
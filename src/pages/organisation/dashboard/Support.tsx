import { ExternalLink, FileText, HelpCircle, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import OrganisationAccountMenu from "../../../components/ui/profile/OrganisationAccountMenu";
import { routes } from "../../../constants/routes";
import "./Support.css";
import "./PageHeading.css";
import Spacer from "../../../components/layout/Spacer";
import { useEffect } from "react";

/**
 * Displays the organisation help centre.
 * Provides support contact details and links to legal information.
 */
export default function Support() {
    useEffect(() => {
        document.title = "Help Centre | PetPath"
    })
    
    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Help Centre</h1>

                    <p>
                        Get help with your shelter account and access PetPath’s
                        important legal information.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <section className="support-layout">
                <article className="support-card support-card-featured">
                    <div className="support-card-header">
                        <div className="support-icon">
                            <HelpCircle size={27} />
                        </div>

                        <div>
                            <h2>Having issues?</h2>

                            <p>
                                If something is not working as expected, or you
                                need help with your shelter account information, contact the
                                PetPath support team.
                            </p>
                        </div>
                    </div>

                    <a
                        className="support-email-card"
                        href="mailto:petpathsupport@gmail.com"
                    >
                        <span className="support-email-icon">
                            <Mail size={20} />
                        </span>

                        <span>
                            <strong>Email support</strong>

                            <small>
                                petpathsupport@gmail.com
                            </small>
                        </span>
                    </a>
                </article>

                <Spacer height={30}/>

                <article className="support-card">
                    <div className="support-card-header">
                        <div className="support-icon">
                            <ShieldCheck size={27} />
                        </div>

                        <div>
                            <h2>Legal & privacy</h2>

                            <p>
                                Read how PetPath should be used and how user
                                information is handled.
                            </p>
                        </div>
                    </div>

                    <div className="support-link-list">
                        <Link
                            to={routes.legal.shelterTerms}
                            className="support-document-link"
                        >
                            <span className="support-document-main">
                                <span className="support-document-icon">
                                    <FileText size={19} />
                                </span>

                                <span>
                                    <strong>
                                        Terms and Conditions
                                    </strong>

                                    <small>
                                        Rules for using PetPath and managing
                                        listings.
                                    </small>
                                </span>
                            </span>

                            <ExternalLink size={17} />
                        </Link>

                        <Link
                            to={routes.legal.shelterPrivacyPolicy}
                            className="support-document-link"
                        >
                            <span className="support-document-main">
                                <span className="support-document-icon">
                                    <ShieldCheck size={19} />
                                </span>

                                <span>
                                    <strong>
                                        Privacy Policy
                                    </strong>

                                    <small>
                                        How PetPath collects, stores and uses
                                        information.
                                    </small>
                                </span>
                            </span>

                            <ExternalLink size={17} />
                        </Link>
                    </div>
                </article>
            </section>
        </main>
    );
}
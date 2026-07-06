import { useEffect } from "react";
import { ArrowLeft, Clock, MailCheck } from "lucide-react";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import ImageSlideShow from "../../components/ui/ImageSlideShow";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";

import Spacer from "../../components/layout/Spacer";
import { loginSlideshowContent } from "../../data/imageContent";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import "./RegisterShelter.css";
import "./AccountReview.css";

import { useNavigate } from "react-router-dom";

import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";
import { routes } from "../../constants/routes";
import { useBackButtonRedirect } from "../../hooks/useBackButtonRedirect";
import { getCurrentOrganisationProfile } from "../../services/organisation/organisationService";
import { getRouteForOrganisationStatus } from "../../services/organisation/organisationRedirect";

export default function AccountReview() {
    useBackButtonRedirect(routes.auth.login);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Account Review | PetPath";
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function checkAccountStatus() {
            try {
                const organisationProfile = await getCurrentOrganisationProfile();

                if (!isMounted) return;

                if (organisationProfile.accountStatus === "pending") {
                    return;
                }

                const nextRoute = getRouteForOrganisationStatus(
                    organisationProfile.accountStatus
                );

                navigate(nextRoute, { replace: true });
            } catch (error) {
                if (!isMounted) return;
            }
        }

        checkAccountStatus();

        const intervalId = window.setInterval(() => {
            checkAccountStatus();
        }, 15000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, [navigate]);


    return (
        <main className="register-shelter-page">
            <section className="register-shelter-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={230} height={230} />
                <DecorativeLeaf bottom={-70} right={70} rotate={-60} flipX width={230} height={230} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => { navigate(routes.auth.login) }}
                    aria-label="Go back"
                >
                    <ArrowLeft size={22} />
                </button>

                <Logo hasTagline size="md" />

                <Spacer height={8} />

                <Card className="register-shelter-card account-review-card">
                    <AuthProgressStepper
                        currentStep={3}
                        steps={[
                            { label: "Account" },
                            { label: "Verify Email" },
                            { label: "Review" },
                        ]}
                    />

                    <div className="account-review-content">

                        <h1 className="account-review-title">Account Review</h1>

                        <p className="account-review-description">
                            Your account is currently being reviewed by a PetPath admin.
                        </p>

                        <Spacer height={20} />

                        <span className="account-review-status">
                            <Clock size={15} />
                            Review in progress
                        </span>

                        <Spacer height={20} />

                        <LoadingSpinner size="xl" />



                        <div className="account-review-info-box">
                            <MailCheck size={22} />

                            <div>
                                <strong>Why do we do this?</strong>
                                <p>
                                    We review every account to make sure PetPath remains a safe and trusted space for genuine organisations, adopters and pets.
                                </p>
                            </div>
                        </div>



                        <p className="account-review-footer">
                            You can safely close this page. You will receive an email when your review is complete.
                        </p>
                    </div>
                </Card>
            </section>

            <section className="register-shelter-right">
                <ImageSlideShow slides={loginSlideshowContent} />
            </section>
        </main>
    );
}
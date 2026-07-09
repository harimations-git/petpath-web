import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, ChevronRight, UserRound, Heart } from "lucide-react";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import ImageSlideShow from "../../components/ui/ImageSlideShow";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";
import InfoModal from "../../components/ui/InfoModal";

import { loginSlideshowContent } from "../../constants/imageContent";

import "./AccountType.css";
import { routes } from "../../constants/routes";

export default function AccountType() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.title = "Choose account | PetPath"
    }, []);

    return (
        <main className="account-type-page">
            <section className="account-type-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={260} height={260} />
                <DecorativeLeaf bottom={-70} right={80} rotate={-60} flipX width={260} height={260} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={22} />
                </button>

                <Logo hasTagline size="lg" />

                <div className="account-type-hero">
                    <p className="account-type-kicker">Get started</p>
                    <h1>Choose your account type</h1>

                    <p>
                        Pick the option that best describes how you'll use PetPath.
                    </p>
                </div><Card className="account-type-card">
                    <button
                        type="button"
                        className="account-type-option"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="account-type-option-icon">
                            <UserRound size={28} />
                        </span>

                        <span className="account-type-option-copy">
                            <span className="account-type-option-label">For adopters</span>
                            <span className="account-type-option-title">Regular account</span>
                            <span className="account-type-option-description">
                                Find suitable pets, save favourites and contact shelters for adoption.
                            </span>
                        </span>

                        <ChevronRight className="account-type-chevron" size={24} />
                    </button>

                    <div className="account-type-divider">
                        <span />
                        <strong>or</strong>
                        <span />
                    </div>

                    <button
                        type="button"
                        className="account-type-option"
                        onClick={() =>
                            navigate(routes.auth.registerShelter)}
                    >
                        <span className="account-type-option-icon">
                            <Building2 size={28} />
                        </span>

                        <span className="account-type-option-copy">
                            <span className="account-type-option-label">For shelters</span>
                            <span className="account-type-option-title">Shelter account</span>
                            <span className="account-type-option-description">
                                Register your charity and list animals that are ready for adoption.
                            </span>
                        </span>

                        <ChevronRight className="account-type-chevron" size={24} />
                    </button>
                </Card>
            </section>

            <section className="account-type-right">
                <ImageSlideShow slides={loginSlideshowContent} />
            </section>
            <InfoModal
                visible={showModal}
                title="Check out our app!"
                message="Download the PetPath app to find suitable pets for you to adopt"
                icon={Heart}
                buttonText="Continue"
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    setShowModal(false);
                }}
            />
        </main>
    )
}
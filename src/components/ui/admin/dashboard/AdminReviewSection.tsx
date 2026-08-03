import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../Card";

type AdminReviewSectionProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    itemsLabel: string;
    isEmpty: boolean;
    emptyMessage: string;
    viewAllRoute: string;
    viewAllLabel: string;
    children: ReactNode;
};

export default function AdminReviewSection({
    icon: Icon,
    title,
    description,
    isEmpty,
    emptyMessage,
    viewAllRoute,
    viewAllLabel,
    children,
}: AdminReviewSectionProps) {
    return (
        <Card className="admin-review-section">
            <header className="admin-review-section-header">
                <div className="admin-review-section-heading">
                    <div className="admin-review-section-icon">
                        <Icon size={21} />
                    </div>

                    <div>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
            </header>

            <div
                className="admin-review-list"
                role="list"
                tabIndex={0}
            >
                {isEmpty ? (
                    <div className="admin-review-empty">
                        <ShieldCheck size={30} />

                        <strong>
                            Nothing waiting for review
                        </strong>

                        <p>{emptyMessage}</p>
                    </div>
                ) : (children)}
            </div>

            <footer className="admin-review-section-footer">
                <Link
                    className="admin-review-view-all"
                    to={viewAllRoute}
                >
                    {viewAllLabel}
                    <ArrowRight size={16} />
                </Link>
            </footer>
        </Card>
    );
}
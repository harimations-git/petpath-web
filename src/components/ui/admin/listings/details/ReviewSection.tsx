import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Card from "../../../Card";

type ReviewSectionProps = {
    number?: number;
    title: string;
    description: string;
    icon: LucideIcon;
    children: ReactNode;
};

export default function ReviewSection({
    number,
    title,
    description,
    icon: Icon,
    children,
}: ReviewSectionProps) {
    return (
        <Card className="admin-listing-review-section">
            <div className="admin-listing-review-section-heading">
                {number && (
                    <div className="admin-listing-review-section-number">
                        {number}
                    </div>
                )}
                <div className="admin-listing-review-section-icon">
                    <Icon size={21} />
                </div>

                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>

            <div className="admin-listing-review-section-content">
                {children}
            </div>
        </Card>
    );
}
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type ReviewDetail = {
    label: string;
    value: ReactNode;
};

type AdminReviewItemProps = {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    details: ReviewDetail[];
    submittedAt: string;
};

export default function AdminReviewItem({
    icon: Icon,
    title,
    subtitle,
    details,
    submittedAt,
}: AdminReviewItemProps) {
    return (
        <article
            className="admin-review-item"
            role="listitem"
        >
            <div className="admin-review-item-heading">
                <div className="admin-review-item-icon">
                    <Icon size={19} />
                </div>

                <div className="admin-review-item-title">
                    <h3>{title}</h3>

                    {subtitle && (
                        <p>{subtitle}</p>
                    )}
                </div>
            </div>

            <dl className="admin-review-details">
                {details.map((detail) => (
                    <div key={detail.label}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.value}</dd>
                    </div>
                ))}
            </dl>

            <p className="admin-review-submitted">
                Submitted {submittedAt}
            </p>
        </article>
    );
}
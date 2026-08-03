import {
    Building2,
    ClipboardCheck,
    Clock3,
} from "lucide-react";

import Card from "../../Card";

type AdminDashboardStatisticsProps = {
    pendingOrganisationCount: number;
    pendingListingCount: number;
    oldestWaitingLabel: string;
};

export default function AdminDashboardStatistics({
    pendingOrganisationCount,
    pendingListingCount,
    oldestWaitingLabel,
}: AdminDashboardStatisticsProps) {
    const statistics = [
        {
            label: "Organisations pending",
            value: pendingOrganisationCount,
            icon: Building2,
        },
        {
            label: "Listings pending",
            value: pendingListingCount,
            icon: ClipboardCheck,
        },
        {
            label: "Oldest waiting request",
            value: oldestWaitingLabel,
            icon: Clock3,
        },
    ];

    return (
        <section
            className="admin-dashboard-statistics"
        >
            {statistics.map((statistic) => {
                const Icon = statistic.icon;

                return (
                    <Card
                        key={statistic.label}
                        className="admin-statistic-card"
                    >
                        <div className="admin-statistic-icon">
                            <Icon size={22} />
                        </div>

                        <div>
                            <strong className="admin-statistic-value">
                                {statistic.value}
                            </strong>

                            <span className="admin-statistic-label">
                                {statistic.label}
                            </span>
                        </div>
                    </Card>
                );
            })}
        </section>
    );
}
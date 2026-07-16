import {
    Heart,
    Home,
    PawPrint,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

import type { ListingStatistics } from "../../../utils/listings/getListingStatistics";

type DashboardStatisticsProps = {
    statistics: ListingStatistics;
};

type StatisticCard = {
    label: string;
    value: number;
    icon: LucideIcon;
};

/**
 * Displays the current users "stats". 
 * Numbers like current/pending/rehomed/reserved listings
 * @param param0 
 * @returns 
 */
export default function DashboardStatistics({
    statistics,
}: DashboardStatisticsProps) {
    const statisticCards: StatisticCard[] = [
        {
            label: "Active listings",
            value: statistics.activeListings,
            icon: Home,
        },
        {
            label: "Pending review",
            value: statistics.pendingReview,
            icon: ShieldCheck,
        },
        {
            label: "Reserved pets",
            value: statistics.reservedPets,
            icon: Heart,
        },
        {
            label: "Re-homed this month",
            value: statistics.rehomedThisMonth,
            icon: PawPrint,
        },
    ];

    return (
        <section className="dashboard-statistics">
            {statisticCards.map(
                ({
                    label,
                    value,
                    icon: Icon,
                }) => (
                    <article
                        key={label}
                        className="dashboard-stat-card"
                    >
                        <span className="dashboard-stat-icon">
                            <Icon size={22} />
                        </span>

                        <div>
                            <span>{label}</span>
                            <strong>{value}</strong>
                        </div>
                    </article>
                )
            )}
        </section>
    );
}
import type { ReactNode } from "react";

import "./CardList.css";

type AdminCardListProps = {
    children: ReactNode;

    hasMore?: boolean;
    isLoadingMore?: boolean;

    onLoadMore?: () => void;
};

export default function CardList({
    children,

    hasMore = false,
    isLoadingMore = false,

    onLoadMore,
}: AdminCardListProps) {
    return (
        <>
            <div className="admin-card-list">
                {children}
            </div>

            {hasMore && onLoadMore && (
                <div className="admin-card-list-load-more">
                    <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={onLoadMore}
                    >
                        {isLoadingMore
                            ? "Loading..."
                            : "Load more"}
                    </button>
                </div>
            )}
        </>
    );
}
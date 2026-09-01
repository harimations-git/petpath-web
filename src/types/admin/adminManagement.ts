import type { SortOrder } from "../filters";

//Options the admin has when reviewing a organisation account
export type AdminReviewDecision =
    | "approved"
    | "rejected";

//Query parameters used when requesting listings.
export type GetListingsQueryParams = {
    sortOrder: SortOrder;
    nextToken?: string | null;
};
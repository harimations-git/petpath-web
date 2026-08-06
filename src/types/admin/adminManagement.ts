import type { SortOrder } from "../filters";

//Options the admin has when reviewing a organisation account
export type AdminReviewDecision =
    | "approved"
    | "rejected";


export type GetListingsQueryParams = {
    sortOrder: SortOrder;
    nextToken?: string | null;
};
import type { GetAuthToken } from "@/shared/hooks";

/**
 * Placeholder Bearer for guest / Playwright mode. Only works against mocked `/v1/**`
 * (e2e). The live API never accepts this — use real Clerk keys for product flows.
 */
export const getNullAuthToken: GetAuthToken = async () => "guest";

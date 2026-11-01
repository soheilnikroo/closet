import type { GetAuthToken } from "@/shared/hooks";

/** Guest / local e2e token so the API client can call mocked `/v1/**` routes without Clerk. */
export const getNullAuthToken: GetAuthToken = async () => "guest";

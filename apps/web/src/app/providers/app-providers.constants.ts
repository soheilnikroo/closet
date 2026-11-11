import type { GetAuthToken } from "@/shared/hooks";

/** Local demo identity; the API refuses mock authentication in production. */
export const getNullAuthToken: GetAuthToken = async () => "mock:dev-user";

/**
 * Expand WEB_ORIGIN so both `localhost` and `127.0.0.1` are accepted in local
 * development (browsers treat them as different origins for CORS + cookies).
 */
export function expandWebCorsOrigins(webOrigin: string): string | string[] {
  try {
    const primary = new URL(webOrigin);
    if (primary.hostname !== "localhost" && primary.hostname !== "127.0.0.1") {
      return webOrigin;
    }

    const twin = new URL(webOrigin);
    twin.hostname = primary.hostname === "localhost" ? "127.0.0.1" : "localhost";
    return [primary.origin, twin.origin];
  } catch {
    return webOrigin;
  }
}

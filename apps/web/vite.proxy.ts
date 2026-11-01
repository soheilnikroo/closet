import type { ProxyOptions } from "vite";

/** Dev/preview proxy to the Fastify API (apps/api on :8080). */
export const apiProxy = {
  "/v1": {
    target: "http://localhost:8080",
    changeOrigin: true,
  },
  "/health": {
    target: "http://localhost:8080",
    changeOrigin: true,
  },
} as const satisfies Record<string, ProxyOptions>;

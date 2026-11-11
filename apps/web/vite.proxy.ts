import type { ProxyOptions } from "vite";

/** Dev/preview proxy to the Fastify API (apps/api on :8080). */
export const apiProxy = {
  "/v1": {
    target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8080",
    changeOrigin: true,
  },
  "/health": {
    target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8080",
    changeOrigin: true,
  },
} as const satisfies Record<string, ProxyOptions>;

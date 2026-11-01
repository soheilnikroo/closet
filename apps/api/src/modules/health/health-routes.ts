import { healthResponseSchema } from "@closet/shared";
import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (_request, reply) => {
    const payload = healthResponseSchema.parse({
      status: "ok",
      service: "closet-api",
      timestamp: new Date().toISOString(),
    });

    return reply.send(payload);
  });
}

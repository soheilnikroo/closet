import { z } from "zod";

import { validationError } from "../errors/index.js";

export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw validationError("Invalid request body", parsed.error.issues);
  }
  return parsed.data;
}

export function parseParams<T>(schema: z.ZodType<T>, params: unknown): T {
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    throw validationError("Invalid path parameters", parsed.error.issues);
  }
  return parsed.data;
}

export function parseQuery<T>(schema: z.ZodType<T>, query: unknown): T {
  const parsed = schema.safeParse(query);
  if (!parsed.success) {
    throw validationError("Invalid query parameters", parsed.error.issues);
  }
  return parsed.data;
}

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

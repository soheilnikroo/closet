import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "unauthorized",
  "forbidden",
  "not_found",
  "validation_error",
  "conflict",
  "service_unavailable",
  "internal_error",
]);

export const apiErrorSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string().min(1),
    details: z.unknown().optional(),
  }),
});

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

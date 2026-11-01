import { z } from "zod";

import { recommendationSchema } from "@/contracts/styling/outfit.js";

export const stylistChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  locale: z.enum(["en-GB", "fa-IR"]).optional(),
});

export const stylistChatResponseSchema = z.object({
  reply: z.string().min(1),
  constraints: z
    .object({
      occasionSlug: z.string().nullable(),
      excludeItemIds: z.array(z.string().uuid()),
      preferredStyles: z.array(z.string()),
      notes: z.string().nullable(),
    })
    .optional(),
  recommendations: z.array(recommendationSchema),
});

export const aiProcessingJobSchema = z.object({
  id: z.string().uuid(),
  jobType: z.string(),
  status: z.enum(["queued", "running", "succeeded", "failed"]),
  error: z.string().nullable(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export type StylistChatRequest = z.infer<typeof stylistChatRequestSchema>;
export type StylistChatResponse = z.infer<typeof stylistChatResponseSchema>;
export type AiProcessingJob = z.infer<typeof aiProcessingJobSchema>;

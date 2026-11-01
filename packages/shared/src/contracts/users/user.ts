import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  clerkUserId: z.string().min(1),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  locale: z.enum(["en-GB", "fa-IR"]),
  status: z.enum(["active", "disabled"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;

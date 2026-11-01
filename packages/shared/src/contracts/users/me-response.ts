import { z } from "zod";

import { userSchema } from "./user.js";

export const meResponseSchema = z.object({
  user: userSchema,
});

export type MeResponse = z.infer<typeof meResponseSchema>;

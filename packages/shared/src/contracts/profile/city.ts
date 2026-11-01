import { z } from "zod";

export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  nameFa: z.string().min(1),
  province: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().min(1),
});

export type City = z.infer<typeof citySchema>;

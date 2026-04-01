import { z } from "zod/v4";

export const UberEatsUserSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    userId: z.string(),
    phone: z.string().optional(),
  })
  .passthrough();

export type UberEatsUser = z.infer<typeof UberEatsUserSchema>;

import { z } from "zod/v4";

export const UberEatsConfigSchema = z.object({
  cookies: z.string(),
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  draftOrderUuid: z.string().optional(),
});

export type UberEatsConfig = z.infer<typeof UberEatsConfigSchema>;

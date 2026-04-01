import { z } from "zod/v4";

export const SavedAddressSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    isDefault: z.boolean().optional(),
  })
  .passthrough();

export type SavedAddress = z.infer<typeof SavedAddressSchema>;

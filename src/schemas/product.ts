import { z } from "zod/v4";

export const CustomizationChoiceSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    price: z.number().optional(),
    isAvailable: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  })
  .passthrough();

export type CustomizationChoice = z.infer<typeof CustomizationChoiceSchema>;

export const CustomizationGroupSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    minPermitted: z.number(),
    maxPermitted: z.number(),
    options: z.array(CustomizationChoiceSchema),
  })
  .passthrough();

export type CustomizationGroup = z.infer<typeof CustomizationGroupSchema>;

export const ItemDetailSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    itemDescription: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().optional(),
    customizationGroups: z.array(CustomizationGroupSchema).optional(),
  })
  .passthrough();

export type ItemDetail = z.infer<typeof ItemDetailSchema>;

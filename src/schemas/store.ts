import { z } from "zod/v4";

export const MenuItemSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    itemDescription: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().optional(),
    hasCustomizations: z.boolean().optional(),
    sectionUuid: z.string().optional(),
    subsectionUuid: z.string().optional(),
  })
  .passthrough();

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSectionSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    items: z.array(MenuItemSchema),
  })
  .passthrough();

export type MenuSection = z.infer<typeof MenuSectionSchema>;

export const StoreDetailSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    slug: z.string().optional(),
    heroImageUrl: z.string().optional(),
    rating: z.number().optional(),
    etaRange: z.string().optional(),
    priceRange: z.string().optional(),
    address: z.string().optional(),
    hours: z.string().optional(),
    isOpen: z.boolean().optional(),
    deliveryFee: z.number().optional(),
    categories: z.array(z.string()).optional(),
    sections: z.array(MenuSectionSchema).optional(),
  })
  .passthrough();

export type StoreDetail = z.infer<typeof StoreDetailSchema>;

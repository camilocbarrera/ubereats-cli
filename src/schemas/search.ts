import { z } from "zod/v4";

export const SearchItemSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    price: z.number().optional(),
    imageUrl: z.string().optional(),
    itemDescription: z.string().optional(),
    storeUuid: z.string().optional(),
  })
  .passthrough();

export type SearchItem = z.infer<typeof SearchItemSchema>;

export const SearchStoreSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    imageUrl: z.string().optional(),
    etaRange: z.string().optional(),
    rating: z.number().optional(),
    deliveryFee: z.number().optional(),
    slug: z.string().optional(),
    heroImageUrl: z.string().optional(),
    categories: z.array(z.string()).optional(),
  })
  .passthrough();

export type SearchStore = z.infer<typeof SearchStoreSchema>;

export const SearchResultSchema = z
  .object({
    stores: z.array(SearchStoreSchema),
    items: z.array(SearchItemSchema),
  })
  .passthrough();

export type SearchResult = z.infer<typeof SearchResultSchema>;

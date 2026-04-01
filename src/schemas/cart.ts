import { z } from "zod/v4";

export const CartItemSchema = z
  .object({
    uuid: z.string(),
    title: z.string(),
    quantity: z.number(),
    price: z.number(),
    totalPrice: z.number(),
    customizations: z.array(z.unknown()).optional(),
  })
  .passthrough();

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartStoreSchema = z
  .object({
    storeUuid: z.string(),
    storeName: z.string(),
    items: z.array(CartItemSchema),
    subtotal: z.number(),
    deliveryFee: z.number(),
    serviceFee: z.number(),
    total: z.number(),
    etaRange: z.string().optional(),
  })
  .passthrough();

export type CartStore = z.infer<typeof CartStoreSchema>;

export const CartResponseSchema = z
  .object({
    draftOrderUuid: z.string(),
    stores: z.array(CartStoreSchema),
    subtotal: z.number(),
    deliveryFee: z.number(),
    serviceFee: z.number(),
    total: z.number(),
    currency: z.string().optional(),
  })
  .passthrough();

export type CartResponse = z.infer<typeof CartResponseSchema>;

export const AddToCartInputSchema = z.object({
  storeUuid: z.string(),
  itemUuid: z.string(),
  title: z.string(),
  quantity: z.number().optional(),
  price: z.number().optional(),
  sectionUuid: z.string().optional(),
  subsectionUuid: z.string().optional(),
  customizations: z.array(z.object({
    groupUuid: z.string(),
    choiceUuid: z.string(),
  })).optional(),
});

export type AddToCartInput = z.infer<typeof AddToCartInputSchema>;

import { z } from "zod/v4";

export const ActiveOrderSchema = z
  .object({
    uuid: z.string(),
    storeName: z.string(),
    state: z.string(),
    total: z.number(),
    eta: z.string().optional(),
    placedAt: z.string().optional(),
    items: z.array(z.object({
      title: z.string(),
      quantity: z.number(),
    })).optional(),
  })
  .passthrough();

export type ActiveOrder = z.infer<typeof ActiveOrderSchema>;

export const PastOrderSchema = z
  .object({
    uuid: z.string(),
    storeName: z.string(),
    state: z.string(),
    total: z.number(),
    placedAt: z.string().optional(),
  })
  .passthrough();

export type PastOrder = z.infer<typeof PastOrderSchema>;

export const OrdersResponseSchema = z
  .object({
    activeOrders: z.array(ActiveOrderSchema),
    pastOrders: z.array(PastOrderSchema),
  })
  .passthrough();

export type OrdersResponse = z.infer<typeof OrdersResponseSchema>;

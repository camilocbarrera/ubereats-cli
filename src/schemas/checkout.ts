import { z } from "zod/v4";

export const PaymentMethodSchema = z
  .object({
    uuid: z.string(),
    type: z.string(),
    lastFour: z.string().optional(),
    label: z.string(),
    isDefault: z.boolean().optional(),
  })
  .passthrough();

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const CheckoutDetailSchema = z
  .object({
    draftOrderUuid: z.string(),
    subtotal: z.number(),
    deliveryFee: z.number(),
    serviceFee: z.number(),
    tax: z.number().optional(),
    tip: z.number().optional(),
    total: z.number(),
    deliveryAddress: z.string().optional(),
    paymentMethod: PaymentMethodSchema.optional(),
    tipOptions: z.array(z.number()).optional(),
    estimatedDelivery: z.string().optional(),
  })
  .passthrough();

export type CheckoutDetail = z.infer<typeof CheckoutDetailSchema>;

import type { UberEatsConfig } from "../schemas/config";
import type { CheckoutDetail } from "../schemas/checkout";
import type { PaymentMethod } from "../schemas/checkout";
import { post } from "../http";

export async function getCheckoutDetail(config: UberEatsConfig): Promise<CheckoutDetail> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) throw new Error("No active cart. Add items first.");

  const data = await post<any>("/_p/api/getCheckoutPresentationV1", {
    draftOrderUUID: draftOrderUuid,
  }, config);

  const raw = data?.data || data;
  const payment = raw?.paymentProfile || raw?.payment;

  return {
    draftOrderUuid,
    subtotal: raw?.subtotal || raw?.subtotalAmount || 0,
    deliveryFee: raw?.deliveryFee || raw?.deliveryFeeAmount || 0,
    serviceFee: raw?.serviceFee || raw?.serviceFeeAmount || 0,
    tax: raw?.tax || raw?.taxAmount || 0,
    tip: raw?.tip || raw?.tipAmount || 0,
    total: raw?.total || raw?.totalAmount || 0,
    deliveryAddress: raw?.deliveryAddress || raw?.address || "",
    paymentMethod: payment ? {
      uuid: payment.uuid || "",
      type: payment.type || "",
      lastFour: payment.lastFour || "",
      label: payment.label || `${payment.type} ****${payment.lastFour || ""}`,
      isDefault: payment.isDefault || true,
    } : undefined,
    tipOptions: raw?.tipOptions || [0, 5, 10, 15, 20],
    estimatedDelivery: raw?.estimatedDelivery || raw?.etaRange || "",
  };
}

export async function getPaymentMethods(config: UberEatsConfig): Promise<PaymentMethod[]> {
  const data = await post<any>("/_p/api/getPaymentProfilesV1", {}, config);
  const raw = data?.data?.paymentProfiles || data?.paymentProfiles || [];
  return raw.map((p: any) => ({
    uuid: p.uuid || p.id || "",
    type: p.type || p.paymentType || "",
    lastFour: p.lastFour || p.cardSummary || "",
    label: p.label || `${p.type} ****${p.lastFour || ""}`,
    isDefault: p.isDefault || false,
  }));
}

export async function setTip(
  tipPercent: number,
  config: UberEatsConfig
): Promise<void> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) throw new Error("No active cart. Add items first.");

  await post<any>("/_p/api/setTipV1", {
    draftOrderUUID: draftOrderUuid,
    tipPercent,
  }, config);
}

export async function setPaymentMethod(
  paymentProfileUuid: string,
  config: UberEatsConfig
): Promise<void> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) throw new Error("No active cart. Add items first.");

  await post<any>("/_p/api/setCheckoutPaymentV1", {
    draftOrderUUID: draftOrderUuid,
    paymentProfileUUID: paymentProfileUuid,
  }, config);
}

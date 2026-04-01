import type { UberEatsConfig } from "../schemas/config";
import type { OrdersResponse } from "../schemas/order";
import { post } from "../http";
import { saveConfig } from "../config";

export async function placeOrder(config: UberEatsConfig): Promise<unknown> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) throw new Error("No active cart. Add items first.");

  const result = await post<any>("/_p/api/checkoutOrdersByDraftOrdersV1", {
    draftOrderUUIDs: [draftOrderUuid],
  }, config);

  // Clear draft order after successful placement
  config.draftOrderUuid = undefined;
  await saveConfig(config);

  return result?.data || result;
}

export async function getOrders(config: UberEatsConfig): Promise<OrdersResponse> {
  const [activeData, pastData] = await Promise.allSettled([
    post<any>("/_p/api/getActiveOrdersV1", {}, config),
    post<any>("/api/getPastOrdersV1", { limit: 10 }, config),
  ]);

  const activeRaw =
    activeData.status === "fulfilled"
      ? activeData.value?.data?.orders || activeData.value?.orders || []
      : [];

  const pastRaw =
    pastData.status === "fulfilled"
      ? pastData.value?.data?.orders || pastData.value?.orders || []
      : [];

  const activeOrders = activeRaw.map((o: any) => ({
    uuid: o.uuid || o.orderUuid || "",
    storeName: o.store?.title || o.storeName || "Unknown",
    state: o.state || o.orderState || "unknown",
    total: o.totalPrice || o.total || 0,
    eta: o.etaRange || o.eta || "",
    placedAt: o.createdAt || o.placedAt || "",
    items: (o.items || []).map((i: any) => ({
      title: i.title || i.name || "",
      quantity: i.quantity || 1,
    })),
  }));

  const pastOrders = pastRaw.map((o: any) => ({
    uuid: o.uuid || o.orderUuid || "",
    storeName: o.store?.title || o.storeName || "Unknown",
    state: o.state || o.orderState || "completed",
    total: o.totalPrice || o.total || 0,
    placedAt: o.createdAt || o.placedAt || "",
  }));

  return { activeOrders, pastOrders };
}

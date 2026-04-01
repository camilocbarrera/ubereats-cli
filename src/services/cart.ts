import type { UberEatsConfig } from "../schemas/config";
import type { CartResponse, AddToCartInput } from "../schemas/cart";
import { post } from "../http";
import { saveConfig } from "../config";

function parseCartResponse(data: any, draftOrderUuid?: string): CartResponse {
  const raw = data?.data || data;
  const stores: any[] = [];

  const storeItems = raw?.stores || raw?.storeInfo ? [raw] : [];
  const cartItems = raw?.shoppingCart?.items || raw?.items || [];
  const storeInfo = raw?.storeInfo || {};

  if (cartItems.length > 0) {
    const items = cartItems.map((item: any) => ({
      uuid: item.shoppingCartItemUUID || item.uuid || "",
      title: item.title || item.name || "",
      quantity: item.quantity || 1,
      price: item.price || 0,
      totalPrice: (item.price || 0) * (item.quantity || 1),
      customizations: item.selectedCustomizations || [],
    }));

    stores.push({
      storeUuid: storeInfo.storeUuid || storeInfo.uuid || "",
      storeName: storeInfo.title || storeInfo.name || "Store",
      items,
      subtotal: raw?.shoppingCart?.subtotal || raw?.subtotal || 0,
      deliveryFee: raw?.shoppingCart?.deliveryFee || raw?.deliveryFee || 0,
      serviceFee: raw?.shoppingCart?.serviceFee || raw?.serviceFee || 0,
      total: raw?.shoppingCart?.total || raw?.total || 0,
      etaRange: storeInfo.etaRange || "",
    });
  }

  return {
    draftOrderUuid: raw?.draftOrderUUID || raw?.draftOrderUuid || draftOrderUuid || "",
    stores,
    subtotal: raw?.subtotalAmount || raw?.subtotal || 0,
    deliveryFee: raw?.deliveryFeeAmount || raw?.deliveryFee || 0,
    serviceFee: raw?.serviceFeeAmount || raw?.serviceFee || 0,
    total: raw?.totalAmount || raw?.total || 0,
    currency: raw?.currencyCode || "USD",
  };
}

export async function addToCart(
  input: AddToCartInput,
  config: UberEatsConfig
): Promise<CartResponse> {
  // First create or get draft order
  let draftOrderUuid = config.draftOrderUuid;

  if (!draftOrderUuid) {
    const createData = await post<any>("/_p/api/createDraftOrderV2", {
      storeUuid: input.storeUuid,
    }, config);
    draftOrderUuid = createData?.data?.draftOrderUUID || createData?.draftOrderUUID || "";
    config.draftOrderUuid = draftOrderUuid;
    await saveConfig(config);
  }

  const data = await post<any>("/_p/api/addItemsToDraftOrderV2", {
    draftOrderUUID: draftOrderUuid,
    storeUuid: input.storeUuid,
    items: [{
      menuItemUUID: input.itemUuid,
      quantity: input.quantity || 1,
      sectionUUID: input.sectionUuid || "",
      subsectionUUID: input.subsectionUuid || "",
      selectedCustomizations: (input.customizations || []).map((c) => ({
        groupUUID: c.groupUuid,
        optionUUID: c.choiceUuid,
        quantity: 1,
      })),
    }],
  }, config);

  return parseCartResponse(data, draftOrderUuid);
}

export async function getCart(config: UberEatsConfig): Promise<CartResponse | null> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) return null;

  try {
    const data = await post<any>("/_p/api/getDraftOrderByUuidV2", {
      draftOrderUUID: draftOrderUuid,
    }, config);
    return parseCartResponse(data, draftOrderUuid);
  } catch {
    return null;
  }
}

export async function removeFromCart(
  itemUuid: string,
  config: UberEatsConfig
): Promise<CartResponse | null> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) return null;

  const data = await post<any>("/_p/api/removeItemsFromDraftOrderV2", {
    draftOrderUUID: draftOrderUuid,
    shoppingCartItemUUIDs: [itemUuid],
  }, config);

  return parseCartResponse(data, draftOrderUuid);
}

export async function updateCartQuantity(
  itemUuid: string,
  quantity: number,
  config: UberEatsConfig
): Promise<CartResponse | null> {
  const draftOrderUuid = config.draftOrderUuid;
  if (!draftOrderUuid) return null;

  const data = await post<any>("/_p/api/updateItemInDraftOrderV2", {
    draftOrderUUID: draftOrderUuid,
    shoppingCartItemUUID: itemUuid,
    quantity,
  }, config);

  return parseCartResponse(data, draftOrderUuid);
}

import type { UberEatsConfig } from "../schemas/config";
import type { SearchResult, SearchStore, SearchItem } from "../schemas/search";
import { post } from "../http";

export async function search(
  query: string,
  config: UberEatsConfig
): Promise<SearchResult> {
  const data = await post<any>("/_p/api/getSearchFeedV1", {
    userQuery: query,
    date: "",
    startTime: 0,
    endTime: 0,
    carouselId: "",
    sortAndFilters: [],
    marketingFeedType: "",
    billboardUuid: "",
    promotionUuid: "",
    targetingStoreTag: "",
  }, config);

  const stores: SearchStore[] = [];
  const items: SearchItem[] = [];

  const feedItems = data?.data?.feedItems || data?.feedItems || [];
  for (const item of feedItems) {
    const store = item?.store || item?.analyticsLabel?.store;
    if (store) {
      stores.push({
        uuid: store.storeUuid || store.uuid || "",
        title: store.title || store.name || "",
        imageUrl: store.heroImageUrl || store.imageUrl || "",
        etaRange: store.etaRange?.text || store.etaRange || "",
        rating: store.rating?.ratingValue || store.rating || 0,
        deliveryFee: store.deliveryFee?.discount || store.deliveryFee || 0,
        slug: store.slug || "",
        heroImageUrl: store.heroImageUrl || "",
        categories: store.categories || [],
      });
    }

    const catalogItems = item?.catalogItems || item?.items || [];
    for (const ci of catalogItems) {
      items.push({
        uuid: ci.uuid || ci.catalogItemUuid || "",
        title: ci.title || ci.name || "",
        price: ci.price || ci.itemPrice || 0,
        imageUrl: ci.imageUrl || "",
        itemDescription: ci.itemDescription || "",
        storeUuid: store?.storeUuid || store?.uuid || "",
      });
    }
  }

  return { stores, items };
}

export async function getNearbyRestaurants(
  config: UberEatsConfig,
  limit = 15
): Promise<SearchStore[]> {
  const data = await post<any>("/_p/api/getFeedV1", {
    date: "",
    startTime: 0,
    endTime: 0,
    carouselId: "",
    sortAndFilters: [],
    marketingFeedType: "",
    billboardUuid: "",
    promotionUuid: "",
    targetingStoreTag: "",
  }, config);

  const stores: SearchStore[] = [];
  const feedItems = data?.data?.feedItems || data?.feedItems || [];

  for (const item of feedItems) {
    const store = item?.store || item?.analyticsLabel?.store;
    if (store && stores.length < limit) {
      stores.push({
        uuid: store.storeUuid || store.uuid || "",
        title: store.title || store.name || "",
        imageUrl: store.heroImageUrl || store.imageUrl || "",
        etaRange: store.etaRange?.text || store.etaRange || "",
        rating: store.rating?.ratingValue || store.rating || 0,
        deliveryFee: store.deliveryFee?.discount || store.deliveryFee || 0,
        slug: store.slug || "",
        heroImageUrl: store.heroImageUrl || "",
        categories: store.categories || [],
      });
    }
  }

  return stores.slice(0, limit);
}

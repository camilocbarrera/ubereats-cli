import type { UberEatsConfig } from "../schemas/config";
import type { StoreDetail, MenuSection, MenuItem } from "../schemas/store";
import { post } from "../http";

export async function getStoreDetail(
  storeUuidOrSlug: string,
  config: UberEatsConfig
): Promise<StoreDetail> {
  const data = await post<any>("/_p/api/getStoreV1", {
    storeUuid: storeUuidOrSlug,
    sfNuggetCount: 0,
  }, config);

  const raw = data?.data || data;
  const storeInfo = raw?.catalogSectionsMap
    ? raw
    : raw?.store || raw;

  const sections: MenuSection[] = [];
  const sectionMap = storeInfo?.catalogSectionsMap || {};

  for (const [sectionUuid, section] of Object.entries(sectionMap) as any[]) {
    const sectionData = Array.isArray(section) ? section : [section];
    for (const s of sectionData) {
      const items: MenuItem[] = [];
      const payload = s?.payload?.standardItemsPayload;
      const catalogItems = payload?.catalogItems || s?.catalogItems || [];

      for (const [subsectionUuid, subsection] of Object.entries(catalogItems) as any[]) {
        const subItems = Array.isArray(subsection) ? subsection : [subsection];
        for (const item of subItems) {
          if (item?.uuid || item?.title) {
            items.push({
              uuid: item.uuid || "",
              title: item.title || "",
              itemDescription: item.itemDescription || "",
              price: item.price || 0,
              imageUrl: item.imageUrl || "",
              isAvailable: item.isAvailable !== false,
              hasCustomizations: (item.customizationsList?.length || 0) > 0,
              sectionUuid,
              subsectionUuid: subsectionUuid || "",
            });
          }
        }
      }

      if (items.length > 0) {
        sections.push({
          uuid: sectionUuid,
          title: s?.payload?.standardItemsPayload?.title?.text || s?.title || sectionUuid,
          items,
        });
      }
    }
  }

  // Fallback: parse sections from flat structure
  if (sections.length === 0) {
    const rawSections = storeInfo?.sections || storeInfo?.subsectionsMap || {};
    for (const [key, section] of Object.entries(rawSections) as any[]) {
      const sItems = section?.items || section?.itemUuids || [];
      const items: MenuItem[] = sItems.map((item: any) =>
        typeof item === "string"
          ? { uuid: item, title: item, price: 0 }
          : {
              uuid: item.uuid || "",
              title: item.title || "",
              itemDescription: item.itemDescription || "",
              price: item.price || 0,
              imageUrl: item.imageUrl || "",
              isAvailable: item.isAvailable !== false,
              hasCustomizations: false,
            }
      );
      if (items.length > 0) {
        sections.push({
          uuid: key,
          title: section?.title || key,
          items,
        });
      }
    }
  }

  return {
    uuid: storeInfo?.uuid || storeUuidOrSlug,
    title: storeInfo?.title || storeInfo?.name || "",
    slug: storeInfo?.slug || "",
    heroImageUrl: storeInfo?.heroImageUrl || "",
    rating: storeInfo?.rating?.ratingValue || storeInfo?.rating || 0,
    etaRange: storeInfo?.etaRange?.text || storeInfo?.etaRange || "",
    priceRange: storeInfo?.priceRange || "",
    address: storeInfo?.location?.address || storeInfo?.address || "",
    hours: storeInfo?.hours || "",
    isOpen: storeInfo?.isOpen !== false,
    deliveryFee: storeInfo?.fareInfo?.deliveryFee || storeInfo?.deliveryFee || 0,
    categories: storeInfo?.categories || [],
    sections,
  };
}

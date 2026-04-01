import type { UberEatsConfig } from "../schemas/config";
import type { ItemDetail, CustomizationGroup } from "../schemas/product";
import { post } from "../http";

export async function getItemDetail(
  storeUuid: string,
  itemUuid: string,
  config: UberEatsConfig,
  sectionUuid?: string,
  subsectionUuid?: string
): Promise<ItemDetail> {
  const data = await post<any>("/_p/api/getMenuItemV1", {
    storeUuid,
    menuItemUuid: itemUuid,
    sectionUuid: sectionUuid || "",
    subsectionUuid: subsectionUuid || "",
  }, config);

  const raw = data?.data || data;
  const item = raw?.menuItem || raw;

  const groups: CustomizationGroup[] = [];
  const customizations = item?.customizationsList || item?.customizations || [];

  for (const group of customizations) {
    const options = (group?.options || group?.choices || []).map((opt: any) => ({
      uuid: opt.uuid || opt.id || "",
      title: opt.title || opt.name || "",
      price: opt.price || 0,
      isAvailable: opt.isAvailable !== false,
      isDefault: opt.isDefault || false,
    }));

    groups.push({
      uuid: group.uuid || group.id || "",
      title: group.title || group.name || "",
      minPermitted: group.minPermitted || 0,
      maxPermitted: group.maxPermitted || 1,
      options,
    });
  }

  return {
    uuid: item?.uuid || itemUuid,
    title: item?.title || "",
    itemDescription: item?.itemDescription || "",
    price: item?.price || 0,
    imageUrl: item?.imageUrl || "",
    customizationGroups: groups,
  };
}

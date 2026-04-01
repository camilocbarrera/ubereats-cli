import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getStoreDetail } from "../services/store";
import { printDetail, printTable, withSpinner, uberGreenBold, dim, bold, hint, success, warn } from "../ui";

const storeUuid = process.argv[2];
if (!storeUuid) {
  console.error("Usage: ubereats store <store_uuid>");
  process.exit(1);
}

const config = await loadConfig();
const store = await withSpinner("Loading store...", () => getStoreDetail(storeUuid, config));

const status = store.isOpen !== false ? success("OPEN") : warn("CLOSED");

printDetail(store.title, [
  ["UUID", store.uuid],
  ["Address", store.address],
  ["Status", status],
  ["ETA", store.etaRange],
  ["Rating", store.rating ? String(store.rating) : null],
  ["Price Range", store.priceRange],
  ["Delivery Fee", store.deliveryFee != null ? formatPrice(store.deliveryFee) : null],
  ["Categories", store.categories?.join(", ")],
]);

if (store.sections?.length) {
  console.log(`  ${uberGreenBold("Menu")}\n`);

  for (const section of store.sections) {
    printTable({
      title: section.title,
      head: ["UUID", "Item", "Price", ""],
      rows: section.items.map((item) => {
        const price = formatPrice(item.price / 100);
        const flags = [
          item.isAvailable === false ? dim("UNAVAILABLE") : null,
          item.hasCustomizations ? dim("[+options]") : null,
        ].filter(Boolean).join(" ");
        return [item.uuid.slice(0, 8) + "...", item.title, price, flags || null];
      }),
    });
  }
}

import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { addToCart } from "../services/cart";
import { getItemDetail } from "../services/product";
import { withSpinner, ok, dim, bold, warn } from "../ui";

const storeUuid = process.argv[2];
const itemUuid = process.argv[3];
const itemName = process.argv[4] || "Item";
const quantity = parseInt(process.argv[5] || "1");
const customizationsArg = process.argv[6];

if (!storeUuid || !itemUuid) {
  console.error('Usage: ubereats add-to-cart <store_uuid> <item_uuid> [name] [qty] [customization_uuids]');
  console.error('  customization_uuids: comma-separated group:choice pairs (e.g., "groupUuid1:choiceUuid1,groupUuid2:choiceUuid2")');
  process.exit(1);
}

const customizations = customizationsArg
  ? customizationsArg.split(",").map((c) => {
      const [groupUuid, choiceUuid] = c.trim().split(":");
      return { groupUuid, choiceUuid };
    })
  : [];

const config = await loadConfig();

// Check for required customizations
const item = await withSpinner("Checking options...", () =>
  getItemDetail(storeUuid, itemUuid, config),
);

const requiredGroups = (item.customizationGroups || []).filter((g) => g.minPermitted > 0);
if (requiredGroups.length && !customizationsArg) {
  console.log(`\n${warn("This item has required customizations:")}`);
  for (const group of requiredGroups) {
    console.log(`    ${group.title} (required - pick ${group.minPermitted})`);
  }
  console.log(`${dim("Run: ubereats product")} ${storeUuid} ${itemUuid} ${dim("to see options")}\n`);
}

const result = await withSpinner("Adding to cart...", () =>
  addToCart({
    storeUuid,
    itemUuid,
    title: itemName,
    quantity,
    price: item.price,
    customizations,
  }, config),
);

console.log(`\n${ok(`Added ${bold(itemName)} x${quantity} to cart`)}`);

if (result.stores?.length) {
  for (const store of result.stores) {
    console.log(`\n  ${bold(store.storeName)}`);
    for (const p of store.items) {
      console.log(`    ${p.title} ${dim(`x${p.quantity}`)} -- ${formatPrice(p.totalPrice / 100)}`);
    }
    console.log(`\n  ${dim("Total")} ${bold(formatPrice(store.total / 100))}`);
  }
}
console.log();

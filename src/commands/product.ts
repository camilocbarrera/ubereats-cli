import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getItemDetail } from "../services/product";
import { printTable, withSpinner, uberGreenBold, dim, warn } from "../ui";

const storeUuid = process.argv[2];
const itemUuid = process.argv[3];
if (!storeUuid || !itemUuid) {
  console.error("Usage: ubereats product <store_uuid> <item_uuid>");
  process.exit(1);
}

const config = await loadConfig();
const item = await withSpinner("Loading options...", () =>
  getItemDetail(storeUuid, itemUuid, config),
);

console.log(`\n  ${uberGreenBold(item.title)} ${dim(`${formatPrice(item.price / 100)}`)}`);
if (item.itemDescription) console.log(`  ${dim(item.itemDescription)}`);
console.log();

if (!item.customizationGroups?.length) {
  console.log("  No customization options for this item.\n");
  process.exit(0);
}

for (const group of item.customizationGroups) {
  const required = group.minPermitted > 0 ? warn(" required") : "";
  const range =
    group.minPermitted === group.maxPermitted
      ? `Pick ${group.maxPermitted}`
      : `Pick ${group.minPermitted}-${group.maxPermitted}`;

  printTable({
    title: `${group.title}${required} ${dim(`[${range}]`)}`,
    head: ["UUID", "Option", "Price", ""],
    rows: group.options.map((opt) => {
      const price = opt.price && opt.price > 0 ? `+${formatPrice(opt.price / 100)}` : null;
      const status = opt.isAvailable === false ? dim("unavailable") : null;
      return [opt.uuid.slice(0, 8) + "...", opt.title, price, status];
    }),
  });
}

import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { search } from "../services/search";
import { printTable, withSpinner, uberGreenBold, dim, bold, hint } from "../ui";

const query = process.argv[2];
if (!query) {
  console.error("Usage: ubereats search <query>");
  process.exit(1);
}

const config = await loadConfig();
const result = await withSpinner(`Searching "${query}"...`, () => search(query, config));

if (!result.stores?.length && !result.items?.length) {
  console.log(`\n  No results for "${query}"\n`);
  process.exit(0);
}

console.log(`\n  ${uberGreenBold(`Results for "${query}"`)}\n`);

if (result.stores.length) {
  printTable({
    title: "Restaurants",
    head: ["UUID", "Name", "ETA", "Delivery Fee", "Rating"],
    rows: result.stores.slice(0, 15).map((s) => [
      s.uuid.slice(0, 8) + "...",
      s.title,
      s.etaRange || null,
      s.deliveryFee != null ? formatPrice(s.deliveryFee) : "Free",
      s.rating ? String(s.rating) : null,
    ]),
  });
  console.log();
}

if (result.items.length) {
  printTable({
    title: "Items",
    head: ["UUID", "Item", "Price", "Restaurant"],
    rows: result.items.slice(0, 15).map((i) => [
      i.uuid.slice(0, 8) + "...",
      i.title,
      i.price != null ? formatPrice(i.price / 100) : null,
      i.storeUuid ? i.storeUuid.slice(0, 8) + "..." : null,
    ]),
  });
}

console.log(`\n  ${dim(`${result.stores.length} restaurants, ${result.items.length} items found`)}\n`);

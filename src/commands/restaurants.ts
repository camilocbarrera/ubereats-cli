import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getNearbyRestaurants } from "../services/search";
import { printTable, withSpinner, dim, warn } from "../ui";

const limit = parseInt(process.argv[2] || "15");
const config = await loadConfig();
const stores = await withSpinner("Loading restaurants...", () =>
  getNearbyRestaurants(config, limit),
);

if (!stores.length) {
  console.log("\n  No restaurants available near you.\n");
  process.exit(0);
}

printTable({
  title: "Restaurants near you",
  head: ["UUID", "Name", "ETA", "Delivery Fee", "Rating"],
  rows: stores.map((s) => [
    s.uuid.slice(0, 8) + "...",
    s.title,
    s.etaRange || null,
    s.deliveryFee != null ? formatPrice(s.deliveryFee) : "Free",
    s.rating ? String(s.rating) : null,
  ]),
});

console.log(`\n  ${dim(`Showing ${stores.length} restaurants`)}\n`);

import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getOrders } from "../services/order";
import { printTable, withSpinner, dim, warn } from "../ui";

const config = await loadConfig();
const data = await withSpinner("Loading orders...", () => getOrders(config));

if (data.activeOrders?.length) {
  printTable({
    title: "Active Orders",
    head: ["UUID", "Restaurant", "Status", "ETA", "Total"],
    rows: data.activeOrders.map((o) => [
      o.uuid.slice(0, 8) + "...",
      o.storeName,
      o.state,
      o.eta || null,
      o.total ? formatPrice(o.total / 100) : null,
    ]),
  });
  console.log();
} else {
  console.log(`\n  ${dim("No active orders.")}\n`);
}

if (data.pastOrders?.length) {
  printTable({
    title: "Past Orders",
    head: ["UUID", "Restaurant", "Status", "Total", "Date"],
    rows: data.pastOrders.slice(0, 10).map((o) => [
      o.uuid.slice(0, 8) + "...",
      o.storeName,
      o.state,
      o.total ? formatPrice(o.total / 100) : null,
      o.placedAt || null,
    ]),
  });
  console.log();
}

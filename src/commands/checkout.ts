import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getCart } from "../services/cart";
import { getCheckoutDetail, setTip } from "../services/checkout";
import { printTable, withSpinner, uberGreenBold, dim, bold, success, warn, hint } from "../ui";

const tipArg = process.argv[2];
const config = await loadConfig();

if (tipArg !== undefined) {
  const tip = parseInt(tipArg);
  await setTip(tip, config);
  console.log(tip > 0 ? `\n  ${success("\u2713")} Tip set to ${bold(`${tip}%`)}` : `\n  ${success("\u2713")} Tip removed`);
}

const cart = await withSpinner("Loading cart...", () => getCart(config));

if (!cart || !cart.stores?.length) {
  console.log("\n  Cart is empty. Add items first.\n");
  process.exit(0);
}

console.log(`\n  ${uberGreenBold("Checkout Preview")}\n`);

for (const store of cart.stores) {
  printTable({
    title: store.storeName,
    head: ["Item", "Qty", "Price"],
    rows: store.items.map((item) => [
      item.title,
      `x${item.quantity}`,
      formatPrice(item.totalPrice / 100),
    ]),
  });

  if (store.etaRange) console.log(`  ${dim("ETA")} ${store.etaRange}`);
  console.log(`  ${dim("Store total")} ${bold(formatPrice(store.total / 100))}\n`);
}

try {
  const detail = await withSpinner("Loading summary...", () => getCheckoutDetail(config));

  console.log(`  ${uberGreenBold("Order Summary")}\n`);
  console.log(`  ${dim("Subtotal".padEnd(20))} ${formatPrice(detail.subtotal / 100)}`);
  console.log(`  ${dim("Delivery fee".padEnd(20))} ${formatPrice(detail.deliveryFee / 100)}`);
  console.log(`  ${dim("Service fee".padEnd(20))} ${formatPrice(detail.serviceFee / 100)}`);
  if (detail.tax) console.log(`  ${dim("Tax".padEnd(20))} ${formatPrice(detail.tax / 100)}`);
  if (detail.tip) console.log(`  ${dim("Tip".padEnd(20))} ${formatPrice(detail.tip / 100)}`);
  console.log(`  ${dim("\u2500".repeat(30))}`);
  console.log(`  ${bold("Total".padEnd(20))} ${bold(formatPrice(detail.total / 100))}`);

  if (detail.deliveryAddress) console.log(`\n  ${dim("Deliver to")} ${detail.deliveryAddress}`);
  if (detail.estimatedDelivery) console.log(`  ${dim("ETA")} ${detail.estimatedDelivery}`);
  if (detail.paymentMethod) console.log(`  ${dim("Payment")} ${detail.paymentMethod.label}`);
} catch {}

console.log(`\n  ${dim("Place order:")} ${hint("ubereats place-order")}\n`);

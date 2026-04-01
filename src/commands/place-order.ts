import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { getCart } from "../services/cart";
import { placeOrder } from "../services/order";
import { withSpinner, ok, fail, uberGreenBold, dim, bold } from "../ui";

const config = await loadConfig();

const cart = await withSpinner("Validating cart...", () => getCart(config));
if (!cart || !cart.stores?.length) {
  console.log(`\n${fail("Cart is empty.")}\n`);
  process.exit(1);
}

console.log(`\n  ${uberGreenBold("Placing order")}\n`);
for (const store of cart.stores) {
  console.log(`  ${bold(store.storeName)}`);
  for (const item of store.items) {
    console.log(`    ${item.title} ${dim(`x${item.quantity}`)} -- ${formatPrice(item.totalPrice / 100)}`);
  }
  console.log(`  ${dim("Total")} ${bold(formatPrice(store.total / 100))}\n`);
}

try {
  const result = await withSpinner("Placing order...", () => placeOrder(config));
  console.log(`\n${ok("Order placed!")}`);
  console.log(`\n  ${dim(JSON.stringify(result, null, 2))}\n`);
} catch (err: any) {
  console.log(`\n${fail(`Failed to place order: ${err.message}`)}\n`);
  process.exit(1);
}

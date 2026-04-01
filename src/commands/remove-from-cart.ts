import { loadConfig } from "../config";
import { formatPrice } from "../formatters";
import { removeFromCart, getCart } from "../services/cart";
import { withSpinner, ok, fail, dim, bold } from "../ui";

const itemUuid = process.argv[2];

if (!itemUuid) {
  console.error("Usage: ubereats remove-from-cart <item_uuid>");
  console.error('  item_uuid: shopping cart item UUID from "ubereats cart"');
  process.exit(1);
}

const config = await loadConfig();

const cart = await withSpinner("Loading cart...", () => getCart(config));
if (!cart) {
  console.log(`\n${fail("Cart is empty.")}\n`);
  process.exit(1);
}

let found = false;
for (const store of cart.stores) {
  const item = store.items.find((i) => i.uuid === itemUuid);
  if (item) {
    console.log(`\n  ${dim("Removing")} ${bold(item.title)} ${dim(`x${item.quantity} from ${store.storeName}`)}`);
    found = true;
    break;
  }
}

if (!found) {
  console.log(`\n${fail(`Item "${itemUuid}" not found in cart.`)}`);
  console.log(`  ${dim("Run")} ubereats cart ${dim("to see item UUIDs.")}\n`);
  process.exit(1);
}

await withSpinner("Removing...", () => removeFromCart(itemUuid, config));
console.log(`${ok("Removed from cart")}\n`);

const updated = await getCart(config);
if (!updated || !updated.stores.length) {
  console.log(`  ${dim("Cart is now empty.")}\n`);
} else {
  for (const store of updated.stores) {
    console.log(`  ${bold(store.storeName)}`);
    for (const p of store.items) {
      console.log(`    ${p.title} ${dim(`x${p.quantity}`)} -- ${formatPrice(p.totalPrice / 100)}`);
    }
    console.log(`  ${dim("Total")} ${bold(formatPrice(store.total / 100))}\n`);
  }
}

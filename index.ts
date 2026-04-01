#!/usr/bin/env bun
import { resolve, dirname } from "path";
import { readFileSync } from "fs";
import chalk from "chalk";
import { printBanner } from "./src/ui/banner";

const ROOT = dirname(Bun.main);
const command = process.argv[2];

// --- Update check (non-blocking) ---
const pkgPath = resolve(ROOT, "package.json");
const currentVersion = JSON.parse(readFileSync(pkgPath, "utf-8")).version;

const skipUpdateCheck = !command || command === "mcp" || command === "server";
const updateCheck = skipUpdateCheck
  ? Promise.resolve()
  : fetch("https://registry.npmjs.org/ubereats-cli/latest", {
      signal: AbortSignal.timeout(2000),
    })
      .then((r) => r.json())
      .then((data: any) => {
        if (data.version && data.version !== currentVersion) {
          const green = chalk.hex("#06C167");
          console.log(
            `\n  ${green.bold("Update available:")} ${chalk.dim(currentVersion)} ${chalk.dim("\u2192")} ${green(data.version)}`
          );
          console.log(`  Run ${chalk.cyan("npm install -g ubereats-cli@latest")} to update\n`);
        }
      })
      .catch(() => {});

const commands: Record<string, string> = {
  setup: "src/setup.ts",
  whoami: "src/commands/whoami.ts",
  search: "src/commands/search.ts",
  restaurants: "src/commands/restaurants.ts",
  store: "src/commands/store.ts",
  product: "src/commands/product.ts",
  cart: "src/commands/cart.ts",
  "add-to-cart": "src/commands/add-to-cart.ts",
  "remove-from-cart": "src/commands/remove-from-cart.ts",
  checkout: "src/commands/checkout.ts",
  "place-order": "src/commands/place-order.ts",
  orders: "src/commands/orders.ts",
  login: "src/commands/login.ts",
  addresses: "src/commands/addresses.ts",
  tip: "src/commands/tip.ts",
  server: "../server.ts",
  mcp: "src/mcp/index.ts",
};

if (!command || command === "help" || !commands[command]) {
  const G = chalk.hex("#06C167");
  const d = chalk.dim;
  const c = chalk.cyan;
  const b = chalk.bold;

  printBanner(currentVersion);

  console.log(`
${b("Browse")}
  ${c("search")} ${d("<query>")}                    Search restaurants and items
  ${c("restaurants")} ${d("[limit]")}               List nearby restaurants
  ${c("store")} ${d("<store_uuid>")}                Show restaurant details and menu
  ${c("product")} ${d("<store_uuid> <item_uuid>")}  Show item customization options

${b("Order")}
  ${c("add-to-cart")} ${d("<store> <item> [name] [qty] [customizations]")}  Add to cart
  ${c("remove-from-cart")} ${d("<item_uuid>")}      Remove from cart
  ${c("cart")}                              View current cart
  ${c("tip")} ${d("<percent>")}                     Set tip percentage (0, 5, 10, 15, 20)
  ${c("checkout")} ${d("[tip]")}                    Preview order summary
  ${c("place-order")}                        Place the order!
  ${c("orders")}                             Track active and past orders

${b("Account")}
  ${c("login")} ${d("[lat] [lng]")}                 Log in via browser
  ${c("setup")} ${d("<cookies> [lat] [lng]")}       Manual cookie setup
  ${c("addresses")}                          List saved addresses
  ${c("addresses switch")} ${d("<label>")}          Switch delivery address

${b("API")}
  ${c("server")}                             Start REST API server (port 3200)
  ${c("mcp")}                                Start MCP server (for Claude Code)

${d("Usage:")}  ubereats <command> [args...]
`);
  process.exit(command && command !== "help" ? 1 : 0);
}

const args = process.argv.slice(3);
const proc = Bun.spawn(["bun", "run", resolve(ROOT, commands[command]), ...args], {
  stdio: ["inherit", "inherit", "inherit"],
});
const exitCode = await proc.exited;
await updateCheck;
process.exit(exitCode);

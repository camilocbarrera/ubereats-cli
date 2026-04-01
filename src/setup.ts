import { saveConfig } from "./config";
import type { UberEatsConfig } from "./schemas/config";
import { ok, fail, dim, hint } from "./ui";

const cookies = process.argv[2];
if (!cookies) {
  console.error("Usage: ubereats setup <cookies> [lat] [lng]");
  console.error("\nGet your cookies from browser DevTools → Application → Cookies → ubereats.com");
  console.error("Copy all cookies as: sid=VALUE; csid=VALUE; ...");
  process.exit(1);
}

const latArg = process.argv[3];
const lngArg = process.argv[4];

const config: UberEatsConfig = {
  cookies,
  lat: latArg ? parseFloat(latArg) : 40.7128,
  lng: lngArg ? parseFloat(lngArg) : -73.9060,
};

await saveConfig(config);
console.log(`\n${ok("Config saved! You can now use the CLI.")}\n`);

console.log(`  ${dim("What's next?")}\n`);
console.log(`  ${hint("ubereats search <query>")}     Search for food`);
console.log(`  ${hint("ubereats restaurants")}         Browse restaurants`);
console.log(`  ${hint("ubereats addresses")}           Check delivery address\n`);

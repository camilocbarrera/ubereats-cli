import { loadConfig, saveConfig } from "../config";
import { getAddresses, switchAddress } from "../services/address";
import { printTable, printDetail, withSpinner, ok, fail, dim, bold, success, hint } from "../ui";

const action = process.argv[2];
const label = process.argv[3];

const config = await loadConfig();

if (action === "switch" && label) {
  const result = await withSpinner("Switching address...", () => switchAddress(label, config));
  if (!result) {
    console.log(`\n${fail(`Address "${label}" not found.`)}\n`);
    process.exit(1);
  }
  config.lat = result.lat;
  config.lng = result.lng;
  config.address = result.address;
  await saveConfig(config);
  console.log(`\n${ok(`Address set to ${bold(result.label)}`)}`);
  printDetail("Address", [
    ["Street", result.address],
    ["Coords", `${result.lat}, ${result.lng}`],
  ]);
  process.exit(0);
}

const addresses = await withSpinner("Loading addresses...", () => getAddresses(config));

if (!addresses.length) {
  console.log("\n  No saved addresses.\n");
  process.exit(0);
}

printTable({
  title: "Your addresses",
  head: ["Label", "Address", ""],
  rows: addresses.map((addr) => {
    const active = addr.isDefault ? success("DEFAULT") : null;
    return [addr.label, addr.address, active];
  }),
});

console.log(`\n  ${dim("Switch address:")} ${hint('ubereats addresses switch <label>')}\n`);

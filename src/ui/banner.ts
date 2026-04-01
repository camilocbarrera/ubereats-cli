import { readFileSync } from "fs";
import { join } from "path";
import { dim } from "./chalk";

const LOGO_PATH = join(import.meta.dir, "logo.txt");

export function printBanner(version?: string) {
  try {
    const logo = readFileSync(LOGO_PATH, "utf-8");
    process.stdout.write(logo);
  } catch {
    // Fallback if logo file is missing
    console.log("  Uber Eats CLI");
  }
  if (version) console.log(`\n  ${dim(`v${version}  ·  Order from Uber Eats via the terminal`)}`);
  console.log();
}

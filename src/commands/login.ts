import { saveConfig } from "../config";
import type { UberEatsConfig } from "../schemas/config";
import { printDetail, ok, fail, uberGreenBold, dim, bold, success, hint } from "../ui";

let chromium: typeof import("playwright").chromium;

try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log(`\n${fail("Playwright is not installed")}\n`);
  console.log(`  The ${bold("ubereats login")} command uses a browser to capture your session.`);
  console.log(`  To use it, install Playwright:\n`);
  console.log(`    ${hint("bun add playwright")}\n`);
  console.log(`  Or skip browser login and set your cookies manually:\n`);
  console.log(`    ${hint("ubereats setup <cookies>")}\n`);
  console.log(`  ${dim("To get your cookies:")}`);
  console.log(`  ${dim("1.")} Open ${hint("https://www.ubereats.com")} in your browser`);
  console.log(`  ${dim("2.")} Log in and open DevTools (F12) → Application → Cookies`);
  console.log(`  ${dim("3.")} Copy all cookie values as a string ${dim("(sid=...; ...)")}\n`);
  process.exit(1);
}

console.log(`\n  ${uberGreenBold("Uber Eats CLI Login")}`);
console.log(`  ${dim("Opening browser — log in to your Uber Eats account...")}\n`);

const browser = await chromium.launch({
  headless: false,
  args: ["--window-size=420,800"],
});

const context = await browser.newContext({
  viewport: { width: 420, height: 800 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});

const page = await context.newPage();

let capturedCookies: string | null = null;

await page.goto("https://www.ubereats.com");

console.log(`  ${dim("Waiting for you to log in...")}`);
console.log(`  ${dim("(The browser will close automatically after login)")}\n`);

const timeout = 5 * 60 * 1000;
const start = Date.now();

while (!capturedCookies && Date.now() - start < timeout) {
  await new Promise((r) => setTimeout(r, 3000));

  try {
    const cookies = await context.cookies();
    const hasSid = cookies.some((c) => c.name === "sid" && c.value.length > 10);
    const hasUtag = cookies.some((c) => c.name === "utag_main");

    if (hasSid) {
      capturedCookies = cookies
        .filter((c) => c.domain.includes("ubereats.com") || c.domain.includes("uber.com"))
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    }
  } catch {}
}

await browser.close();

if (!capturedCookies) {
  console.log(`\n${fail("Login timed out. Please try again.")}\n`);
  process.exit(1);
}

console.log(`${ok("Session captured!")} ${dim("Saving config...")}`);

const config: UberEatsConfig = {
  cookies: capturedCookies,
  lat: parseFloat(process.argv[2] || "40.7128"),
  lng: parseFloat(process.argv[3] || "-73.9060"),
};

await saveConfig(config);
console.log(`${ok("Config saved! You can now use the CLI.")}\n`);

console.log(`  ${dim("What's next?")}\n`);
console.log(`  ${hint("ubereats search <query>")}     Search for food`);
console.log(`  ${hint("ubereats restaurants")}         Browse restaurants`);
console.log(`  ${hint("ubereats addresses")}           Check delivery address\n`);

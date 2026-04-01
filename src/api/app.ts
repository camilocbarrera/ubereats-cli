import { Hono } from "hono";
import { cors } from "hono/cors";
import { loadConfig } from "../config";
import { getUser } from "../services/auth";
import { getAddresses, switchAddress } from "../services/address";
import { search, getNearbyRestaurants } from "../services/search";
import { getStoreDetail } from "../services/store";
import { getItemDetail } from "../services/product";
import { addToCart, getCart, removeFromCart } from "../services/cart";
import { getCheckoutDetail, setTip, getPaymentMethods } from "../services/checkout";
import { placeOrder, getOrders } from "../services/order";
import type { UberEatsConfig } from "../schemas/config";

type Variables = { config: UberEatsConfig };

const app = new Hono<{ Variables: Variables }>();

app.use("*", cors());

app.use("/api/*", async (c, next) => {
  const config = await loadConfig();
  c.set("config", config);
  await next();
});

// --- Auth ---

app.get("/api/whoami", async (c) => {
  const config = c.get("config");
  return c.json(await getUser(config));
});

// --- Search ---

app.get("/api/search", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ error: "Missing query parameter 'q'" }, 400);
  const config = c.get("config");
  return c.json(await search(q, config));
});

// --- Restaurants ---

app.get("/api/restaurants", async (c) => {
  const config = c.get("config");
  const limit = parseInt(c.req.query("limit") || "15");
  return c.json(await getNearbyRestaurants(config, limit));
});

// --- Store ---

app.get("/api/store/:uuid", async (c) => {
  const config = c.get("config");
  const uuid = c.req.param("uuid");
  return c.json(await getStoreDetail(uuid, config));
});

// --- Product ---

app.get("/api/product/:storeUuid/:itemUuid", async (c) => {
  const config = c.get("config");
  return c.json(await getItemDetail(c.req.param("storeUuid"), c.req.param("itemUuid"), config));
});

// --- Cart ---

app.post("/api/cart/add", async (c) => {
  const config = c.get("config");
  const body = await c.req.json<{
    storeUuid: string;
    itemUuid: string;
    title: string;
    quantity?: number;
    customizations?: { groupUuid: string; choiceUuid: string }[];
  }>();
  if (!body.storeUuid || !body.itemUuid || !body.title) {
    return c.json({ error: "Missing required fields: storeUuid, itemUuid, title" }, 400);
  }
  return c.json(await addToCart(body, config));
});

app.delete("/api/cart/item/:itemUuid", async (c) => {
  const config = c.get("config");
  return c.json(await removeFromCart(c.req.param("itemUuid"), config));
});

app.get("/api/cart", async (c) => {
  const config = c.get("config");
  return c.json(await getCart(config));
});

// --- Tip ---

app.post("/api/tip", async (c) => {
  const config = c.get("config");
  const body = await c.req.json<{ percent: number }>();
  if (body.percent === undefined) return c.json({ error: "Missing: percent" }, 400);
  await setTip(body.percent, config);
  return c.json({ ok: true, tip: body.percent });
});

// --- Checkout ---

app.get("/api/checkout", async (c) => {
  const config = c.get("config");
  const [cart, detail] = await Promise.allSettled([
    getCart(config),
    getCheckoutDetail(config),
  ]);
  return c.json({
    cart: cart.status === "fulfilled" ? cart.value : null,
    detail: detail.status === "fulfilled" ? detail.value : null,
  });
});

// --- Payment ---

app.get("/api/payment-methods", async (c) => {
  const config = c.get("config");
  return c.json(await getPaymentMethods(config));
});

// --- Order ---

app.post("/api/place-order", async (c) => {
  const config = c.get("config");
  return c.json(await placeOrder(config));
});

app.get("/api/orders", async (c) => {
  const config = c.get("config");
  return c.json(await getOrders(config));
});

// --- Addresses ---

app.get("/api/addresses", async (c) => {
  const config = c.get("config");
  return c.json(await getAddresses(config));
});

app.post("/api/addresses/switch", async (c) => {
  const config = c.get("config");
  const body = await c.req.json<{ label: string }>();
  if (!body.label) return c.json({ error: "Missing: label" }, 400);
  const result = await switchAddress(body.label, config);
  if (!result) return c.json({ error: `Address "${body.label}" not found` }, 404);
  return c.json({ ok: true, address: result });
});

export default app;

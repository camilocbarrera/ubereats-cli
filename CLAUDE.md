# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## What is this

**Uber Eats CLI** — a command-line interface to order from [Uber Eats](https://www.ubereats.com/) directly from the terminal and Claude Code. Uses Uber Eats' internal web API (`ubereats.com/_p/api/*`) with session cookies obtained via browser login.

This CLI is designed to be used **from Claude Code** as the primary interface for ordering food without leaving the terminal.

## Quick Start

```bash
bun install
ubereats login           # Opens browser → log in → cookies auto-captured
ubereats addresses       # List saved delivery addresses
ubereats search "pizza"  # Search for food
```

## All Commands

### Authentication

| Command | Description |
|---------|-------------|
| `ubereats login [lat] [lng]` | Opens a Chromium browser at ubereats.com. Log in with your account. Session cookies are auto-captured and saved. Default location: NYC. |
| `ubereats setup <cookies> [lat] [lng]` | Manual cookie setup — paste cookies from browser DevTools. Use when `login` doesn't work. |
| `ubereats whoami` | Shows authenticated user: name, email, phone. |

### Delivery Address

| Command | Description |
|---------|-------------|
| `ubereats addresses` | Lists all saved delivery addresses. |
| `ubereats addresses switch <label>` | Switches delivery address by label (e.g., 'home', 'work'). |

### Browse

| Command | Description |
|---------|-------------|
| `ubereats search "<query>"` | Searches for restaurants and items. Returns UUIDs, names, prices, and delivery info. |
| `ubereats restaurants [limit]` | Lists nearby restaurants. Default limit: 15. |
| `ubereats store <store_uuid>` | Shows restaurant details and full menu with item UUIDs and prices. |
| `ubereats product <store_uuid> <item_uuid>` | Shows item customization options (groups and choices). |

### Order Flow

| Command | Description |
|---------|-------------|
| `ubereats add-to-cart <store_uuid> <item_uuid> [name] [qty] [customizations]` | Adds an item to cart. `customizations` is comma-separated `groupUuid:choiceUuid` pairs. |
| `ubereats remove-from-cart <item_uuid>` | Removes an item from cart by its shopping cart item UUID. |
| `ubereats cart` | Shows current cart: items, quantities, prices, fees, and totals. |
| `ubereats tip <percent>` | Set tip percentage (0, 5, 10, 15, 20). |
| `ubereats checkout [tip]` | Previews the order: items, fees, delivery info, payment. |
| `ubereats place-order` | Places the order! |
| `ubereats orders` | Shows active and past orders. |

## Complete Order Example (Claude Code workflow)

```bash
# 1. Search for food
ubereats search "pizza"
# Output: Restaurants and items with UUIDs

# 2. View restaurant menu
ubereats store <store_uuid>
# Output: Full menu with item UUIDs and prices

# 3. Check item options
ubereats product <store_uuid> <item_uuid>
# Output: Customization groups with choices

# 4. Add to cart
ubereats add-to-cart <store_uuid> <item_uuid> "Pepperoni Pizza" 1

# 5. Review the cart
ubereats cart

# 6. Preview checkout
ubereats checkout

# 7. Place the order
ubereats place-order

# 8. Track the order
ubereats orders
```

## Architecture

```
src/
  constants.ts       → URLs, headers, defaults
  http.ts            → Typed HTTP helpers (get/post/put)
  config.ts          → Config load/save with Zod validation
  formatters.ts      → Price formatting (USD)
  schemas/           → Zod schemas (auth, search, store, product, cart, checkout, order, address)
  services/          → Business logic (shared by CLI, API + MCP)
  api/app.ts         → Hono REST API
  mcp/index.ts       → MCP server (16 tools for Claude)
  commands/          → CLI commands
index.ts             → CLI entry point
server.ts            → API server entry point
```

## MCP Server

The CLI includes an MCP server (`src/mcp/index.ts`) that exposes 16 tools for Claude to call natively. When the MCP server is configured, Claude can search, order, and track without running CLI commands.

**Tools**: `whoami`, `search`, `list_restaurants`, `get_store`, `get_item_options`, `add_to_cart`, `remove_from_cart`, `get_cart`, `checkout_preview`, `set_tip`, `list_payment_methods`, `set_payment_method`, `place_order`, `track_orders`, `list_addresses`, `switch_address`

## API Reference

Base URL: `https://www.ubereats.com`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/_p/api/getProfilesForUserV1` | POST | User profiles |
| `/_p/api/getSearchFeedV1` | POST | Search restaurants/items |
| `/_p/api/getFeedV1` | POST | Home feed (nearby restaurants) |
| `/_p/api/getStoreV1` | POST | Restaurant details + full menu |
| `/_p/api/getMenuItemV1` | POST | Item details with customizations |
| `/_p/api/createDraftOrderV2` | POST | Create a new cart |
| `/_p/api/getDraftOrderByUuidV2` | POST | Get cart contents |
| `/_p/api/addItemsToDraftOrderV2` | POST | Add items to cart |
| `/_p/api/updateItemInDraftOrderV2` | POST | Update item quantity |
| `/_p/api/removeItemsFromDraftOrderV2` | POST | Remove items from cart |
| `/_p/api/getCheckoutPresentationV1` | POST | Checkout summary |
| `/_p/api/checkoutOrdersByDraftOrdersV1` | POST | Place order |
| `/_p/api/getActiveOrdersV1` | POST | Active orders |
| `/api/getPastOrdersV1` | POST | Past orders |
| `/_p/api/setTargetLocationV1` | POST | Set delivery address |
| `/_p/api/getSavedAddressesV1` | POST | List saved addresses |

## Agent Behavior

When using this CLI as an agent (e.g., from Claude Code), follow these rules:

- **Use emojis in all output.** Make the experience fun and visual. Use emojis for statuses (🛒 cart, 🔍 search, ✅ added, 📦 order, 🚗 delivery, 💰 prices, 🍕 food, ⏱️ ETA, 📍 address, etc.).
- **Show the UBEREATS CLI banner on first interaction.** When the CLI is invoked for the first time in a conversation, run `ubereats` (with no arguments) to render the ASCII art banner.
- **Always confirm before placing an order.** Before running `ubereats place-order`, show the user the full checkout summary and ask for explicit confirmation.
- **Always confirm before changing the delivery address.** Before switching addresses, tell the user which address will be set and ask for confirmation.
- **Check customizations before adding to cart.** Before adding an item, run `ubereats product <store_uuid> <item_uuid>` to check for required customizations. Ask the user which options they want.
- **Show prices in human-readable format.** Prices from the API are in cents — divide by 100 and format as USD (e.g., `$12.99`).

## Important Notes

- **Cookie expiry**: Session cookies expire. Re-run `ubereats login` when you get auth errors.
- **Prices**: All API prices are in cents (e.g., `1299` = `$12.99`). The CLI formats these automatically.
- **UUIDs**: Store and item UUIDs are shown truncated in CLI output. Use `ubereats store <uuid>` to see full UUIDs in the menu.
- **Draft orders**: Cart state is managed through "draft orders" — a UUID stored in config. Cleared after placing an order.
- **Config file**: `.ubereats-config.json` stores cookies, coordinates, and draft order UUID. Gitignored.

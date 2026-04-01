# Changelog

## 0.0.2 (2026-04-01)

### Bug Fixes

- Include `src/ui/logo.txt` in npm package so the chafa-rendered ASCII art banner displays correctly

## 0.0.1 (2026-04-01)

### Initial Release

First public release of `ubereats-cli` — order from Uber Eats via the terminal, REST API, or MCP server for Claude Code.

#### Features

- **15 CLI commands** for the full ordering flow: search, browse, cart, checkout, and order tracking
- **16 MCP tools** for Claude Code integration — order food without leaving the terminal
- **REST API** (Hono) on port 3200 with full CRUD endpoints
- **Browser-based login** via Playwright — auto-captures session cookies
- **Manual setup** for cookie-based authentication from DevTools
- **Chafa-rendered logo** banner with Uber Eats branding

#### Commands

| Command | Description |
|---------|-------------|
| `login` | Browser-based login with Playwright |
| `setup` | Manual cookie setup from DevTools |
| `whoami` | Show user profile |
| `search` | Search restaurants and menu items |
| `restaurants` | List nearby restaurants |
| `store` | View restaurant details and full menu |
| `product` | View item customization options |
| `add-to-cart` | Add items with optional customizations |
| `remove-from-cart` | Remove items from cart |
| `cart` | View current cart |
| `tip` | Set tip percentage |
| `checkout` | Preview order with price breakdown |
| `place-order` | Place the order |
| `orders` | Track active and past orders |
| `addresses` | Manage delivery addresses |

#### MCP Tools

`whoami`, `search`, `list_restaurants`, `get_store`, `get_item_options`, `add_to_cart`, `remove_from_cart`, `get_cart`, `checkout_preview`, `set_tip`, `list_payment_methods`, `set_payment_method`, `place_order`, `track_orders`, `list_addresses`, `switch_address`

#### Architecture

- **Services layer** shared across CLI, REST API, and MCP server
- **Zod schemas** for all API request/response validation
- **Typed HTTP helpers** with cookie-based auth
- **UI toolkit**: chalk (Uber Eats green #06C167), ora spinners, cli-table3 tables

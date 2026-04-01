```
  _   _ _                ___       _
 | | | | |__   ___ _ __ | __|__ _ | |_ ___
 | |_| | '_ \ / _ \ '__ | _|/ _` ||  _(_-<
  \___/|_.__/ \___/_|   |___\__,_| \__/__/
              CLI
```

Order from Uber Eats via the terminal, REST API, or MCP server for Claude Code.

## Install

```bash
npm install -g ubereats-cli
```

## Quick Start

```bash
ubereats login              # Opens browser → log in → session auto-captured
ubereats search "pizza"     # Search for food
ubereats store <uuid>       # View restaurant menu
ubereats add-to-cart <store_uuid> <item_uuid> "Pepperoni Pizza"
ubereats checkout           # Preview order
ubereats place-order        # Place it!
ubereats orders             # Track delivery
```

## Commands

### Browse
- `ubereats search <query>` — Search restaurants and items
- `ubereats restaurants [limit]` — List nearby restaurants
- `ubereats store <store_uuid>` — Restaurant details and menu
- `ubereats product <store_uuid> <item_uuid>` — Item customization options

### Order
- `ubereats add-to-cart <store> <item> [name] [qty] [customizations]` — Add to cart
- `ubereats remove-from-cart <item_uuid>` — Remove from cart
- `ubereats cart` — View current cart
- `ubereats tip <percent>` — Set tip (0, 5, 10, 15, 20)
- `ubereats checkout` — Preview order summary
- `ubereats place-order` — Place the order
- `ubereats orders` — Track orders

### Account
- `ubereats login [lat] [lng]` — Log in via browser
- `ubereats setup <cookies>` — Manual cookie setup
- `ubereats addresses` — List saved addresses
- `ubereats addresses switch <label>` — Switch delivery address
- `ubereats whoami` — User profile

### API
- `ubereats server` — Start REST API (port 3200)
- `ubereats mcp` — Start MCP server for Claude Code

## MCP Server (Claude Code)

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "ubereats": {
      "command": "bun",
      "args": ["run", "src/mcp/index.ts"],
      "cwd": "/path/to/ubereats-cli"
    }
  }
}
```

16 tools available: `whoami`, `search`, `list_restaurants`, `get_store`, `get_item_options`, `add_to_cart`, `remove_from_cart`, `get_cart`, `checkout_preview`, `set_tip`, `list_payment_methods`, `set_payment_method`, `place_order`, `track_orders`, `list_addresses`, `switch_address`

## License

MIT

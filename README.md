# AutoCharge Maroc — Next.js project

This is the source for the Chargeur Voiture 4-en-1 Maroc site. It uses the Next.js 16 App Router, React, TypeScript, and Cloudflare D1 for orders. Vinext adapts the Next.js app to the Cloudflare Workers environment used by Sites.

## Pages and order flow

- `/store.html` is the customer storefront and order form.
- `/dashboard` is the owner's order dashboard. It is public, with status changes and confirmed permanent deletion. Anyone with the URL can access customer details and manage orders.
- `/api/orders` accepts orders and supplies dashboard updates.
- `/api/orders/status` changes the order status.
- `drizzle/0000_strong_gertrude_yorkes.sql` contains the initial orders table migration.

## Run locally

Use Node.js 22.13 or newer, then run `npm ci` and `npm run dev`. For a production build, run `npm run build`. The development and build scripts use Vinext so the Next.js routes can access the Cloudflare D1 binding. A local database must be initialized with the SQL migration to exercise order submission and the dashboard. The public storefront remains available without it.

The hosted site requires the Sites D1 binding `DB` . Deploying this ZIP to an ordinary Node.js Next.js server requires replacing the Cloudflare database and authentication adapters; copying the files to another host alone does not provide its order database.

## WhatsApp order notifications

After a new order is saved, the server can send the approved message template to the shop owner's WhatsApp number. Duplicate submissions with the same order ID do not send another message. A WhatsApp failure is logged and does not erase an order or change the customer's confirmation. Configure these hosted Site runtime values:

- `WHATSAPP_ACCESS_TOKEN`: Meta Cloud API access token, stored as a secret.
- `WHATSAPP_PHONE_NUMBER_ID`: the sending phone number ID in WhatsApp Manager (not the visible telephone number).
- `WHATSAPP_RECIPIENT_NUMBER`: owner's WhatsApp number in international format, for example `2126...`.
- `WHATSAPP_TEMPLATE_NAME`: exact approved template name.
- `WHATSAPP_TEMPLATE_LANGUAGE`: approved language code; defaults to `fr_MA`.
- `WHATSAPP_GRAPH_API_VERSION`: optional API version; currently configured as `v25.0`.

The 11 body values are sent in this order: order reference, product name, quantity, unit price, discount, total, customer name, customer phone, city, address, order date/time (Casablanca). Verify this sequence against the exact approved template before enabling the four required runtime values. No token or recipient number belongs in source control or browser code.

If Meta approves `autocharge_order_alert_v2` as a Utility template, set `WHATSAPP_TEMPLATE_NAME` to that name. Its three body values are order reference, customer name, and total. The dashboard retains the full order details. The current approved Utility template is active and delivery was confirmed by the owner.

Keep `public/assets` together with `public/store.html` when moving or deploying the project. The project is configured for its existing Sites deployment by `.openai/hosting.json`.

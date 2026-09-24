# AutoCharge Maroc — Next.js project

This is the source for the Chargeur Voiture 4-en-1 Maroc site. It uses the Next.js 16 App Router, React, TypeScript, and Cloudflare D1 for orders. Vinext adapts the Next.js app to the Cloudflare Workers environment used by Sites.

## Pages and order flow

- `/store.html` is the customer storefront and order form.
- `/dashboard` is the owner's order dashboard. It requires Sign in with ChatGPT and the configured owner email.
- `/api/orders` accepts orders and supplies dashboard updates.
- `/api/orders/status` changes the order status.
- `drizzle/0000_strong_gertrude_yorkes.sql` contains the initial orders table migration.

## Run locally

Use Node.js 22.13 or newer, then run `npm ci` and `npm run dev`. For a production build, run `npm run build`. The development and build scripts use Vinext so the Next.js routes can access the Cloudflare D1 binding. A local database must be initialized with the SQL migration to exercise order submission and the dashboard. The public storefront remains available without it.

The hosted site requires the Sites D1 binding `DB` and its existing authentication headers. Deploying this ZIP to an ordinary Node.js Next.js server requires replacing the Cloudflare database and authentication adapters; copying the files to another host alone does not provide its order database.

Keep `public/assets` together with `public/store.html` when moving or deploying the project. The project is configured for its existing Sites deployment by `.openai/hosting.json`.

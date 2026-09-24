# AutoCharge Maroc — Vercel deployment

This edition runs on standard Next.js with `next build` and Vercel Functions. It retains the product page, order form, dashboard, and automatic order refresh.

## Setup

1. Create a Postgres database through Vercel Storage (for example Neon) and connect it to the Vercel project. Verify that the deployment receives `DATABASE_URL`.
2. Run `vercel-schema.sql` once in your database's SQL editor. This creates the orders table. Existing orders from the Sites D1 database are not automatically copied.
3. In Vercel Project Settings → Environment Variables, set `ADMIN_PASSWORD` to a private password of at least 16 characters. Add it for Production (and Preview if desired). Redeploy after setting variables.
4. Set the Framework Preset to Next.js and disable any prior Build Command or Output Directory override. The project runs `npm run build` → `next build`.
5. The storefront is at `/store.html`; the dashboard is at `/dashboard`. Sign in with the `ADMIN_PASSWORD` you configured. Test an order and verify it appears in the dashboard.

Locally, run `npm ci`, create `.env.local` with `DATABASE_URL` and `ADMIN_PASSWORD`, execute the schema in the database, and run `npm run dev`. Keep `.env.local` private. This project does not include the database contents or secrets.

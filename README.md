# AutoCharge Maroc

This GitHub version runs standard Next.js on Vercel. The live Sites version remains the shared backend for orders and WhatsApp alerts.

Run `npm ci`, then `npm run dev`. Build with `npm run build`.

Vercel settings: Next.js framework, repository root directory, build command `npm run vercel-build`, output directory `.next`.

The storefront is `/store.html`; `/` redirects there. The public dashboard is `/dashboard`, with live refresh, status changes and confirmed permanent deletion. Anyone with its URL can view and manage customer orders.

The Vercel server forwards requests to the existing Sites backend. Keep that Site public and active. WhatsApp credentials remain stored as secrets in Sites. No credentials need to be entered in Vercel. Both websites use the same orders database.

This does not migrate the Cloudflare database into Vercel.

# AutoCharge Maroc — Next.js on Vercel

The storefront is at `/store.html` and the password-protected order dashboard is at `/dashboard`. Orders are stored as individual private JSON files in Vercel Blob. This project does not require Postgres or a SQL database.

## Vercel setup

1. In Vercel, create a Postgres database using **Vercel Postgres** or connect a Postgres service such as Neon.
2. Add `POSTGRES_URL` to your project environment variables in Vercel.
3. In **Settings → Environment Variables**, set `ADMIN_PASSWORD` to a private password of at least 16 characters for Production.
4. Redeploy after connecting the database and setting the password. The project must use the **Next.js** framework preset and its `npm run build` command.
5. Submit a test order at `/store.html`, then sign in at `/dashboard` to check that it appears and change its status.

The project does not contain credentials or order data. Orders are stored in Postgres so they persist across deployments and are suitable for production use.

Locally, run `npm ci`, add `POSTGRES_URL` and `ADMIN_PASSWORD` to a private `.env.local`, then run `npm run dev`. Do not commit `.env.local`.

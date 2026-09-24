# AutoCharge Maroc — Next.js on Vercel

The storefront is at `/store.html` and the password-protected order dashboard is at `/dashboard`. Orders are stored as individual private JSON files in Vercel Blob. This project does not require Postgres or a SQL database.

## Vercel setup

1. In your Vercel project, open **Storage**, create a **Blob** store with **Private** access, and connect it to this project for Production. Vercel provides `BLOB_READ_WRITE_TOKEN` for the connected store. Public Blob storage is unsuitable for customer names, phones, and addresses.
2. In **Settings → Environment Variables**, set `ADMIN_PASSWORD` to a private password of at least 16 characters for Production.
3. Redeploy after connecting the store and setting the password. The project must use the **Next.js** framework preset and its `npm run build` command.
4. Submit a test order at `/store.html`, then sign in at `/dashboard` to check that it appears and change its status.

The project does not contain credentials or order data. Existing orders in the former Sites D1 database or Postgres database do not move automatically. Keep the private Blob store connected across future deployments; order files survive code updates. Blob storage operations may count toward Vercel usage.

Locally, run `npm ci`, add `BLOB_READ_WRITE_TOKEN` and `ADMIN_PASSWORD` to a private `.env.local`, then run `npm run dev`. Do not commit `.env.local`.

# AutoCharge Maroc — order integration

This is the existing Next.js product page with its design, media, pricing, bilingual form, and responsive layout preserved. Customers order at `/store.html` without opening WhatsApp or needing the WhatsApp app. The server stores each order as a private JSON file, then asks the official WhatsApp Cloud API to notify the store owner. The page confirms only after Meta accepts that notification.

## Existing product and price

The site sells one **Chargeur voiture 4-en-1 avec câbles rétractables** for **178 DH**. Every additional unit has a 10% discount (17.80 DH). There are no selectable variants. The API calculates the total from these server-side values; it does not accept browser-supplied prices or unknown products/variants.

## Set up Vercel storage

The current project has no SQL database or dashboard. The smallest durable addition is a **Private Vercel Blob** store. In the Vercel project, open **Storage → Create → Blob**, select **Private**, and connect it to the Production environment. Vercel provides `BLOB_READ_WRITE_TOKEN` automatically. Orders are private `orders/<uuid>.json` files containing customer details, price, `orderStatus`, and `notificationStatus`. Do not use a Public Blob store. Keep this store connected across deployments. The old Sites orders are not migrated.

## Set up official WhatsApp Cloud API

In [Meta for Developers](https://developers.facebook.com/apps/), create/select a Business app with WhatsApp and open **WhatsApp → API Setup**. Copy the **Phone number ID** into `WHATSAPP_PHONE_NUMBER_ID`. A temporary access token there can be used for a short test; for production, create a **system user access token** in **Meta Business Settings → Users → System users**, give that user access to the app and WhatsApp Business Account and the `whatsapp_business_messaging` permission, and put the token into `WHATSAPP_ACCESS_TOKEN`. Never commit it.

Set `WHATSAPP_RECIPIENT_NUMBER` to the destination WhatsApp number with country code, digits only, for example `2126...`. The Cloud API sender number is identified by `WHATSAPP_PHONE_NUMBER_ID`; the recipient is the phone that should receive the alert. Test the sender and recipient combination in Meta before launch. The WABA ID identifies the WhatsApp Business Account but is not needed for this send endpoint.

In **WhatsApp Manager → Message templates**, create and submit a template named `autocharge_new_order`, language `fr`, with exactly these 11 body variables, in order (choose the category Meta approves for this use):

```text
🛍️ Nouvelle commande AutoCharge Maroc
Référence : {{1}}
Produit : {{2}}
Quantité : {{3}}
Prix unitaire : {{4}}
Réduction : {{5}}
Total : {{6}}
Client : {{7}}
Téléphone : {{8}}
Ville : {{9}}
Adresse : {{10}}
Date : {{11}}
```

Wait until the template is approved. If Meta approves a different name or language code, configure `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANGUAGE` to match exactly. The API always sends an approved template, even outside the customer-service window.

## Environment variables

Copy `.env.example` for local development, replacing placeholders privately. In **Vercel → Project → Settings → Environment Variables**, set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT_NUMBER`, `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE` for Production. Connecting the Private Blob store supplies `BLOB_READ_WRITE_TOKEN`. `WHATSAPP_GRAPH_VERSION` defaults to `v24.0`. Set a random `ORDER_RETRY_SECRET` of at least 32 characters if you want to use the retry endpoint. Redeploy after changing variables.

## Test and operate

Run `npm ci`, `node --experimental-strip-types --test tests/order.test.mjs`, and `npm run build`. Locally, `npm run dev` needs a Private Blob token and real Meta credentials for a delivery test. On Vercel, submit one test order at `/store.html`; verify the reference appears on the page and the message arrives at the destination WhatsApp. A Meta API acceptance ID is not proof of final delivery; check WhatsApp itself. If sending fails, the order stays in Private Blob with `notificationStatus: "failed"`, the customer sees an error, and submitting the same form again safely retries it.

For an operator retry, use `POST /api/orders/retry` with a JSON body `{"id":"<order UUID>"}` and `Authorization: Bearer <ORDER_RETRY_SECRET>`. Find failed order IDs in the Private Blob store's `orders/` files. The endpoint has no public UI. A record stuck in `sending` should be checked against Meta delivery status before manual intervention, to avoid sending a duplicate alert.

The form has same-origin request checks, server-side validation, a hidden bot field, and a small per-instance request limit. For higher traffic, also configure Vercel's edge rate limiting/WAF. Do not put real credentials in GitHub. `.env` files are ignored; `.env.example` contains placeholders only.

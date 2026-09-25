import { get, put } from "@vercel/blob";
import { PRODUCT, type OrderInput, priceFor } from "./order-logic";

export type Order = OrderInput & {
  id: string;
  reference: string;
  productId: typeof PRODUCT.id;
  productName: typeof PRODUCT.name;
  currency: typeof PRODUCT.currency;
  unitPriceCents: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  createdAt: string;
  orderStatus: "pending" | "confirmed" | "cancelled" | "completed";
  notificationStatus: "sending" | "sent" | "failed";
  whatsappMessageId?: string;
  updatedAt: string;
};

const pathFor = (id: string) => `orders/${id}.json`;
function requireStore() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !(process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)) {
    throw new Error("Connect a private Vercel Blob store to this project");
  }
}
export function makeOrder(input: OrderInput): Order {
  const id = input.idempotencyKey;
  const now = new Date().toISOString();
  return {
    ...input, id, reference: `ORD-${id.slice(0, 12).toUpperCase()}`,
    productId: PRODUCT.id, productName: PRODUCT.name, currency: PRODUCT.currency,
    unitPriceCents: PRODUCT.unitPriceCents, ...priceFor(input.quantity),
    createdAt: now, updatedAt: now, orderStatus: "pending", notificationStatus: "sending",
  };
}
export async function readOrder(id: string): Promise<{ order: Order; etag: string } | null> {
  requireStore();
  const result = await get(pathFor(id), { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { order: await new Response(result.stream).json() as Order, etag: result.blob.etag };
}
export async function createOrder(order: Order): Promise<boolean> {
  requireStore();
  try {
    await put(pathFor(order.id), JSON.stringify(order), {
      access: "private", addRandomSuffix: false,
      contentType: "application/json", cacheControlMaxAge: 60,
    });
    return true;
  } catch (error) {
    if (await readOrder(order.id)) return false;
    throw error;
  }
}
export async function updateOrder(order: Order, etag: string): Promise<void> {
  requireStore();
  await put(pathFor(order.id), JSON.stringify({ ...order, updatedAt: new Date().toISOString() }), {
    access: "private", addRandomSuffix: false, allowOverwrite: true, ifMatch: etag,
    contentType: "application/json", cacheControlMaxAge: 60,
  });
}

import { get, list, put } from "@vercel/blob";

export type Order = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  unit_price_cents: number;
  discount_cents: number;
  total_cents: number;
  language: string;
  status: string;
  updated_at: string;
};

function requireStore() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Connect a private Vercel Blob store to this project");
}

function pathname(id: string) {
  return `orders/${id}.json`;
}

async function readOrder(id: string): Promise<Order | null> {
  const result = await get(pathname(id), { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).json() as Promise<Order>;
}

export async function saveOrder(order: Order): Promise<void> {
  requireStore();
  // A repeated form submission must not overwrite an order whose status has changed.
  if (await readOrder(order.id)) return;
  try {
    await put(pathname(order.id), JSON.stringify(order), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
  } catch (error) {
    // Another request may have created the same order while we were checking.
    if (await readOrder(order.id)) return;
    throw error;
  }
}

export async function getOrders(): Promise<Order[]> {
  requireStore();
  const blobs: { pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "orders/", limit: 1000, cursor });
    blobs.push(...page.blobs.filter(blob => /^orders\/[a-f0-9-]{36}\.json$/i.test(blob.pathname)));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const newest = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 500);
  const orders = await Promise.all(newest.map(blob => readOrder(blob.pathname.slice(7, -5))));
  return orders.filter((order): order is Order => order !== null).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  requireStore();
  const order = await readOrder(id);
  if (!order) return false;
  order.status = status;
  order.updated_at = new Date().toISOString();
  await put(pathname(id), JSON.stringify(order), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  return true;
}

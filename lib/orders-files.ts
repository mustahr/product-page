import { sql } from "@vercel/postgres";

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

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price_cents INTEGER NOT NULL,
      discount_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL,
      language TEXT NOT NULL DEFAULT 'fr',
      status TEXT NOT NULL DEFAULT 'Nouveau',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

async function readOrder(id: string): Promise<Order | null> {
  await ensureSchema();
  const result = await sql<Order>`SELECT * FROM orders WHERE id = ${id}`;
  return result.rows[0] ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  await ensureSchema();
  const existing = await readOrder(order.id);
  if (existing) return;

  const result = await sql`
    INSERT INTO orders (
      id, created_at, name, phone, city, address, quantity,
      unit_price_cents, discount_cents, total_cents, language, status, updated_at
    ) VALUES (
      ${order.id}, ${order.created_at}, ${order.name}, ${order.phone}, ${order.city}, ${order.address}, ${order.quantity},
      ${order.unit_price_cents}, ${order.discount_cents}, ${order.total_cents}, ${order.language}, ${order.status}, ${order.updated_at}
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  if (result.rowCount === 0) {
    const refreshed = await readOrder(order.id);
    if (refreshed) return;
    throw new Error("Order insert was skipped unexpectedly.");
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureSchema();
  const result = await sql<Order>`SELECT * FROM orders ORDER BY created_at DESC LIMIT 500;`;
  return result.rows;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  await ensureSchema();
  const result = await sql`
    UPDATE orders
    SET status = ${status}, updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
    RETURNING id;
  `;
  return (result.rowCount ?? 0) > 0;
}

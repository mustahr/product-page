import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  discountCents: integer("discount_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull().default("Nouveau"),
  updatedAt: text("updated_at").notNull(),
});

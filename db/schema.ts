import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  productId: text("product_id").notNull().default("car-charger"),
  productName: text("product_name").notNull().default("Chargeur voiture 4-en-1"),
  currency: text("currency").notNull().default("MAD"),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  discountCents: integer("discount_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull().default("Nouveau"),
  updatedAt: text("updated_at").notNull(),
  attribution: text("attribution").notNull().default("{}"),
  stockDeducted: integer("stock_deducted").notNull().default(0),
  variant: text("variant").notNull().default(''),
  variantStockDeducted: integer("variant_stock_deducted").notNull().default(0),
});
export const products=sqliteTable('products',{
 stockQuantity:integer('stock_quantity'),lowStockThreshold:integer('low_stock_threshold').notNull().default(5),
 details:text('details').notNull().default('{}'), id:text('id').primaryKey(), name:text('name').notNull(),description:text('description').notNull(),benefits:text('benefits').notNull(),image:text('image').notNull(),priceCents:integer('price_cents').notNull(),currency:text('currency').notNull(),country:text('country').notNull(),template:text('template').notNull(),language:text('language').notNull(),status:text('status').notNull().default('draft'),createdAt:text('created_at').notNull()
});

export const productImages=sqliteTable('product_images',{id:text('id').primaryKey(),mime:text('mime').notNull(),size:integer('size').notNull(),createdAt:text('created_at').notNull()});
export const variantStock=sqliteTable('variant_stock',{productId:text('product_id').notNull(),option:text('option').notNull(),quantity:integer('quantity')},table=>[primaryKey({columns:[table.productId,table.option]})]);

export const orderConfirmations=sqliteTable('order_confirmations',{
 orderId:text('order_id').primaryKey().references(()=>orders.id,{onDelete:'cascade'}),
 notes:text('notes').notNull().default(''),outcome:text('outcome').notNull().default(''),
 followUpDate:text('follow_up_date').notNull().default(''),revision:integer('revision').notNull().default(1),
 updatedAt:text('updated_at').notNull()
});

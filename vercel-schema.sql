CREATE TABLE IF NOT EXISTS orders (
 id text PRIMARY KEY,
 created_at text NOT NULL,
 name text NOT NULL,
 phone text NOT NULL,
 city text NOT NULL,
 address text NOT NULL,
 quantity integer NOT NULL,
 unit_price_cents integer NOT NULL,
 discount_cents integer NOT NULL,
 total_cents integer NOT NULL,
 language text NOT NULL,
 status text NOT NULL DEFAULT 'Nouveau',
 updated_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

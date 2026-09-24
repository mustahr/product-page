import { neon } from "@neondatabase/serverless";

export function sql<T extends Record<string, unknown> = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for orders");
  return neon(url)(strings, ...values) as Promise<T[]>;
}

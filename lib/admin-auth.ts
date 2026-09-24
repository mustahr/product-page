import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const cookieName = "autocharge_admin";
export function token() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 16) throw new Error("Set ADMIN_PASSWORD to at least 16 characters");
  return createHmac("sha256", secret).update("autocharge-dashboard-v1").digest("hex");
}
export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) return false;
  const expected = Buffer.from(token());
  const actual = Buffer.from(value);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

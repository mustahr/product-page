import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { retryOrder } from "@/lib/order-service";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.ORDER_RETRY_SECRET || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const a = Buffer.from(secret), b = Buffer.from(supplied);
  if (secret.length < 32 || a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let body: { id?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!/^[a-f0-9-]{36}$/i.test(body.id || "")) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  try {
    const order = await retryOrder(body.id!);
    return NextResponse.json({ ok: true, reference: order.reference, notificationStatus: order.notificationStatus });
  } catch (error) {
    console.error("Order notification retry failed", error);
    return NextResponse.json({ ok: false, error: "Retry unavailable" }, { status: 503 });
  }
}

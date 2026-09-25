import { NextRequest, NextResponse } from "next/server";
import { validateOrder } from "@/lib/order-logic";
import { submitOrder } from "@/lib/order-service";
export const runtime = "nodejs";

const attempts = new Map<string, { count: number; expires: number }>();
function rateLimited(request: NextRequest) {
  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (attempts.size > 2000) for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
  const entry = attempts.get(ip);
  if (!entry || entry.expires < now) { attempts.set(ip, { count: 1, expires: now + 15 * 60_000 }); return false; }
  entry.count += 1;
  return entry.count > 5;
}
function wantsJson(request: NextRequest) { return request.headers.get("accept")?.includes("application/json") ?? false; }
function failure(request: NextRequest, language: string, error: string, status: number, fieldErrors?: Record<string, string>) {
  if (wantsJson(request)) return NextResponse.json({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status, headers: { "Cache-Control": "no-store" } });
  const reason = fieldErrors?.phone ? "phone" : fieldErrors?.quantity ? "quantity" : fieldErrors ? "details" : "storage";
  return NextResponse.redirect(new URL(`/order-error?lang=${language}&reason=${reason}`, request.url), 303);
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return failure(request, "fr", "forbidden", 403);
  if (Number(request.headers.get("content-length") || 0) > 8192) return failure(request, "fr", "too_large", 413);
  let form: FormData;
  try { form = await request.formData(); }
  catch { return failure(request, "fr", "invalid_form", 400); }
  const language = form.get("language") === "ar" ? "ar" : "fr";
  if (form.get("contact_website")) return failure(request, language, "invalid_form", 422);
  const { input, fieldErrors } = validateOrder(form);
  if (!input) return failure(request, language, "validation", 422, fieldErrors);
  if (rateLimited(request)) return failure(request, language, "rate_limited", 429);
  try {
    const order = await submitOrder(input);
    if (wantsJson(request)) return NextResponse.json({ ok: true, id: order.id, reference: order.reference }, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.redirect(new URL(`/order-confirmation?lang=${language}&order=${encodeURIComponent(order.reference)}`, request.url), 303);
  } catch (error) {
    console.error("Order submission failed", error instanceof Error ? error.name : "unknown");
    return failure(request, language, "notification", 503);
  }
}

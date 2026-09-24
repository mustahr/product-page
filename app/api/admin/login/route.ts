import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName, token } from "@/lib/admin-auth";
import { timingSafeEqual } from "node:crypto";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const a = Buffer.from(password), b = Buffer.from(secret);
  if (secret.length < 16 || a.length !== b.length || !timingSafeEqual(a,b)) return NextResponse.redirect(new URL("/dashboard/login?error=1",request.url),303);
  (await cookies()).set(cookieName,token(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
  return NextResponse.redirect(new URL("/dashboard",request.url),303);
}

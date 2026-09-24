import { sql } from "@/lib/orders-db";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
const statuses=["Nouveau","À confirmer","Confirmé","En préparation","Expédié","Livré","Annulé"];
export async function POST(request: NextRequest) {
  const json=request.headers.get("accept")?.includes("application/json");
  const fail=(message:string,status:number)=>json?NextResponse.json({error:message},{status}):new Response(message,{status});
  if(!(await isAdmin())) return fail("Accès refusé",403);
  if(request.headers.get("origin")!==new URL(request.url).origin) return fail("Requête non autorisée",403);
  const form=await request.formData();
  const id=String(form.get("id")||""), status=String(form.get("status")||"");
  if(!/^[a-f0-9-]{36}$/i.test(id)||!statuses.includes(status)) return fail("Données invalides",400);
  try {
    const result=await sql`UPDATE orders SET status=${status}, updated_at=${new Date().toISOString()} WHERE id=${id} RETURNING id`;
    if(!result.length) return fail("Commande introuvable",404);
    return json?NextResponse.json({ok:true,status}):NextResponse.redirect(new URL("/dashboard",request.url),303);
  } catch(error) { console.error("Status update failed",error); return fail("Impossible de modifier le statut",503); }
}

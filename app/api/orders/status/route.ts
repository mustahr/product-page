import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
const statuses=["Nouveau","À confirmer","Confirmé","En préparation","Expédié","Livré","Annulé"];
export async function POST(request: NextRequest) {
  const json=request.headers.get("accept")?.includes("application/json");
  const fail=(message:string,status:number)=>json?NextResponse.json({error:message},{status}):new Response(message,{status});
  if(request.headers.get("oai-authenticated-user-email")?.toLowerCase()!=="simouaamer@gmail.com") return fail("Accès refusé",403);
  if(request.headers.get("origin")!==new URL(request.url).origin) return fail("Requête non autorisée",403);
  const form=await request.formData();
  const id=String(form.get("id")||""), status=String(form.get("status")||"");
  if(!/^[a-f0-9-]{36}$/i.test(id)||!statuses.includes(status)) return fail("Données invalides",400);
  try {
    const result=await env.DB.prepare("UPDATE orders SET status=?, updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();
    if(!result.meta.changes) return fail("Commande introuvable",404);
    return json?NextResponse.json({ok:true,status}):NextResponse.redirect(new URL("/dashboard",request.url),303);
  } catch(error) { console.error("Status update failed",error); return fail("Impossible de modifier le statut",503); }
}

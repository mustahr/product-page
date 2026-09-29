import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
const price = 17800;
async function notifyOwner(order: {id:string;name:string;phone:string;city:string;address:string;quantity:number;discount:number;total:number;createdAt:string}) {
  const token=env.WHATSAPP_ACCESS_TOKEN, phoneId=env.WHATSAPP_PHONE_NUMBER_ID,
    recipient=env.WHATSAPP_RECIPIENT_NUMBER, template=env.WHATSAPP_TEMPLATE_NAME;
  if(!token || !phoneId || !recipient || !template) return "not_configured";
  const detailedValues=[order.id.slice(0,8).toUpperCase(),"Chargeur voiture 4-en-1",String(order.quantity),"178 DH",
    `${(order.discount/100).toFixed(2)} DH`,`${(order.total/100).toFixed(2)} DH`,order.name,order.phone,
    order.city,order.address,new Date(order.createdAt).toLocaleString("fr-MA",{timeZone:"Africa/Casablanca",dateStyle:"short",timeStyle:"short"})];
  const values=template==="autocharge_order_alert_v2"
    ? [detailedValues[0],order.name,detailedValues[5]] : detailedValues;
  try {
    const apiVersion=env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
    const response=await fetch(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneId)}/messages`,{
      method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
      body:JSON.stringify({messaging_product:"whatsapp",to:recipient.replace(/\D/g,""),type:"template",
        template:{name:template,language:{code:env.WHATSAPP_TEMPLATE_LANGUAGE || "fr_MA"},
          components:[{type:"body",parameters:values.map(text=>({type:"text",text}))}]}})
    });
    if(!response.ok) {
      console.error("WhatsApp notification failed",response.status,await response.text());
      return response.status===401 || response.status===403 ? "authentication_failed" : "api_failed";
    }
    return "accepted";
  } catch(error) {console.error("WhatsApp notification failed",error);return "network_failed";}
}
type Order = {id:string;created_at:string;name:string;phone:string;city:string;address:string;quantity:number;total_cents:number;status:string};
function clean(value: FormDataEntryValue | null, max: number) { return typeof value === "string" ? value.trim().slice(0,max) : ""; }
function wantsJson(request: NextRequest) {return request.headers.get("accept")?.includes("application/json") ?? false;}
export async function GET(request: NextRequest) {
  try {
    const result=await env.DB!.prepare("SELECT id, created_at, name, phone, city, address, quantity, total_cents, status FROM orders ORDER BY created_at DESC LIMIT 500").all<Order>();
    return NextResponse.json({orders:result.results||[]},{headers:{"Cache-Control":"no-store"}});
  } catch(error) {console.error("Orders load failed",error);return NextResponse.json({error:"Commandes indisponibles"},{status:503});}
}
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name=clean(form.get("name"),100), phone=clean(form.get("phone"),25), city=clean(form.get("city"),80), address=clean(form.get("address"),250);
  const quantity=Number(form.get("quantity"));
  const language=form.get("language")==="ar"?"ar":"fr";
  const fieldErrors:Record<string,string>={};
  if(!name) fieldErrors.name="required";
  if(!city) fieldErrors.city="required";
  if(!address) fieldErrors.address="required";
  const phoneDigits=phone.replace(/\D/g,"");
  if(phoneDigits.length<8 || phoneDigits.length>15) fieldErrors.phone="invalid";
  if(!Number.isSafeInteger(quantity) || quantity<1 || quantity>99) fieldErrors.quantity="invalid";
  if(Object.keys(fieldErrors).length) {
    if(wantsJson(request)) return NextResponse.json({ok:false,fieldErrors},{status:422});
    const reason=fieldErrors.phone?"phone":fieldErrors.quantity?"quantity":"details";
    return NextResponse.redirect(new URL(`/order-error?lang=${language}&reason=${reason}`,request.url),303);
  }
  const submittedId=clean(form.get("orderId"),80);
  const id=/^[a-f0-9-]{36}$/i.test(submittedId)?submittedId:crypto.randomUUID();
  const now=new Date().toISOString();
  const discount=(quantity-1)*1780;
  try {
    const result=await env.DB!.prepare("INSERT OR IGNORE INTO orders (id, created_at, name, phone, city, address, quantity, unit_price_cents, discount_cents, total_cents, language, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id,now,name,phone,city,address,quantity,price,discount,quantity*price-discount,language,"Nouveau",now).run();
    const notification=result.meta.changes
      ? await notifyOwner({id,name,phone,city,address,quantity,discount,total:quantity*price-discount,createdAt:now})
      : "duplicate";
    if(wantsJson(request)) return NextResponse.json({ok:true,id,notification});
    return NextResponse.redirect(new URL(`/order-confirmation?lang=${language}`,request.url),303);
  } catch(error) {
    console.error("Order storage failed",error);
    if(wantsJson(request)) return NextResponse.json({ok:false,error:"storage"},{status:503});
    return NextResponse.redirect(new URL(`/order-error?lang=${language}&reason=storage`,request.url),303);
  }
}

export async function DELETE(request: NextRequest) {
  if(request.headers.get("origin")!==new URL(request.url).origin) return NextResponse.json({error:"Requête non autorisée"},{status:403});
  let id:unknown;
  try {id=(await request.json() as {id?:unknown}).id;}catch{return NextResponse.json({error:"Données invalides"},{status:400});}
  if(typeof id!=="string"||!/^[a-f0-9-]{36}$/i.test(id)) return NextResponse.json({error:"Données invalides"},{status:400});
  try {
    const result=await env.DB!.prepare("DELETE FROM orders WHERE id=?").bind(id).run();
    if(!result.meta.changes)return NextResponse.json({error:"Commande introuvable"},{status:404});
    return NextResponse.json({ok:true});
  }catch(error){console.error("Order deletion failed",error);return NextResponse.json({error:"Impossible de supprimer la commande"},{status:503});}
}

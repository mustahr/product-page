import { getOrders, saveOrder } from "@/lib/orders-files";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { sendOrderToWhatsApp } from "@/lib/whatsapp";
export const runtime = "nodejs";
const price = 17800;
type Order = {id:string;created_at:string;name:string;phone:string;city:string;address:string;quantity:number;total_cents:number;status:string};
function clean(value: FormDataEntryValue | null, max: number) { return typeof value === "string" ? value.trim().slice(0,max) : ""; }
function wantsJson(request: NextRequest) {return request.headers.get("accept")?.includes("application/json") ?? false;}
export async function GET(request: NextRequest) {
  if(!(await isAdmin())) return NextResponse.json({error:"Accès refusé"},{status:403});
  try {
    const orders=await getOrders();
    return NextResponse.json({orders},{headers:{"Cache-Control":"no-store"}});
  } catch(error) {console.error("Orders load failed",error);return NextResponse.json({error:"Commandes indisponibles"},{status:503});}
}
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name=clean(form.get("name"),100), phone=clean(form.get("phone"),25), city=clean(form.get("city"),80), address=clean(form.get("address"),250);
  const quantity=Number(form.get("quantity"));
  const language=form.get("language")==="ar"?"ar":"fr";
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const payload = { ok: false, error: "config" };
    if (wantsJson(request)) return NextResponse.json(payload, { status: 503 });
    return NextResponse.redirect(new URL(`/order-error?lang=${language}&reason=config`, request.url), 303);
  }
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
    const order = {id,created_at:now,name,phone,city,address,quantity,unit_price_cents:price,discount_cents:discount,total_cents:quantity*price-discount,language,status:"Nouveau",updated_at:now};
    await saveOrder(order);
    try {
      await sendOrderToWhatsApp({
        id: order.id,
        created_at: order.created_at,
        name: order.name,
        phone: order.phone,
        city: order.city,
        address: order.address,
        quantity: order.quantity,
        total_cents: order.total_cents,
        language: order.language,
        status: order.status,
      });
    } catch (whatsappError) {
      console.error("Order WhatsApp notification failed", whatsappError);
    }
    if(wantsJson(request)) return NextResponse.json({ok:true,id});
    return NextResponse.redirect(new URL(`/order-confirmation?lang=${language}`,request.url),303);
  } catch(error) {
    console.error("Order storage failed",error);
    if(wantsJson(request)) return NextResponse.json({ok:false,error:"storage"},{status:503});
    return NextResponse.redirect(new URL(`/order-error?lang=${language}&reason=storage`,request.url),303);
  }
}

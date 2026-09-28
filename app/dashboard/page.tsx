import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import OrdersClient, {type Order} from "./orders-client";
import "./style.css";
export const dynamic="force-dynamic";
export default async function Dashboard(){
 const h=await headers(); const email=h.get("oai-authenticated-user-email")?.toLowerCase();
 if(!email) redirect("/signin-with-chatgpt?return_to=/dashboard");
 if(email!=="simouaamer@gmail.com") return <main className="dash"><h1>Accès réservé</h1><p>Ce tableau est réservé au propriétaire de la boutique.</p></main>;
 let orders:Order[]=[]; let unavailable=false;
 try {const result=await env.DB.prepare("SELECT id, created_at, name, phone, city, address, quantity, total_cents, status FROM orders ORDER BY created_at DESC LIMIT 500").all<Order>();orders=result.results||[];}catch(error){console.error("Dashboard load failed",error);unavailable=true;}
 return <main className="dash"><header className="dash-header"><div><a className="brand" href="/store.html">AutoCharge Maroc</a><h1>Commandes</h1><p>Suivez les commandes et mettez à jour leur statut.</p></div><a className="store-link" href="/store.html">Voir la boutique ↗</a></header><OrdersClient initialOrders={orders} unavailable={unavailable}/></main>
}

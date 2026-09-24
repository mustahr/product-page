import { sql } from "@/lib/orders-db";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import OrdersClient, {type Order} from "./orders-client";
import "./style.css";
export const dynamic="force-dynamic";
export default async function Dashboard(){
 if(!(await isAdmin())) redirect("/dashboard/login");
 let orders:Order[]=[]; let unavailable=false;
 try {orders=await sql<Order>`SELECT id, created_at, name, phone, city, address, quantity, total_cents, status FROM orders ORDER BY created_at DESC LIMIT 500`;}catch(error){console.error("Dashboard load failed",error);unavailable=true;}
 return <main className="dash"><header className="dash-header"><div><a className="brand" href="/store.html">AutoCharge Maroc</a><h1>Commandes</h1><p>Suivez les commandes et mettez à jour leur statut.</p></div><a className="store-link" href="/store.html">Voir la boutique ↗</a></header><OrdersClient initialOrders={orders} unavailable={unavailable}/></main>
}

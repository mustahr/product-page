import {loadOrders} from "@/lib/order-backend";
import OrdersClient, {type Order} from "./orders-client";
import "./style.css";
export const dynamic="force-dynamic";
export default async function Dashboard(){
 let orders:Order[]=[]; let unavailable=false;
 try {const result=await loadOrders() as {orders:Order[]};orders=result.orders||[];}catch(error){console.error("Dashboard load failed",error);unavailable=true;}
 return <main className="dash"><header className="dash-header"><div><a className="brand" href="/store.html">AutoCharge Maroc</a><h1>Commandes</h1><p>Suivez les commandes et mettez à jour leur statut.</p></div><a className="store-link" href="/store.html">Voir la boutique ↗</a></header><OrdersClient initialOrders={orders} unavailable={unavailable}/></main>
}

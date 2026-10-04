import ProductManager from "./product-manager";
import { loadOrders } from "@/lib/order-backend";
import OrdersClient, {type Order} from "./orders-client";
import "./style.css";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export default async function Dashboard(){
 let orders:Order[]=[]; let unavailable=false;
 try {const result=await loadOrders() as {orders:Order[]};orders=result.orders||[];}catch(error){console.error("Dashboard load failed",error);unavailable=true;}
 return <main className="dash"><header className="dash-header"><div><a className="brand" href="/">Mustahr Store</a><h1>Commandes</h1><p>Suivez les commandes et mettez à jour leur statut.</p></div><a className="store-link" href="/">Voir la boutique</a></header><section className="product-pages" aria-labelledby="product-pages-title"><div className="product-pages-heading"><h2 id="product-pages-title">Pages produits</h2><p>Ouvrez vos pages de vente.</p></div><div className="product-page-links"><a href="/store.html" target="_blank" rel="noopener noreferrer"><span className="product-market">Maroc · 178 DH</span><strong>Chargeur voiture 4-en-1</strong><span className="product-visit">Voir la page · nouvel onglet</span></a><a href="/vegetable-cutter.html" target="_blank" rel="noopener noreferrer"><span className="product-market">Libye · 159 LYD</span><strong lang="ar" dir="rtl">قطاعة خضروات 9 في 1</strong><span className="product-visit">Voir la page · nouvel onglet</span></a></div></section><ProductManager/><OrdersClient initialOrders={orders} unavailable={unavailable}/></main>
}

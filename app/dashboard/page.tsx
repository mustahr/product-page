import { loadOrders } from "@/lib/order-backend";
import StockAlerts from "./stock-alerts";
import OrdersClient, {type Order} from "./orders-client";
import "./style.css";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export default async function Dashboard(){
 let orders:Order[]=[]; let unavailable=false;
 try {const result=await loadOrders() as {orders:Order[]};orders=result.orders||[];}catch(error){console.error("Dashboard load failed",error);unavailable=true;}
 return <main className="dash orders-dashboard"><header className="dash-header"><div><a className="brand" href="/">Mustahr Store</a><h1>Commandes</h1><p>Suivez les commandes et mettez à jour leur statut.</p></div><a className="store-link" href="/">Voir la boutique</a></header><section className="product-pages"><div className="product-pages-heading"><h2>Votre catalogue</h2><p>Consultez vos produits, modifiez leurs informations ou ajoutez une nouvelle offre.</p></div><div className="product-page-links"><a href="/dashboard/products"><strong>Mes produits</strong><span>Voir, modifier ou supprimer</span></a><a href="/dashboard/products/new"><strong>+ Ajouter un produit</strong><span>Choisir un modèle et créer sa page</span></a><a href="/dashboard/statistics"><strong>Statistiques de vente</strong><span>Commandes et chiffre d’affaires par produit</span></a><a href="/dashboard/campaigns"><strong>Suivi des publicités</strong><span>Créer un lien et comparer les campagnes</span></a></div></section><StockAlerts/><OrdersClient initialOrders={orders} unavailable={unavailable}/></main>
}

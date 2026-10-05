import Statistics from './statistics';
import '../style.css';
import './statistics.css';
export default function StatisticsPage(){return <main className="dash sales-page"><header className="dash-header"><div><a href="/dashboard">← Tableau de bord</a><h1>Statistiques de vente</h1><p>Les commandes et le chiffre d’affaires livré, produit par produit.</p></div><a className="store-link" href="/dashboard/products">Mes produits</a></header><Statistics/></main>;}

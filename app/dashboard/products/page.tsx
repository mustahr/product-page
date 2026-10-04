import Catalog from './catalog';
import '../style.css';
export default function Products(){return <main className="dash"><header className="dash-header"><div><a href="/dashboard">← Tableau de bord</a><h1>Mes produits</h1><p>Consultez vos offres, leurs brouillons et leurs pages publiées.</p></div><a className="store-link" href="/dashboard/products/new">+ Ajouter un produit</a></header><Catalog/></main>;}

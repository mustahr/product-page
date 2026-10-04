import ProductManager from '../../product-manager';
import '../../style.css';
export default function NewProduct(){return <main className="dash"><header className="dash-header"><div><a href="/dashboard">← Tableau de bord</a><h1>Ajouter un produit</h1><p>1. Modèle · 2. Informations complètes · 3. Aperçu & publication</p></div></header><ProductManager editor/></main>;}

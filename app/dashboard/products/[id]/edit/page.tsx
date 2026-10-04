import ProductManager from '../../../product-manager';
import '../../../style.css';
export default async function EditProduct({params}:{params:Promise<{id:string}>}){const {id}=await params;return <main className="dash"><header className="dash-header"><div><a href="/dashboard">← Tableau de bord</a><h1>Modifier le produit</h1></div></header><ProductManager editor productId={id}/></main>;}

import ManualOrder from './manual-order';
import '../../style.css';
import './manual-order.css';
export default function ManualOrderPage(){return <main className="dash manual-order-page"><header className="dash-header"><div><a href="/dashboard">← Commandes</a><h1>Ajouter une commande</h1><p>Enregistrez une commande reçue par téléphone ou WhatsApp.</p></div></header><ManualOrder/></main>;}

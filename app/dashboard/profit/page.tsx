import Profit from './profit';
import '../style.css';
import './profit.css';
export default function ProfitPage(){return <main className="dash profit-page"><header className="dash-header"><div><a href="/dashboard">Tableau de bord</a><h1>Suivi des bénéfices</h1><p>Revenus livrés, coûts réels et dépenses publicitaires.</p></div><a className="store-link" href="/dashboard/statistics">Statistiques de vente</a></header><Profit/></main>;}

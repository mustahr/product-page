import Statistics from '../statistics/statistics';
import LinkBuilder from './link-builder';
import '../style.css';
import '../statistics/statistics.css';
import './campaigns.css';
export default function CampaignsPage(){return <main className="dash sales-page"><header className="dash-header"><div><a href="/dashboard">← Tableau de bord</a><h1>Suivi des publicités</h1><p>Identifiez les campagnes qui génèrent des commandes sur votre boutique.</p></div><a className="store-link" href="/dashboard/statistics">Statistiques de vente</a></header><LinkBuilder/><Statistics campaigns/></main>;}

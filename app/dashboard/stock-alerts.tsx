'use client';
import {useEffect,useState} from 'react';
import type {Product} from '@/lib/product-templates';
import {stockState} from '@/lib/product-stock';
export default function StockAlerts(){const [products,setProducts]=useState<Product[]>([]),[error,setError]=useState('');
 useEffect(()=>{let live=true;async function load(){try{const r=await fetch('/api/products',{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json() as {products:Product[]};if(live){setProducts(d.products);setError('');}}catch{if(live)setError('Alertes de stock indisponibles. Nouvelle tentative automatique.');}}void load();const timer=setInterval(()=>{if(!document.hidden)void load();},15000);return()=>{live=false;clearInterval(timer);};},[]);
 const alerts=products.filter(p=>{const s=stockState(p);return s.soldOut||s.low;});
 if(!error&&!alerts.length)return null;
 return <section className="stock-alerts" aria-label="Alertes de stock"><h2>Stock à vérifier</h2>{error&&<p role="status">{error}</p>}<ul>{alerts.map(p=><li key={p.id}><strong>{p.name}</strong><span>{p.stock_quantity===0?'Rupture de stock':`${p.stock_quantity} unité(s) restante(s)`}</span></li>)}</ul><a href="/dashboard/products">Gérer le stock →</a></section>;
}

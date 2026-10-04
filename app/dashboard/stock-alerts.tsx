'use client';
import {useEffect,useState} from 'react';
import type {Product} from '@/lib/product-templates';
import {stockState,productOptions,variantQuantity} from '@/lib/product-stock';
export default function StockAlerts(){const [products,setProducts]=useState<Product[]>([]),[error,setError]=useState('');
 useEffect(()=>{let live=true;async function load(){try{const r=await fetch('/api/products',{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json() as {products:Product[]};if(live){setProducts(d.products);setError('');}}catch{if(live)setError('Alertes de stock indisponibles. Nouvelle tentative automatique.');}}void load();const timer=setInterval(()=>{if(!document.hidden)void load();},15000);return()=>{live=false;clearInterval(timer);};},[]);
 const alerts=products.flatMap(p=>{const global=stockState({stock_quantity:p.stock_quantity,low_stock_threshold:p.low_stock_threshold});const items=global.soldOut||global.low?[{key:p.id,name:p.name,quantity:p.stock_quantity??0}]:[];for(const option of productOptions(p)){const quantity=variantQuantity(p,option);if(quantity!==null&&quantity<=(p.low_stock_threshold??5))items.push({key:JSON.stringify([p.id,option]),name:p.name+' · '+option,quantity});}return items;});
 if(!error&&!alerts.length)return null;
 return <section className="stock-alerts" aria-label="Alertes de stock"><h2>Stock à vérifier</h2>{error&&<p role="status">{error}</p>}<ul>{alerts.map(p=><li key={p.key}><strong>{p.name}</strong><span>{p.quantity===0?'Rupture de stock':`${p.quantity} unité(s) restante(s)`}</span></li>)}</ul><a href="/dashboard/products">Gérer le stock →</a></section>;
}

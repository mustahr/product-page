'use client';
import {useEffect,useState} from 'react';
import type {Product} from '@/lib/product-templates';
import {variantQuantity} from '@/lib/product-stock';
export default function VariantStockEditor({product:p,option,onSaved}:{product:Product;option:string;onSaved:(p:Product)=>void}){
 const current=variantQuantity(p,option),[value,setValue]=useState(current===null?'':String(current)),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{setValue(current===null?'':String(current));},[current]);
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{const response=await fetch('/api/products/stock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:p.id,option,quantity:value===''?null:Number(value),threshold:p.low_stock_threshold??5,expected:current,expectedThreshold:p.low_stock_threshold??5})});const d=await response.json() as {product:Product;error?:string};if(!response.ok)throw new Error(d.error||'Stock non enregistré.');onSaved(d.product);setMessage('Enregistré.');}catch(error){setMessage(error instanceof Error?error.message:'Stock non enregistré.');}finally{setBusy(false);}}
 return <form className="variant-stock-form" onSubmit={save}><label>{option}<span className={current===0?'stock-empty':current!==null&&current<=(p.low_stock_threshold??5)?'stock-low':''}>{current===null?'Sans suivi':current===0?'Rupture de stock':`${current} unité(s)`}</span><input type="number" min="0" max="1000000" step="1" value={value} placeholder="Sans suivi" onChange={e=>setValue(e.target.value)} disabled={busy} aria-label={`Stock de ${option}`}/></label><button disabled={busy}>{busy?'…':'Enregistrer'}</button><p role="status">{message}</p></form>;
}

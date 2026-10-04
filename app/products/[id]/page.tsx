'use client';
import {use,useEffect,useState} from 'react';
import ProductView from '@/components/product-view';
import type {Product} from '@/lib/product-templates';
export default function ProductPage({params}:{params:Promise<{id:string}>}){const {id}=use(params);const [p,setP]=useState<Product|null>(null),[error,setError]=useState('');useEffect(()=>{fetch('/api/products',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json() as Promise<{products:Product[]}>;}).then(d=>{const found=d.products.find((x:Product)=>x.id===id&&x.status==='published');if(found){setP(found);document.title=found.name+' | Mustahr Store';}else setError('Produit introuvable ou non publié.');}).catch(()=>setError('Produit indisponible. Réessayez.'));},[id]);return p?<ProductView product={p}/>:<main style={{padding:40}}><a href="/">← Mustahr Store</a><p role="status">{error||'Chargement du produit…'}</p>{error&&<button onClick={()=>location.reload()}>Réessayer</button>}</main>;}

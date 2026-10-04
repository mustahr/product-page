(async()=>{
 const id=location.pathname.includes('vegetable-cutter')?'vegetable-cutter':'car-charger';
 function notice(message){document.getElementById('legacy-gate')?.remove();document.body.replaceChildren();const main=document.createElement('main');main.style.cssText='padding:50px 24px;max-width:700px;margin:auto;font:18px Arial;line-height:1.6';const p=document.createElement('p');p.textContent=message;const a=document.createElement('a');a.href='/';a.textContent='← Mustahr Store';main.append(p,a);document.body.append(main);}
 try{const r=await fetch('/api/products',{cache:'no-store'});if(!r.ok)throw new Error();const data=await r.json();const p=data.products.find(p=>p.id===id&&p.status==='published');if(!p){notice('Ce produit n’est plus disponible. Découvrez les autres produits de notre boutique.');return;}if(JSON.parse(p.details||'{}').legacy!=='true'){location.replace('/products/'+id);return;}document.getElementById('legacy-gate')?.remove();}
 catch{notice('Produit momentanément indisponible. Rechargez cette page pour réessayer.');}
})();

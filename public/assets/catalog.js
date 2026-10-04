(() => {
 let products=[];
 const grid=document.querySelector('.product-grid');
 function render(){grid.querySelectorAll('[data-catalog-product]').forEach(el=>el.remove());const ar=document.documentElement.lang==='ar';
 for(const p of products.filter(p=>p.status==='published')){const card=document.createElement('article');card.className='product-card';card.dataset.catalogProduct=p.id;
 const photo=document.createElement('a');photo.className='product-image';photo.href='/products/'+encodeURIComponent(p.id);const img=document.createElement('img');img.src=p.image;img.alt=p.name;img.loading='lazy';photo.append(img);
 const info=document.createElement('div');info.className='product-info';const name=document.createElement('h3');name.textContent=p.name;const description=document.createElement('p');description.textContent=p.description;const offer=document.createElement('div');offer.className='offer';const price=document.createElement('strong');price.textContent=(p.price_cents/100).toFixed(2)+' '+(p.currency==='MAD'?'DH':'LYD');const country=document.createElement('span');country.textContent=(ar?'التوصيل: ':'Livraison : ')+p.country;offer.append(price,country);const link=document.createElement('a');link.className='button';link.href=photo.href;link.textContent=ar?'اكتشف المنتج':'Découvrir le produit';info.append(name,description,offer,link);card.append(photo,info);grid.append(card);}}
 fetch('/api/products',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>{products=d.products;render();}).catch(()=>{const note=document.createElement('p');note.textContent='Les nouveaux produits sont momentanément indisponibles. Rechargez la page pour réessayer.';note.setAttribute('role','status');grid.after(note);});
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));
})();

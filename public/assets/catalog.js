(() => {
 const grid=document.querySelector('.product-grid');if(!grid)return;
 const defaults=[
 {id:'car-charger',name:'Chargeur voiture 4-en-1',ar:'شاحن سيارة 4 في 1',category:'En route',categoryAr:'في الطريق',description:'Deux câbles rétractables et des ports USB, réunis dans un chargeur compact.',descriptionAr:'كابلان قابلان للسحب ومنافذ USB في شاحن واحد مدمج.',image:'/assets/charger-product-clean-960.webp',price_cents:17800,currency:'MAD',country:'Maroc',status:'published'},
 {id:'vegetable-cutter',name:'Coupe-légumes 9-en-1',ar:'قطاعة خضروات 9 في 1',category:'À la maison',categoryAr:'في المنزل',description:'Coupez, râpez et égouttez avec ses lames interchangeables et son panier.',descriptionAr:'قطّعي وابشري وصفّي مع شفرات قابلة للتبديل وسلة تصفية.',image:'/assets/cutter-reference-1857.webp',price_cents:15900,currency:'LYD',country:'Libye',status:'published'},
 {id:'bc-touch-coffret',name:'Coffret cheveux B&C Touch',ar:'مجموعة العناية بالشعر B&C Touch',category:'Un moment pour soi',categoryAr:'لحظة للعناية',description:'Shampooing au sidr, masque et sérum : trois essentiels dans un coffret.',descriptionAr:'شامبو بالسدر وماسك وسيروم: ثلاثة منتجات في مجموعة واحدة.',image:'/assets/bc-touch/set.webp',price_cents:18900,currency:'MAD',country:'Maroc',status:'published'}];
 let products=defaults;
 function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;}
 function href(p){return p.id==='car-charger'?'/store.html':p.id==='vegetable-cutter'?'/vegetable-cutter.html':p.id==='bc-touch-coffret'?'/bc-touch.html':'/products/'+encodeURIComponent(p.id);}
 function render(){const ar=document.documentElement.lang==='ar';const fragment=document.createDocumentFragment();
 for(const p of products.filter(p=>p.status==='published')){
 const known=defaults.find(d=>d.id===p.id)||{},card=node('article','product-card collection-card');card.dataset.catalogProduct=p.id;
 const media=node('a','product-image');media.href=href(p);media.setAttribute('aria-label',ar?(known.ar||p.name):p.name);
 const img=node('img');img.src=p.image==='/assets/charger-product-clean.png'?'/assets/charger-product-clean-960.webp':p.image==='/assets/cutter-reference.png'?'/assets/cutter-reference-1857.webp':p.image;img.alt=ar?(known.ar||p.name):p.name;img.loading='lazy';img.decoding='async';
 const badge=node('span','collection-market',ar?(p.country==='Maroc'?'المغرب':p.country==='Libye'?'ليبيا':p.country):p.country);media.append(badge);
 if(p.id==='vegetable-cutter'&&img.src.includes('cutter-reference')){const frame=node('span','cutter-frame');frame.append(img);media.append(frame);}else media.append(img);
 const info=node('div','product-info'),category=node('p','category',ar?(known.categoryAr||'اكتشف المجموعة'):(known.category||'À découvrir')),title=node('h3','',ar?(known.ar||p.name):p.name),description=node('p','collection-description',ar?(known.descriptionAr||p.description):(p.description||known.description));
 const offer=node('div','offer'),price=node('strong','',p.price_cents==null?(ar?'الثمن عند الاستفسار':'Prix sur demande'):new Intl.NumberFormat(ar?'ar-MA':'fr-MA',{maximumFractionDigits:2}).format(p.price_cents/100)+' '+(p.currency==='MAD'?(ar?'درهم':'DH'):(p.currency==='LYD'?'د.ل':p.currency)));
 offer.append(price);if(p.stock_quantity===0)offer.append(node('span','',ar?'نفد المخزون':'Rupture de stock'));
 const link=node('a','button',ar?'اكتشف المنتج':'Découvrir le produit');link.href=href(p);info.append(category,title,description,offer,link);card.append(media,info);fragment.append(card);
 }grid.replaceChildren(fragment);}
 render();
 fetch('/api/products',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(!Array.isArray(data.products))return;products=[...data.products];if(!products.some(p=>p.id==='bc-touch-coffret'||href(p)==='/bc-touch.html'))products.push(defaults[2]);render();}).catch(()=>{});
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));
})();

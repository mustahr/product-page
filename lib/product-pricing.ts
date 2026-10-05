export type PricedProduct={id:string;price_cents:number;details?:string};
export type BundleOffer={quantity:number;totalCents:number};
export function pricingDetails(p:PricedProduct):Record<string,string>{try{const value=JSON.parse(p.details||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
export function offerMode(p:PricedProduct){const mode=pricingDetails(p).offerMode;return mode==='bundles'||mode==='none'?mode:p.id==='car-charger'?'charger':'none';}
export function validateBundles(raw:unknown,priceCents:number,max=99):BundleOffer[]{
 let rows:unknown;try{rows=typeof raw==='string'&&raw.length<=4000?JSON.parse(raw):raw;}catch{throw new Error('Offres invalides.');}
 if(!Array.isArray(rows)||rows.length>6)throw new Error('Ajoutez au maximum 6 offres.');
 const seen=new Set<number>();return rows.map(row=>{if(!row||typeof row!=='object')throw new Error('Offre invalide.');const value=row as Record<string,unknown>,quantity=Number(value.quantity),total=String(value.total??'');
 if(!Number.isSafeInteger(quantity)||quantity<2||quantity>max||seen.has(quantity))throw new Error(`Chaque offre doit avoir une quantité unique entre 2 et ${max}.`);
 if(!/^\d+(?:\.\d{1,2})?$/.test(total))throw new Error('Le prix du lot doit être positif, avec au maximum 2 décimales.');
 const totalCents=Math.round(Number(total)*100);if(!Number.isSafeInteger(totalCents)||totalCents<priceCents||totalCents>=quantity*priceCents)throw new Error('Le prix du lot doit être au moins le prix d’une unité et inférieur au total sans remise.');seen.add(quantity);return {quantity,totalCents};}).sort((a,b)=>a.quantity-b.quantity);
}
export function bundleOffers(p:PricedProduct){if(offerMode(p)!=='bundles')return [];try{return validateBundles(pricingDetails(p).bundleOffers||'[]',p.price_cents,p.id==='vegetable-cutter'?11:99);}catch{return [];}}
export function productQuote(p:PricedProduct,quantity:number,shippingFee=0){
 const max=p.id==='vegetable-cutter'?11:99;
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>max)throw new Error('Quantité invalide');
 if(!Number.isSafeInteger(shippingFee)||shippingFee<0)throw new Error('Frais de livraison invalides');
 const bundle=bundleOffers(p).find(b=>b.quantity===quantity),regular=quantity*p.price_cents;
 const discount=bundle?regular-bundle.totalCents:offerMode(p)==='charger'?(quantity-1)*Math.round(p.price_cents*.1):0;
 return {discount,subtotal:regular-discount,total:regular-discount+shippingFee,max,bundle:!!bundle};
}

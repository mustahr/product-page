export type PricedProduct={id:string;price_cents:number;details?:string};
export function discountSettings(p:PricedProduct){
 let details:Record<string,string>={};try{details=JSON.parse(p.details||'{}')||{};}catch{}
 const enabled=details.discountEnabled==='true'||(details.discountEnabled===undefined&&p.id==='car-charger'&&(!details.offerMode||details.offerMode==='charger'));
 const value=Number(details.discountPercent??10),percent=Number.isFinite(value)&&value>=0&&value<=100?value:10;
 return {enabled,percent};
}
export function productQuote(p:PricedProduct,quantity:number,shippingFee=0){
 const max=p.id==='vegetable-cutter'?11:99;
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>max)throw new Error('Quantité invalide');
 if(!Number.isSafeInteger(shippingFee)||shippingFee<0)throw new Error('Frais de livraison invalides');
 const settings=discountSettings(p),discount=settings.enabled?(quantity-1)*Math.round(p.price_cents*settings.percent/100):0;
 return {discount,subtotal:quantity*p.price_cents-discount,total:quantity*p.price_cents-discount+shippingFee,max};
}

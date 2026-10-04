export function productQuote(p:{id:string;price_cents:number},quantity:number,shippingFee=0){
 const max=p.id==='vegetable-cutter'?11:99;
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>max)throw new Error('Quantité invalide');
 const discount=p.id==='car-charger'?(quantity-1)*Math.round(p.price_cents*.1):0;
 return {discount,total:quantity*p.price_cents-discount+shippingFee,max};
}

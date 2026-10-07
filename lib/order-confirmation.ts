import {customerContact} from './customer-contact';
export const contactOutcomes=['','Sans réponse','À rappeler','Client joint'] as const;
export type Confirmation={notes:string;outcome:string;follow_up_date:string;revision:number};
export const emptyConfirmation:Confirmation={notes:'',outcome:'',follow_up_date:'',revision:0};
export function validateConfirmation(input:Record<string,unknown>){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Données invalides.');
 if(typeof input.id!=='string'||!/^[a-f0-9-]{36}$/i.test(input.id))throw Error('Référence invalide.');
 if(typeof input.notes!=='string'||input.notes.length>2000)throw Error('Les notes sont limitées à 2 000 caractères.');
 if(typeof input.outcome!=='string'||!contactOutcomes.some(outcome=>outcome===input.outcome))throw Error('Résultat d’appel invalide.');
 if(typeof input.follow_up_date!=='string')throw Error('Date de relance invalide.');
 const date=input.follow_up_date;
 if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<'2020-01-01'||date>'2100-12-31'||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date))throw Error('Date de relance invalide.');
 if(typeof input.revision!=='number'||!Number.isSafeInteger(input.revision)||input.revision<0)throw Error('Version invalide.');
 return {id:input.id,notes:input.notes.trim(),outcome:input.outcome,follow_up_date:date,revision:input.revision};
}
export function moroccoDate(now=new Date()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const value=(type:string)=>parts.find(part=>part.type===type)!.value;return `${value('year')}-${value('month')}-${value('day')}`;}
export function followUpDue(order:{status:string;confirmation?:Confirmation},today:string){return ['Nouveau','À confirmer','Confirmé','En préparation'].includes(order.status)&&!!order.confirmation?.follow_up_date&&order.confirmation.follow_up_date<=today;}
export function confirmationMessage(order:{id:string;name:string;product_name:string;quantity:number;total_cents:number;currency:string;city:string;address:string},language:'fr'|'ar'){
 const reference=order.id.slice(0,8).toUpperCase(),total=(order.total_cents/100).toFixed(2)+' '+(order.currency==='MAD'?'DH':order.currency);
 return language==='ar'?`مرحباً ${order.name}، معك متجر Mustahr بخصوص طلبك #${reference}.\n\nالمنتج: ${order.product_name}\nالكمية: ${order.quantity}\nالمبلغ الإجمالي: ${total}\nعنوان التوصيل: ${order.city}، ${order.address}\n\nيرجى تأكيد المنتج والكمية والعنوان حتى نتمكن من تجهيز طلبك. شكراً لك.`:`Bonjour ${order.name}, ici Mustahr Store au sujet de votre commande #${reference}.\n\nProduit : ${order.product_name}\nQuantité : ${order.quantity}\nTotal : ${total}\nAdresse de livraison : ${order.city}, ${order.address}\n\nMerci de confirmer le produit, la quantité et l’adresse afin que nous puissions préparer votre commande.`;
}
export function confirmationLink(phone:string,currency:string,message:string){const base=customerContact(phone,currency).whatsapp;return base&&message.trim()?base+'?text='+encodeURIComponent(message):null;}

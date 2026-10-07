export const deliveryIncidents=['','Refusé','Retour en cours','Retourné'] as const;
export type Delivery={courier:string;tracking_number:string;tracking_url:string;incident:string;reason:string;revision:number};
export const emptyDelivery:Delivery={courier:'',tracking_number:'',tracking_url:'',incident:'',reason:'',revision:0};
export function validateDelivery(input:Record<string,unknown>){
 if(!input||typeof input!=='object'||Array.isArray(input)||typeof input.id!=='string'||!/^[a-f0-9-]{36}$/i.test(input.id))throw Error('Référence invalide.');
 for(const [key,max] of Object.entries({courier:100,tracking_number:120,tracking_url:500,reason:1000}))if(typeof input[key]!=='string'||(input[key] as string).length>max)throw Error('Vérifiez les informations et la longueur des champs.');
 if(typeof input.incident!=='string'||!deliveryIncidents.some(v=>v===input.incident))throw Error('Incident invalide.');
 if(input.incident&&!(input.reason as string).trim())throw Error('Indiquez le motif du refus ou du retour.');
 const url=(input.tracking_url as string).trim();if(url){let parsed;try{parsed=new URL(url);}catch{throw Error('Lien de suivi invalide.');}if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error('Utilisez un lien de suivi HTTPS sans identifiants.');}
 if(typeof input.revision!=='number'||!Number.isSafeInteger(input.revision)||input.revision<0)throw Error('Version invalide.');
 return {id:input.id,courier:(input.courier as string).trim(),tracking_number:(input.tracking_number as string).trim(),tracking_url:url,incident:input.incident,reason:(input.reason as string).trim(),revision:input.revision};
}
export function safeTrackingUrl(value:string){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}

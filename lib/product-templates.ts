export const templates = [
 {id:'electronics',name:'Électronique',icon:'↗',color:'#2449ee',light:'#edf1ff',layout:'split',tag:'La technologie au quotidien'},
 {id:'car',name:'Auto & accessoires',icon:'⚡',color:'#17384a',light:'#e7f3f7',layout:'split',tag:'Bien équipé, sur chaque trajet'},
 {id:'kitchen',name:'Cuisine',icon:'◉',color:'#547329',light:'#eff5df',layout:'editorial',tag:'Préparer devient plus simple'},
 {id:'home',name:'Maison & déco',icon:'⌂',color:'#866548',light:'#f7efe6',layout:'editorial',tag:'Une maison qui vous ressemble'},
 {id:'beauty',name:'Beauté & soin',icon:'✦',color:'#a14369',light:'#fbeef3',layout:'centered',tag:'Votre moment de soin'},
 {id:'fashion',name:'Mode & accessoires',icon:'◇',color:'#262626',light:'#efefec',layout:'editorial',tag:'Le détail qui fait votre style'},
 {id:'fitness',name:'Sport & fitness',icon:'➚',color:'#d14d20',light:'#fff0e6',layout:'split',tag:'Prêt pour votre prochain objectif'},
 {id:'baby',name:'Bébé & enfants',icon:'☀',color:'#337b82',light:'#e9f7f5',layout:'centered',tag:'Des idées pour les petits'},
 {id:'pets',name:'Animaux',icon:'♡',color:'#8052b5',light:'#f3edfc',layout:'centered',tag:'Pour vos compagnons'},
 {id:'gifts',name:'Cadeaux & découvertes',icon:'✧',color:'#b97916',light:'#fff5df',layout:'centered',tag:'Une belle idée à offrir'}
] as const;
export type Product={id:string;name:string;description:string;benefits:string;image:string;price_cents:number;currency:string;country:string;template:string;language:string;status:string;created_at:string;details:string};
export function validateProduct(input:Record<string,unknown>){
 const text=(k:string,n:number)=>typeof input[k]==='string'?(input[k] as string).trim().slice(0,n):'';
 const raw=typeof input.details==='object'&&input.details!==null?input.details as Record<string,unknown>:{};
 const detail=Object.fromEntries(detailFields.map(f=>[f.key,typeof raw[f.key]==='string'?(raw[f.key] as string).trim().slice(0,4000):'']));
 if((detail.variants||'').split('\n').some(v=>v.trim().length>200))throw new Error('Chaque option doit contenir au maximum 200 caractères.');
 const fee=Number(raw.shippingFee||0);if(!Number.isFinite(fee)||fee<0||fee>100000)throw new Error('Frais de livraison invalides.');detail.shippingFee=String(fee);
 for(const url of String(detail.gallery||'').split('\n').filter(Boolean)){try{if(new URL(url).protocol!=='https:')throw new Error();}catch{throw new Error('Les images de galerie doivent être des liens HTTPS.');}}
 if(detail.faq&&detail.faq.split('\n').filter(Boolean).some(line=>!line.includes('|')||!line.split('|')[0].trim()||!line.split('|').slice(1).join('|').trim()))throw new Error('Format FAQ : Question | Réponse, une par ligne.');
 if(input.status==='published'&&['specifications','included','shippingTime','coverage','returns','warranty','support'].some(k=>!detail[k]))throw new Error('Complétez les caractéristiques, le contenu, la livraison, les retours, la garantie et le contact avant publication.');
 const p={details:JSON.stringify(detail),id:text('id',36)||crypto.randomUUID(),name:text('name',120),description:text('description',2000),benefits:text('benefits',2000),image:text('image',1500),price_cents:Math.round(Number(input.price)*100),country:text('country',20),template:text('template',40),language:text('language',2),status:text('status',20),currency:text('country',20)==='Libye'?'LYD':'MAD'};
 if(!/^[a-f0-9-]{36}$/i.test(p.id)||!p.name||!p.description||!Number.isSafeInteger(p.price_cents)||p.price_cents<100||p.price_cents>100000000||!templates.some(t=>t.id===p.template)||!['Maroc','Libye'].includes(p.country)||!['fr','ar'].includes(p.language)||!['draft','published'].includes(p.status))throw new Error('Vérifiez les champs obligatoires et le prix.');
 try{if(new URL(p.image).protocol!=='https:')throw new Error();}catch{throw new Error('Ajoutez une URL d’image HTTPS valide.');}
 return p;
}

export const detailFields=[
 {key:'sku',label:'Référence / modèle',hint:'Marque et référence exacte, si disponibles.',group:'Caractéristiques'},
 {key:'specifications',label:'Caractéristiques techniques',hint:'Une par ligne : puissance, capacité, fonctions ou autres caractéristiques réelles.',group:'Caractéristiques'},
 {key:'dimensions',label:'Dimensions & poids',hint:'Précisez les unités : cm, mm, g ou kg.',group:'Caractéristiques'},
 {key:'materials',label:'Matériaux / ingrédients',hint:'Composition exacte, selon la catégorie.',group:'Caractéristiques'},
 {key:'compatibility',label:'Compatibilité / à qui convient-il ?',hint:'Appareils, tailles, usages ou public concernés.',group:'Caractéristiques'},
 {key:'variants',label:'Couleurs / tailles / options disponibles',hint:'Une option par ligne. Le client la choisira dans son formulaire.',group:'Caractéristiques'},
 {key:'included',label:'Contenu de la boîte',hint:'Listez tout ce que l’acheteur reçoit, sans ajouter d’accessoire non inclus.',group:'Utilisation & contenu'},
 {key:'usage',label:'Mode d’emploi',hint:'Étapes simples pour utiliser le produit.',group:'Utilisation & contenu'},
 {key:'care',label:'Entretien & précautions',hint:'Nettoyage, stockage, avertissements et restrictions utiles.',group:'Utilisation & contenu'},
 {key:'gallery',label:'Images supplémentaires · URLs HTTPS',hint:'Un lien direct par ligne, dans l’ordre de la galerie.',group:'Photos'},
 {key:'shippingTime',label:'Délai de livraison',hint:'Exemple : 2 à 5 jours ouvrables après confirmation, uniquement si exact.',group:'Livraison & service'},
 {key:'coverage',label:'Zones desservies / exclusions',hint:'Villes ou régions couvertes et éventuelles exclusions.',group:'Livraison & service'},
 {key:'shippingFee',label:'Frais de livraison par commande',hint:'Dans la devise du produit. 0 pour la livraison gratuite.',group:'Livraison & service'},
 {key:'returns',label:'Politique de retour / échange',hint:'Délai, conditions, procédure et qui paie les frais.',group:'Livraison & service'},
 {key:'warranty',label:'Garantie',hint:'Durée et couverture. Écrivez « Aucune garantie commerciale » si applicable.',group:'Livraison & service'},
 {key:'support',label:'Contact du service client',hint:'Téléphone, WhatsApp ou email, et horaires si utiles.',group:'Livraison & service'},
 {key:'faq',label:'Questions fréquentes',hint:'Une ligne par question : Question | Réponse.',group:'Questions fréquentes'}
] as const;
export function readDetails(p:{details?:string}):Record<string,string>{try{const d=JSON.parse(p.details||'{}');return d&&typeof d==='object'?d:{};}catch{return {};}}

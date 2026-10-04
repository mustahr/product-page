export const templates = [
 {id:'electronics',name:'Électronique',icon:'↗',color:'#2449ee',light:'#e9edff',design:'Studio électrique',layout:'split',tag:'La technologie au quotidien'},
 {id:'car',name:'Auto & accessoires',icon:'⚡',color:'#ffc55a',light:'#1b2731',design:'Route / Édition nuit',layout:'split',tag:'Bien équipé, sur chaque trajet'},
 {id:'kitchen',name:'Cuisine',icon:'◉',color:'#b83224',light:'#fff5dd',design:'Cuisine solaire',layout:'editorial',tag:'Préparer devient plus simple'},
 {id:'home',name:'Maison & déco',icon:'⌂',color:'#69503b',light:'#eee6db',design:'Maison atelier',layout:'editorial',tag:'Une maison qui vous ressemble'},
 {id:'beauty',name:'Beauté & soin',icon:'✦',color:'#593444',light:'#f4e9e3',design:'Rituel botanique',layout:'centered',tag:'Votre moment de soin'},
 {id:'fashion',name:'Mode & accessoires',icon:'◇',color:'#171717',light:'#e9e9e7',design:'Édition essentielle',layout:'editorial',tag:'Le détail qui fait votre style'},
 {id:'fitness',name:'Sport & fitness',icon:'➚',color:'#c9ff53',light:'#252a27',design:'Performance club',layout:'split',tag:'Prêt pour votre prochain objectif'},
 {id:'baby',name:'Bébé & enfants',icon:'☀',color:'#6653a4',light:'#f3eafb',design:'Petites merveilles',layout:'centered',tag:'Des idées pour les petits'},
 {id:'pets',name:'Animaux',icon:'♡',color:'#14564b',light:'#e5f1de',design:'Compagnons club',layout:'centered',tag:'Pour vos compagnons'},
 {id:'gifts',name:'Cadeaux & découvertes',icon:'✧',color:'#762f45',light:'#f5eadb',design:'Un bel instant',layout:'centered',tag:'Une belle idée à offrir'}
] as const;
export type Product={id:string;name:string;description:string;benefits:string;image:string;price_cents:number;currency:string;country:string;template:string;language:string;status:string;created_at:string;details:string;stock_quantity?:number|null;low_stock_threshold?:number;variant_stock?:Record<string,number|null>};
export function validateProduct(input:Record<string,unknown>){
 const text=(k:string,n:number)=>typeof input[k]==='string'?(input[k] as string).trim().slice(0,n):'';
 const raw=typeof input.details==='object'&&input.details!==null?input.details as Record<string,unknown>:{};
 const detail=Object.fromEntries(detailFields.map(f=>[f.key,typeof raw[f.key]==='string'?(raw[f.key] as string).trim().slice(0,4000):'']));
 if((detail.variants||'').split('\n').some(v=>v.trim().length>200))throw new Error('Chaque option doit contenir au maximum 200 caractères.');
 const options=(detail.variants||'').split('\n').map(v=>v.trim()).filter(Boolean);if(new Set(options).size!==options.length)throw new Error('Chaque couleur, taille ou option doit avoir un nom unique.');
 const fee=Number(raw.shippingFee||0);if(!Number.isFinite(fee)||fee<0||fee>100000)throw new Error('Frais de livraison invalides.');detail.shippingFee=String(fee);
 for(const url of String(detail.gallery||'').split('\n').filter(Boolean)){try{if(!validImageUrl(url.trim()))throw new Error();}catch{throw new Error('Les images de galerie doivent être des liens HTTPS.');}}
 if(detail.faq&&detail.faq.split('\n').filter(Boolean).some(line=>!line.includes('|')||!line.split('|')[0].trim()||!line.split('|').slice(1).join('|').trim()))throw new Error('Format FAQ : Question | Réponse, une par ligne.');
 if(input.status==='published'&&['specifications','included','shippingTime','coverage','returns','warranty','support'].some(k=>!detail[k]))throw new Error('Complétez les caractéristiques, le contenu, la livraison, les retours, la garantie et le contact avant publication.');
 const p={details:JSON.stringify(detail),id:text('id',36)||crypto.randomUUID(),name:text('name',120),description:text('description',2000),benefits:text('benefits',2000),image:text('image',1500),price_cents:Math.round(Number(input.price)*100),country:text('country',20),template:text('template',40),language:text('language',2),status:text('status',20),currency:text('country',20)==='Libye'?'LYD':'MAD'};
 if(!isProductId(p.id)||!p.name||!p.description||!Number.isSafeInteger(p.price_cents)||p.price_cents<100||p.price_cents>100000000||!templates.some(t=>t.id===p.template)||!['Maroc','Libye'].includes(p.country)||!['fr','ar'].includes(p.language)||!['draft','published'].includes(p.status))throw new Error('Vérifiez les champs obligatoires et le prix.');
 try{if(!validImageUrl(p.image))throw new Error();}catch{throw new Error('Ajoutez une URL d’image HTTPS valide.');}
 return p;
}

export const detailFields=[
 {key:'sku',label:'Référence / modèle',hint:'Marque et référence exacte, si disponibles.',group:'Caractéristiques'},
 {key:'specifications',label:'Caractéristiques techniques',hint:'Une par ligne : puissance, capacité, fonctions ou autres caractéristiques réelles.',group:'Caractéristiques'},
 {key:'dimensions',label:'Dimensions & poids',hint:'Précisez les unités : cm, mm, g ou kg.',group:'Caractéristiques'},
 {key:'materials',label:'Matériaux / ingrédients',hint:'Composition exacte, selon la catégorie.',group:'Caractéristiques'},
 {key:'compatibility',label:'Compatibilité / à qui convient-il ?',hint:'Appareils, tailles, usages ou public concernés.',group:'Caractéristiques'},
 {key:'variants',label:'Couleurs / tailles / options disponibles',hint:'Une option unique par ligne, par exemple Noir · M. Gérez sa quantité ensuite dans Mes produits → Gérer le stock.',group:'Caractéristiques'},
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

export function isProductId(id:string){return /^(?:[a-f0-9-]{36}|car-charger|vegetable-cutter)$/i.test(id);}
export function validImageUrl(url:string){if(/^\/assets\/[a-zA-Z0-9_./-]+$/.test(url)&&!url.includes('..'))return true;try{return new URL(url).protocol==='https:';}catch{return false;}}

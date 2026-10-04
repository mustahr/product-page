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
export type Product={id:string;name:string;description:string;benefits:string;image:string;price_cents:number;currency:string;country:string;template:string;language:string;status:string;created_at:string};
export function validateProduct(input:Record<string,unknown>){
 const text=(k:string,n:number)=>typeof input[k]==='string'?(input[k] as string).trim().slice(0,n):'';
 const p={id:text('id',36)||crypto.randomUUID(),name:text('name',120),description:text('description',2000),benefits:text('benefits',2000),image:text('image',1500),price_cents:Math.round(Number(input.price)*100),country:text('country',20),template:text('template',40),language:text('language',2),status:text('status',20),currency:text('country',20)==='Libye'?'LYD':'MAD'};
 if(!/^[a-f0-9-]{36}$/i.test(p.id)||!p.name||!p.description||!Number.isSafeInteger(p.price_cents)||p.price_cents<100||p.price_cents>100000000||!templates.some(t=>t.id===p.template)||!['Maroc','Libye'].includes(p.country)||!['fr','ar'].includes(p.language)||!['draft','published'].includes(p.status))throw new Error('Vérifiez les champs obligatoires et le prix.');
 try{if(new URL(p.image).protocol!=='https:')throw new Error();}catch{throw new Error('Ajoutez une URL d’image HTTPS valide.');}
 return p;
}

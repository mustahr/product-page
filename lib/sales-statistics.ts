export type ProductSales={product_id:string;product_name:string;currency:string;orders:number;confirmed:number;delivered:number;cancelled:number;pending:number;delivered_units:number;revenue_cents:number;catalog_status:string|null;source?:string;medium?:string;campaign_id?:string;adset_id?:string;ad_id?:string;content?:string};
export type SalesReport={products:ProductSales[];generatedAt:string};
export function localDate(now=new Date()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);return ['year','month','day'].map(k=>parts.find(p=>p.type===k)!.value).join('-');}
export function shiftDate(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function dayStart(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<'1000-01-01'||date>'9998-12-31'||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw new Error('Date invalide.');
 const target=Date.parse(date+'T00:00:00Z');let utc=target;
 const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 for(let i=0;i<3;i++){const parts=formatter.formatToParts(new Date(utc));const n=(key:string)=>Number(parts.find(p=>p.type===key)!.value);utc+=target-Date.UTC(n('year'),n('month')-1,n('day'),n('hour'),n('minute'),n('second'));}
 return new Date(utc).toISOString();
}
export function salesQuery(params:URLSearchParams,group:"product"|"campaign"|"ad"="product"){
 const from=params.get('from')||'',to=params.get('to')||'',currency=params.get('currency')||'';
 if(currency&&!['MAD','LYD'].includes(currency))throw new Error('Devise invalide.');
 if(!!from!==!!to)throw new Error('Sélectionnez les deux dates.');
 const clauses:string[]=[],bindings:string[]=[];
 if(from){const start=dayStart(from);dayStart(to);if(from>to)throw new Error('La date de fin doit suivre la date de début.');clauses.push('o.created_at>=? AND o.created_at<?');bindings.push(start,dayStart(shiftDate(to,1)));}
 if(currency){clauses.push('o.currency=?');bindings.push(currency);}
 const field=(key:string)=>`COALESCE(json_extract(CASE WHEN json_valid(o.attribution) THEN o.attribution ELSE '{}' END,'$.${key}'),'')`;
 const source=field('utm_source'),medium=field('utm_medium'),campaign=field('utm_campaign'),campaignId=field('campaign_id'),adsetId=field('adset_id'),adId=field('ad_id'),content=field('utm_content');
 const dimensions=[source,medium,campaign,campaignId,...(group==='ad'?[adsetId,adId,content]:[])];
 const campaignSelect=`json_array(${dimensions.join(',')}) AS product_id,COALESCE(NULLIF(${campaign},''),NULLIF(${campaignId},''),'Sans campagne identifiée') AS product_name,o.currency,NULL AS catalog_status,${source} AS source,${medium} AS medium,${campaignId} AS campaign_id,${group==='ad'?adsetId:"''"} AS adset_id,${group==='ad'?adId:"''"} AS ad_id,${group==='ad'?content:"''"} AS content,`;
 let sql=`SELECT o.product_id, COALESCE(MAX(p.name),MAX(o.product_name)) AS product_name,o.currency,MAX(p.status) AS catalog_status,
 COUNT(*) AS orders,
 SUM(CASE WHEN o.status IN ('Confirmé','En préparation','Expédié','Livré') THEN 1 ELSE 0 END) AS confirmed,
 SUM(CASE WHEN o.status='Livré' THEN 1 ELSE 0 END) AS delivered,
 SUM(CASE WHEN o.status='Annulé' THEN 1 ELSE 0 END) AS cancelled,
 SUM(CASE WHEN o.status IN ('Nouveau','À confirmer') THEN 1 ELSE 0 END) AS pending,
 SUM(CASE WHEN o.status='Livré' THEN o.quantity ELSE 0 END) AS delivered_units,
 SUM(CASE WHEN o.status='Livré' THEN o.total_cents ELSE 0 END) AS revenue_cents
 FROM orders o LEFT JOIN products p ON p.id=o.product_id ${clauses.length?'WHERE '+clauses.join(' AND '):''}
 GROUP BY o.product_id,o.currency ORDER BY orders DESC,o.product_id,o.currency`;
 if(group!=='product')sql=sql.replace('o.product_id, COALESCE(MAX(p.name),MAX(o.product_name)) AS product_name,o.currency,MAX(p.status) AS catalog_status,',campaignSelect).replace('GROUP BY o.product_id,o.currency ORDER BY orders DESC,o.product_id,o.currency',`GROUP BY ${dimensions.join(',')},o.currency ORDER BY orders DESC,product_id,o.currency`);
 return {sql,bindings};
}
export function salesTotals(products:ProductSales[]){return products.reduce((totals,p)=>{totals.orders+=p.orders;totals.confirmed+=p.confirmed;totals.delivered+=p.delivered;totals.cancelled+=p.cancelled;totals.pending+=p.pending;totals.revenue[p.currency]=(totals.revenue[p.currency]||0)+p.revenue_cents;return totals;},{orders:0,confirmed:0,delivered:0,cancelled:0,pending:0,revenue:{} as Record<string,number>});}

import {type Delivery} from './order-delivery';
import {type Confirmation} from './order-confirmation';
import {customerContact} from './customer-contact';
export type HistoryRow={id:string;created_at:string;phone:string;currency:string;status:string;product_id?:string;product_name:string;variant?:string;quantity:number;total_cents:number};
export type CustomerSignals={otherOrders:number;delivered:number;cancelled:number;duplicateIds:string[]};
export type CustomerOrder=HistoryRow & {name:string;city:string;address:string;customer?:CustomerSignals;confirmation?:Confirmation;language?:string;delivery?:Delivery};
export const activeOrder=(status:string)=>['Nouveau','À confirmer','Confirmé','En préparation','Expédié'].includes(status);
export function customerKey(phone:string,currency:string){
 const digits=phone.replace(/\D/g,'');if(digits.length<8||digits.length>15)return null;
 const whatsapp=customerContact(phone,currency).whatsapp;
 return whatsapp?whatsapp.slice('https://wa.me/'.length):currency+':'+digits;
}
export function customerGroups(rows:HistoryRow[]){const groups=new Map<string,HistoryRow[]>();for(const row of rows){const key=customerKey(row.phone,row.currency);if(key){const group=groups.get(key)||[];group.push(row);groups.set(key,group);}}return groups;}
export function possibleDuplicates(order:HistoryRow,rows:HistoryRow[]){
 if(!activeOrder(order.status))return [];
 const key=customerKey(order.phone,order.currency),time=Date.parse(order.created_at);
 if(!key||!Number.isFinite(time))return [];
 return rows.filter(other=>other.id!==order.id&&customerKey(other.phone,other.currency)===key&&activeOrder(other.status)&&other.currency===order.currency&&(other.product_id||other.product_name)===(order.product_id||order.product_name)&&(other.variant??other.product_name)===(order.variant??order.product_name)&&other.quantity===order.quantity&&other.total_cents===order.total_cents&&Math.abs(Date.parse(other.created_at)-time)<=48*60*60*1000);
}
export function customerSignals(order:HistoryRow,rows:HistoryRow[]):CustomerSignals{const key=customerKey(order.phone,order.currency),others=key?rows.filter(o=>o.id!==order.id&&customerKey(o.phone,o.currency)===key):[];return {otherOrders:others.length,delivered:others.filter(o=>o.status==='Livré').length,cancelled:others.filter(o=>o.status==='Annulé').length,duplicateIds:possibleDuplicates(order,others).map(o=>o.id)};}

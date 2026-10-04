import {readDetails,type Product} from './product-templates';
export function productOptions(p:{details?:string}){return [...new Set((readDetails(p).variants||'').split('\n').map(v=>v.trim()).filter(Boolean))];}
export function variantQuantity(p:Pick<Product,'variant_stock'>,option:string){return p.variant_stock&&Object.hasOwn(p.variant_stock,option)?p.variant_stock[option]??null:null;}
export function optionQuantity(p:Pick<Product,'stock_quantity'|'variant_stock'>,option:string){const all=p.stock_quantity??null,one=variantQuantity(p,option);return all===null?one:one===null?all:Math.min(all,one);}
export function stockState(p:Pick<Product,'stock_quantity'|'low_stock_threshold'|'variant_stock'> & {details?:string},selected?:string){
 const options=productOptions(p),values=options.map(option=>optionQuantity(p,option));
 const quantity=selected?optionQuantity(p,selected):options.length?values.some(q=>q===null)?p.stock_quantity??null:Math.min(p.stock_quantity??Infinity,values.reduce<number>((sum,q)=>sum+(q??0),0)):p.stock_quantity??null;
 return {tracked:quantity!==null,quantity,soldOut:quantity===0,low:quantity!==null&&quantity>0&&quantity<=(p.low_stock_threshold??5)};
}
export function stockInput(input:Record<string,unknown>){
 const quantity=input.quantity,threshold=input.threshold,expected=input.expected,expectedThreshold=input.expectedThreshold;
 const valid=(n:unknown):n is number=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<=1000000;
 if(!(quantity===null||valid(quantity))||!valid(threshold)||!(expected===null||valid(expected))||!valid(expectedThreshold))throw new Error('Entrez des quantités entières entre 0 et 1 000 000.');
 return {quantity,threshold,expected,expectedThreshold};
}

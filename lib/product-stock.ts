import type {Product} from './product-templates';
export function stockState(p:Pick<Product,'stock_quantity'|'low_stock_threshold'>){
 const quantity=p.stock_quantity??null;
 return {tracked:quantity!==null,quantity,soldOut:quantity===0,low:quantity!==null&&quantity>0&&quantity<=(p.low_stock_threshold??5)};
}
export function stockInput(input:Record<string,unknown>){
 const quantity=input.quantity,threshold=input.threshold,expected=input.expected,expectedThreshold=input.expectedThreshold;
 const valid=(n:unknown):n is number=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<=1000000;
 if(!(quantity===null||valid(quantity))||!valid(threshold)||!(expected===null||valid(expected))||!valid(expectedThreshold))throw new Error('Entrez des quantités entières entre 0 et 1 000 000.');
 return {quantity,threshold,expected,expectedThreshold};
}
